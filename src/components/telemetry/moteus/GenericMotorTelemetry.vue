<!-- TODO: Need to refactor entire to fix Typescript issues -->
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import DropDownItem from './DropDownItem.vue';
import TelemetryDataDisplay from './TelemetryDataDisplay.vue';
import SaveCSVData from '../../../lib/saveCSVData';
import ROSLIB from 'roslib';
import { useRoslibStore } from '@/store/useRoslib';

onMounted(() => initialize());

const props = defineProps({
  displayName: String,
  dataSourceMethod: Function,
  dataSourceParamater: String,
  updateMs: String,
  showAllFeatures: Boolean,
  motorType: String,
});

let isRecordingData = false;
let csvData;

// We use this to fill up csv data
//Each element is another array that holds the actual data
let showCheckbox = ref(true);

let recordButtonText = ref('Start Recording');

let pollingData; //Used to keep track of the object id when we do setInterval

let getMoteusMotorStateService: ROSLIB.Service;
const roslib = useRoslibStore();

/**
 * This is used to store what kind of data we will be displaying
 * and handling through the whole thing.
 *
 * It should be possible to simply add another entry to this, and everyting should
 * show up, assuming that the data recieved from the the rover also has these values
 */

const moteuesDataChoice = ref([]);
let hasBuiltMoteusDataChoice = false;

function initialize() {
  csvData = new SaveCSVData();
  // TODO: FIX SERVICE
  // pollingData = setInterval(updateUIWithNewData, props.update_ms);
}

function updateUIWithNewData(jsonString) {
  if (props.dataSourceMethod !== undefined) {
    let result = props.dataSourceMethod(props.dataSourceParamater, dataCallback);
  }

  if (isRecordingData) {
    constructRecordingEntry();
  }

  //This code section is used to change the polling rate
  clearInterval(pollingData); //Stop the interval

  if (props.updateMs < 4) {
    //So we dont break the thing by going slower. It is 4 because browser limitations
    pollingData = setInterval(updateUIWithNewData, 4);
  } else {
    pollingData = setInterval(updateUIWithNewData, props.updateMs);
  }
}

function dataCallback(result) {
  if (!hasBuiltMoteusDataChoice) {
    hasBuiltMoteusDataChoice = true;
    buildMoteusDataChoice(result);
  }

  //update the data
  let json = JSON.parse(result.json_payload);

  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      let object = getMoteusDataObjectFromIdentifier(key);

      if (object !== null) {
        let dataEntry = parseFloat(json[key]);
        if (!Number.isNaN(dataEntry)) {
          if (Number.isInteger(dataEntry)) {
            //if int
            object.dataValue = dataEntry;
          } else {
            object.dataValue = dataEntry.toFixed(5);
          }
        } else {
          object.dataValue = 'N/A';
        }
      }
    }
  }
}

function buildMoteusDataChoice(result) {
  let json = JSON.parse(result.json_payload);

  for (const key in json) {
    let entry = {
      prettyName: 'prettyName',
      identifier: 'identifier',
      dataValue: 'dataValue',
      isSelected: true,
      shouldRecordData: true,
    };

    if (key in json) {
      entry.prettyName = key;
      entry.identifier = key;
      entry.dataValue = json[key];

      moteuesDataChoice.value.push(entry);
    }
  }
}

function constructRecordingEntry() {
  let tempDataArray: string[] = [];

  // Go through each possible entry
  for (let index = 0; index < moteuesDataChoice.value.length; index++) {
    let entry = moteuesDataChoice.value[index];

    //If we have selected that entry to be recorded
    if (entry.shouldRecordData === true) {
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
    mything.isSelected.value = !mything.isSelected.value;
  }
}

/**
 * Handles the recording.
 *
 * After stopping the recording, it will build the csv file
 */
function recordButtonPressed() {
  if (!isRecordingData) {
    recordButtonText.value = 'Stop Recording';
    showCheckbox.value = false;

    csvData = new SaveCSVData();

    let header: string[] = [];

    for (let index = 0; index < moteuesDataChoice.value.length; index++) {
      let entry = moteuesDataChoice.value[index];

      if (entry.shouldRecordData === true) {
        header.push(entry.identifier);
      }
    }

    csvData.setHeader(header);
  } else {
    recordButtonText.value = 'Start Recording';
    showCheckbox.value = true;

    csvData.saveToFile(props.displayName);
  }

  isRecordingData = !isRecordingData;
}

function getMoteusDataObjectFromIdentifier(itemName: string) {
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
        <button class="button--on">Select</button>
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
          id="record-button"
          :class="{ 'button--on': !isRecordingData, 'button--off': isRecordingData }"
          @click="recordButtonPressed"
        >
          {{ recordButtonText }}
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
