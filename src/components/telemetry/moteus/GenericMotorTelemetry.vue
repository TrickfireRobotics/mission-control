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

let isRecordingData = ref(false);
let csvData: SaveCSVData;

// We use this to fill up csv data
// Each element is another array that holds the actual data
let showCheckbox = ref(true);

/**
 * This is used to store what kind of data we will be displaying
 * and handling through the whole thing.
 *
 * It should be possible to simply add another entry to this, and everything should
 * show up, assuming that the data received from the rover also has these values
 */
interface MoteuesDataChoice {
  identifier: keyof MoteusMotorState;
  prettyName: string;
  dataValue: string;
  isSelected: boolean;
  shouldRecordData: boolean;
}

const moteusDataChoices: Ref<MoteuesDataChoice[]> = ref(
  createDataChoices({
    position: 'Position',
    velocity: 'Velocity',
    torque: 'Torque',
    temperature: 'Temperature',
    power: 'Power',
    input_voltage: 'Controller Voltage',
    q_current: 'Q Phase (Amps)',
    d_current: 'D Phase (Amps)',
  }),
);

function initialize() {
  csvData = new SaveCSVData();
}

function createDataChoices(
  idToPretty: Partial<Record<keyof MoteusMotorState, string>>,
): MoteuesDataChoice[] {
  const output: MoteuesDataChoice[] = [];

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

/**
 * Converts a piece of data related to one of the motors
 * into a nice string for the UI.
 * @param data - is the data value.
 */
function moteusDataToString(data: string | number | null | undefined): string {
  if (typeof data === 'string') {
    data = parseFloat(data);
  }

  if (typeof data !== 'number') {
    data = null;
  }

  if (!Number.isNaN(data) && data != null) {
    if (Number.isInteger(data)) {
      // if int
      return data.toString();
    } else {
      return data.toFixed(5);
    }
  } else {
    return 'N/A';
  }
}

/**
 * The callback for the data subscriber, which is responsible for reading
 * in the data and saving it.
 */
function dataCallback(result: MoteusMotorState[]) {
  const motor = result.find((motor) => motor.can_id === props.dataSourceParameter);
  if (!motor) {
    return;
  }

  // update the data

  for (const item of moteusDataChoices.value) {
    item.dataValue = moteusDataToString(motor[item.identifier]);
  }

  // Add it to the CSV file
  constructRecordingEntry();
}

function constructRecordingEntry() {
  let tempDataArray: string[] = [];

  // Go through each possible entry
  for (const entry of moteusDataChoices.value) {
    //If we have selected that entry to be recorded
    if (entry.shouldRecordData) {
      if (entry.dataValue !== 'N/A') {
        tempDataArray.push(entry.dataValue);
      } else {
        tempDataArray.push(' ');
      }
    }
  }

  csvData.addDataEntry(tempDataArray);
}

/**
 * Used for the dropdown menu
 * We use this to select if we should display
 * the entry targeted via itemName
 *
 */
function itemClicked(itemName: string) {
  let mything = getMoteusDataObjectFromIdentifier(itemName);
  if (mything !== null) {
    mything.isSelected = !mything.isSelected;
  }
}

/**
 * Handles the recording.
 *
 * After stopping the recording, it will build the csv file
 */
function recordButtonPressed() {
  if (!isRecordingData.value) {
    showCheckbox.value = false;

    csvData = new SaveCSVData();

    let header: string[] = [];

    for (const entry of moteusDataChoices.value) {
      if (entry.shouldRecordData) {
        header.push(entry.identifier);
      }
    }

    csvData.setHeader(header);

    telemetry.start(dataCallback);
  } else {
    showCheckbox.value = true;

    telemetry.stop();

    if (props.displayName) {
      csvData.saveToFile(props.displayName);
    }
  }

  isRecordingData.value = !isRecordingData.value;
}

function getMoteusDataObjectFromIdentifier(itemName: string): MoteuesDataChoice | null {
  for (const entry of moteusDataChoices.value) {
    if (entry.identifier === itemName) {
      return entry;
    }
  }

  return null;
}

/**
 * Used as a callback for the checkboxes
 * All this does it hold the logical state
 */
function checkboxClicked(name: string) {
  let dataEntry = getMoteusDataObjectFromIdentifier(name);
  if (dataEntry !== null) {
    dataEntry.shouldRecordData = !dataEntry.shouldRecordData;
  }
}

defineExpose({ recordButtonPressed });
</script>

<template>
  <div class="module-bg">
    <div>
      <h3>{{ displayName }}</h3>
    </div>
    <div class="flex-container">
      <div class="dropdown">
        <button
          :class="{ 'button-toggle--on': !isRecordingData, 'button-toggle--off': isRecordingData }"
        >
          Select
        </button>
        <div class="dropdown-content">
          <DropDownItem
            v-for="item in moteusDataChoices"
            :key="item.prettyName"
            :item-name="item.prettyName"
            :is-selected="item.isSelected"
            @callback="itemClicked(item.identifier)"
          ></DropDownItem>
        </div>
      </div>

      <div>
        <button
          v-if="showAllFeatures"
          id="record_button"
          :class="{ 'button-toggle--on': !isRecordingData, 'button-toggle--off': isRecordingData }"
          @click="recordButtonPressed"
        >
          {{ isRecordingData ? 'Stop Recording' : 'Start Recording' }}
        </button>
      </div>
    </div>

    <div class="flex-container flex-vertical">
      <div class="moteus-reminder">
        Type: <b>{{ motorType }}</b>
      </div>

      <TelemetryDataDisplay
        v-for="item in moteusDataChoices"
        :key="item.identifier"
        :item-name="item.identifier"
        :is-selected="item.isSelected"
        :value="item.dataValue"
        :should-record-data="item.shouldRecordData"
        :should-show-check-box="showCheckbox"
        :show-all-features="showAllFeatures"
        @checkbox-clicked="checkboxClicked"
      >
      </TelemetryDataDisplay>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.module-bg {
  background-color: rgb(109, 109, 109);
  border-radius: 20px;
  padding: 10px;
  width: 100%;
  height: fit-content;
}

.moteus-reminder {
  margin: 4px;
}

.flex-container {
  display: flex;
  justify-content: left;
}

.item {
  font-weight: bolder;
}

.dropdown-item {
  color: black;
}

.flex-vertical {
  flex-direction: column;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  border-radius: 7px;
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
