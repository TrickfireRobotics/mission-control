<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import DropDownItem from './DropDownItem.vue';
import TelemetryDataDisplay from './TelemetryDataDisplay.vue';
import { SaveCSVData } from '@/lib/saveCSVData';
import { createSubscriber } from '@/lib/roslibUtils/createSubscriber';
import { type StdMsg } from '@/lib/roslibUtils/rosTypes';

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

let isRecordingData = ref(false);
let csvData: SaveCSVData;

// We use this to fill up csv data
//Each element is another array that holds the actual data
let showCheckbox = ref(true);

/**
 * Builds the data choices when the page is first loaded,
 * then disables itself immediately afterward.
 */
const missionControlUpdaterBuilder = createSubscriber({
  topicName: 'mission_control_updater',
  topicType: 'std_msgs/String',
});

/**
 * Retrieves data when telemetry is active.
 */
const missionControlUpdaterData = createSubscriber({
  topicName: 'mission_control_updater',
  topicType: 'std_msgs/String',
});

/**
 * This is used to store what kind of data we will be displaying
 * and handling through the whole thing.
 *
 * It should be possible to simply add another entry to this, and everything should
 * show up, assuming that the data received from the rover also has these values
 */
interface MoteuesDataChoice {
  prettyName: string;
  identifier: string;
  dataValue: string;
  isSelected: boolean;
  shouldRecordData: boolean;
}

const moteuesDataChoice = ref<MoteuesDataChoice[]>([]);
let hasBuiltMoteusDataChoice = false;

function initialize() {
  csvData = new SaveCSVData();
  missionControlUpdaterBuilder.start({ callback: builderCallback });
}

/**
 * Extracts the data for the motor that we're looking for, if it exists.
 */
function parseData(data: StdMsg<string>): ({ can_id: number } & Record<string, unknown>) | null {
  if (!data?.data) return null;

  const parsedData = JSON.parse(data.data);
  console.log('parsed', parsedData);
  if (
    !parsedData?.moteusMotors ||
    typeof parsedData.moteusMotors !== 'object' ||
    !Array.isArray(parsedData.moteusMotors)
  ) {
    return null;
  }

  return parsedData.moteusMotors.find(
    (motor: { can_id: number }) => motor.can_id === props.dataSourceParameter,
  );
}

/**
 * The callback for the builder subscriber, which is responsible
 * for querying what data we have access to.
 */
function builderCallback(result: StdMsg<string>) {
  const data = parseData(result);
  if (!data) {
    // If we get no data, it probably means that the motor
    // is disconnected.
    // This is an error, but if we don't stop the subscriber, then
    // we'll just flood the connection with unneeded data.
    console.error('Error! Can ID not found for ' + props.dataSourceParameter);

    missionControlUpdaterBuilder.stop();
    return;
  }

  if (!hasBuiltMoteusDataChoice) {
    hasBuiltMoteusDataChoice = true;
    buildMoteusDataChoice(data);
  }

  // Now that data choices are built, there's
  // no reason to keep this active.
  missionControlUpdaterBuilder.stop();
}

/**
 * The callback for the data subscriber, which is responsible for reading
 * in the data and saving it.
 */
function dataCallback(result: StdMsg<string>) {
  const data = parseData(result);
  if (!data) return;

  if (!hasBuiltMoteusDataChoice) {
    hasBuiltMoteusDataChoice = true;
    buildMoteusDataChoice(data);
  }

  // update the data

  for (const key in data) {
    // Saving the can_id is redundant.
    if (key === 'can_id') continue;

    const value = data[key];

    let object = getMoteusDataObjectFromIdentifier(key);

    if (object !== null) {
      let dataEntry =
        typeof value === 'string' ? parseFloat(value) : typeof value === 'number' ? value : null;

      if (!Number.isNaN(dataEntry) && dataEntry != null) {
        if (Number.isInteger(dataEntry)) {
          // if int
          object.dataValue = dataEntry.toString();
        } else {
          object.dataValue = dataEntry.toFixed(5);
        }
      } else {
        object.dataValue = 'N/A';
      }
    }
  }

  // Add it to the CSV file
  constructRecordingEntry();
}

function buildMoteusDataChoice(result: Record<string, unknown>) {
  for (const key in result) {
    // Saving the can_id is redundant.
    if (key === 'can_id') continue;

    let entry = {
      prettyName: key,
      identifier: key,
      // This will get filled in later.
      dataValue: 'N/A',
      isSelected: true,
      shouldRecordData: true,
    };

    moteuesDataChoice.value.push(entry);
  }
}

function constructRecordingEntry() {
  let tempDataArray: string[] = [];

  // Go through each possible entry
  for (let index = 0; index < moteuesDataChoice.value.length; index++) {
    let entry = moteuesDataChoice.value[index];

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

    for (let index = 0; index < moteuesDataChoice.value.length; index++) {
      let entry = moteuesDataChoice.value[index];

      if (entry.shouldRecordData) {
        header.push(entry.identifier);
      }
    }

    csvData.setHeader(header);

    missionControlUpdaterData.start({ callback: dataCallback });
  } else {
    showCheckbox.value = true;

    missionControlUpdaterData.stop();

    if (props.displayName) {
      csvData.saveToFile(props.displayName);
    }
  }

  isRecordingData.value = !isRecordingData.value;
}

function getMoteusDataObjectFromIdentifier(itemName: string): MoteuesDataChoice | null {
  for (let index = 0; index < moteuesDataChoice.value.length; index++) {
    if (moteuesDataChoice.value[index].identifier === itemName) {
      return moteuesDataChoice.value[index];
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
            v-for="item in moteuesDataChoice"
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
        v-for="item in moteuesDataChoice"
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
