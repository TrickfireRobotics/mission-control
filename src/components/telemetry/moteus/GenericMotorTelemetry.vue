<script lang="ts" setup>
import { onMounted, type Ref, ref } from 'vue';
import DropDownItem from './DropDownItem.vue';
import TelemetryDataDisplay from './TelemetryDataDisplay.vue';
import { SaveCSVData } from '@/lib/saveCSVData';
import { type MoteusMotorState, useTelemetry } from '@/lib/roslibUtils/telemetry';

onMounted(() => initialize());

export interface GenericMotorTelemetryProps {
  displayName: string;
  dataSourceMethod: (
    param: number,
    dataCallback: (result: { json_payload: string }) => void,
  ) => void;
  dataSourceParameter: number;
  updateMs: number;
  showAllFeatures: boolean;
  motorType: string;
}

const props = defineProps<GenericMotorTelemetryProps>();

// TODO: We need one telemetry for displaying the data,
//       and a separate one for recording (recording shouldn't stop on navigate).
const telemetry = useTelemetry();

const isRecordingData = ref(false);
let csvData: SaveCSVData;

const showCheckbox = ref(true);

/**
 * Describes one data field we can display / record for a motor.
 */
interface MotorDataField {
  identifier: keyof MoteusMotorState;
  prettyName: string;
  dataValue: string;
  isSelected: boolean;
  shouldRecordData: boolean;
}

const motorDataFields: Ref<MotorDataField[]> = ref(
  createDataChoices({
    position:      'Position',
    velocity:      'Velocity',
    torque:        'Torque',
    temperature:   'Temperature',
    power:         'Power',
    input_voltage: 'Voltage',
    q_current:     'Q Phase',
    d_current:     'D Phase',
  }),
);

function initialize() {
  csvData = new SaveCSVData();
}

function createDataChoices(
  idToPretty: Partial<Record<keyof MoteusMotorState, string>>,
): MotorDataField[] {
  const output: MotorDataField[] = [];
  for (const key in idToPretty) {
    output.push({
      identifier: key as keyof MoteusMotorState,
      prettyName: idToPretty[key as keyof MoteusMotorState] as string,
      dataValue: 'N/A',
      isSelected: true,
      shouldRecordData: true,
    });
  }
  return output;
}

function motorDataToString(data: string | number | null | undefined): string {
  if (typeof data === 'string') data = parseFloat(data);
  if (typeof data !== 'number') data = null;

  if (!Number.isNaN(data) && data != null) {
    return Number.isInteger(data) ? data.toString() : data.toFixed(5);
  }
  return 'N/A';
}

function dataCallback(result: MoteusMotorState[]) {
  const motor = result.find((motor) => motor.can_id === props.dataSourceParameter);
  if (!motor) return;

  for (const item of motorDataFields.value) {
    item.dataValue = motorDataToString(motor[item.identifier]);
  }

  constructRecordingEntry();
}

function constructRecordingEntry() {
  const row: string[] = [];
  for (const entry of motorDataFields.value) {
    if (entry.shouldRecordData) {
      row.push(entry.dataValue !== 'N/A' ? entry.dataValue : ' ');
    }
  }
  csvData.addDataEntry(row);
}

function itemClicked(itemName: string) {
  const field = getFieldByIdentifier(itemName);
  if (field) field.isSelected = !field.isSelected;
}

function recordButtonPressed() {
  if (!isRecordingData.value) {
    showCheckbox.value = false;
    csvData = new SaveCSVData();

    const header: string[] = [];
    for (const entry of motorDataFields.value) {
      if (entry.shouldRecordData) header.push(entry.identifier);
    }
    csvData.setHeader(header);
    telemetry.start(dataCallback);
  } else {
    showCheckbox.value = true;
    telemetry.stop();
    if (props.displayName) csvData.saveToFile(props.displayName);
  }

  isRecordingData.value = !isRecordingData.value;
}

function getFieldByIdentifier(itemName: string): MotorDataField | null {
  return motorDataFields.value.find((e) => e.identifier === itemName) ?? null;
}

function checkboxClicked(name: string) {
  const field = getFieldByIdentifier(name);
  if (field) field.shouldRecordData = !field.shouldRecordData;
}

defineExpose({ recordButtonPressed });
</script>

<template>
  <div class="motor-card">
    <!-- ── Card header ── -->
    <div class="card-header">
      <div class="card-title-block">
        <h3 class="motor-name">{{ displayName }}</h3>
        <span class="motor-badge">{{ motorType }}</span>
      </div>

      <div class="card-actions">
        <!-- Field selector dropdown -->
        <div class="dropdown">
          <button class="button-secondary btn-sm">Fields</button>
          <div class="dropdown-content">
            <DropDownItem
              v-for="item in motorDataFields"
              :key="item.prettyName"
              :item-name="item.prettyName"
              :is-selected="item.isSelected"
              @callback="itemClicked(item.identifier)"
            />
          </div>
        </div>

        <!-- Record button -->
        <button
          v-if="showAllFeatures"
          class="btn-sm"
          :class="{ 'button-toggle--on': !isRecordingData, 'button-toggle--off': isRecordingData }"
          @click="recordButtonPressed"
        >
          {{ isRecordingData ? 'Stop' : 'Record' }}
        </button>
      </div>
    </div>

    <!-- ── Data grid ── -->
    <div class="data-grid">
      <TelemetryDataDisplay
        v-for="item in motorDataFields"
        :key="item.identifier"
        :item-name="item.prettyName"
        :item-identifier="item.identifier"
        :is-selected="item.isSelected"
        :value="item.dataValue"
        :should-record-data="item.shouldRecordData"
        :should-show-check-box="showCheckbox"
        :show-all-features="showAllFeatures"
        @checkbox-clicked="checkboxClicked"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
// ── Card shell ───────────────────────────────────────────────────────────────
.motor-card {
  background: var(--grey);
  border: 1px solid var(--light-grey);
  border-top: 2px solid var(--tf-green-mid);
  border-radius: 4px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

// ── Header ───────────────────────────────────────────────────────────────────
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.card-title-block {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.motor-name {
  font-size: 0.88rem;
  color: var(--white);
  margin: 0;
  line-height: 1.2;
}

.motor-badge {
  display: inline-block;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--tf-green);
  background: var(--tf-green-dim);
  border: 1px solid var(--tf-green-mid);
  border-radius: 3px;
  padding: 1px 5px;
  width: fit-content;
}

// ── Action buttons ────────────────────────────────────────────────────────────
.card-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

.btn-sm {
  padding: 4px 10px;
  font-size: 0.75rem;
}

// ── Data grid ─────────────────────────────────────────────────────────────────
.data-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.3rem;
}

// ── Dropdown ─────────────────────────────────────────────────────────────────
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  background: var(--component-background);
  border: 1px solid var(--light-grey);
  border-radius: 4px;
  min-width: 160px;
  z-index: 50;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  padding: 4px;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
