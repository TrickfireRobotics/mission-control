<script lang="ts" setup>
import { ref, onMounted, inject, defineExpose } from 'vue'
import DropDownItem from "./DropDownItem.vue"
import TelemetryDataDisplay from "./TelemetryDataDisplay.vue"
import { render, h } from 'vue'
//import controllerPub from '../../roslib/controllerPub';
import missionControlSub from '../../../roslib/missionControlSub'
import { SaveCSVData } from '../../../script/saveCSVData'
import ROSLIB, { Ros } from 'roslib';

onMounted(() => initialize());

const props = defineProps({
  displayName: String,
  dataSourceMethod: Function,
  dataSourceParamater: String,
  update_ms: String,
  showAllFeatures: Boolean,
  motorType: String,
});


let isRecordingData = false;
let csvData;

// We use this to fill up csv data
//Each element is another array that holds the actual data
let showCheckbox = ref(true);

let recordButtonText = ref("Start Recording")

let pollingData; //Used to keep track of the object id when we do setInterval

let getMoteusMotorStateService: ROSLIB.Service
const myRos = inject<Ros>('ros')

/**
 * This is used to store what kind of data we will be displaying
 * and handling through the whole thing.
 * 
 * It should be possible to simply add another entry to this, and everyting should
 * show up, assuming that the data recieved from the the rover also has these values
 */


const moteuesDataChoice = ref([])
let hasBuiltMoteusDataChoice = false;


function initialize() {
  csvData = new SaveCSVData()
  pollingData = setInterval(updateUIWithNewData, props.update_ms);
};


function updateUIWithNewData(jsonString) {
  if (props.dataSourceMethod != undefined) {
    let result = props.dataSourceMethod(props.dataSourceParamater, dataCallback)
  }

  if (isRecordingData) {
    constructRecordingEntry();
  }



  //This code section is used to change the polling rate
  clearInterval(pollingData);//Stop the interval
    
  if (props.update_ms < 4) {//So we dont break the thing by going slower. It is 4 because browser limitations
    pollingData = setInterval(updateUIWithNewData, 4);
  }
  else{
    pollingData = setInterval(updateUIWithNewData, props.update_ms);
  }

}

function dataCallback(result){
  if (!hasBuiltMoteusDataChoice) {
    hasBuiltMoteusDataChoice = true;
    buildMoteusDataChoice(result)
  }

  //update the data
  let json = JSON.parse(result.json_payload)

  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      let object = getMoteusDataObjectFromIdentifier(key)

      if (object != null) {
        let dataEntry = parseFloat(json[key])
        if (!Number.isNaN(dataEntry)) {
          if (Number.isInteger(dataEntry)) {//if int
            object.dataValue = dataEntry
          }
          else {
            object.dataValue = dataEntry.toFixed(5)
          }

          
        }
        else {
          object.dataValue = "N/A"
        }
      }
    }
  }

  
}


function buildMoteusDataChoice(result){
  let json = JSON.parse(result.json_payload)
  
  for(const key in json){

    let entry = {
      prettyName: "prettyName",
      identifier: "identifier",
      dataValue: "dataValue",
      isSelected: true,
      shouldRecordData: true
    };

    if(json.hasOwnProperty(key)){
      entry.prettyName = key;
      entry.identifier = key;
      entry.dataValue = json[key];

      moteuesDataChoice.value.push(entry);
    }
  }

}



function constructRecordingEntry(){
  let tempDataArray: any[] = [];

      // Go through each possible entry
      for (let index = 0; index < moteuesDataChoice.value.length; index++) {
        let entry = moteuesDataChoice.value[index];

        //If we have selected that entry to be recorded
        if (entry.shouldRecordData == true) {
          if (entry.dataValue != "N/A") {
            tempDataArray.push(entry.dataValue)
          }
          else {
            tempDataArray.push(" ")
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
function itemClicked(itemName: String) {
  let mything = getMoteusDataObjectFromIdentifier(itemName);
  if (mything != null) {
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
    recordButtonText.value = "Stop Recording"
    showCheckbox.value = false;

    csvData = new SaveCSVData()

    let header: string[] = [];

    for (let index = 0; index < moteuesDataChoice.value.length; index++) {
      let entry = moteuesDataChoice.value[index];

      if (entry.shouldRecordData == true) {
        header.push(entry.identifier)
      }
    }

    csvData.setHeader(header)
  }
  else {
    recordButtonText.value = "Start Recording"
    showCheckbox.value = true

    csvData.saveToFile(props.displayName);
  }

  isRecordingData = !isRecordingData;
}

function getMoteusDataObjectFromIdentifier(itemName: String) {
  
  for (let index = 0; index < moteuesDataChoice.value.length; index++) {

    if (moteuesDataChoice.value[index].identifier == itemName) {
      return moteuesDataChoice.value[index];
    }
  }

  return null;
}

/**
 * Used as a callback for the checkboxes
 * All this does it hold the logical state
 */
function checkboxClicked(name: String) {
  let dataEntry = getMoteusDataObjectFromIdentifier(name)
  if (dataEntry != null) {
    dataEntry.shouldRecordData = !dataEntry.shouldRecordData
  }
}

defineExpose({ recordButtonPressed })

</script>



<template>
  <div class="module-bg">

    <div>
      <b style="font-size:large;">{{ displayName }}</b>
    </div>

    <div class="flex-container">
      <div class="dropdown">
        <button class="drop-button">Select</button>
        <div class="dropdown-content">
          <DropDownItem v-for="(item) in moteuesDataChoice" @callback="itemClicked(item.identifier)"
            v-bind:itemName="item.prettyName" v-bind:isSelected="item.isSelected"></DropDownItem>

        </div>
      </div>

      <div>
      <button v-if="showAllFeatures" id="record_button"
        v-bind:class="{ 'record-button-green': !isRecordingData, 'record-button-red': isRecordingData }"
        @click="recordButtonPressed">{{ recordButtonText }}</button>
      </div>

      

    </div>


    <div class="flex-container flex-vertical">
      <div class="moteus-reminder">Type: <b>{{ motorType }}</b></div>

      <TelemetryDataDisplay v-for="(item) in moteuesDataChoice" v-bind:itemName="item.identifier"
        v-bind:isSelected="item.isSelected" v-bind:value="item.dataValue"
        v-bind:shouldRecordData="item.shouldRecordData" @checkboxClicked="checkboxClicked"
        v-bind:shouldShowCheckBox="showCheckbox" v-bind:showAllFeatures="showAllFeatures">
      </TelemetryDataDisplay>
    </div>

  </div>




</template>


<style>
.module-bg {
  background-color: rgb(109, 109, 109);
  border-radius: 20px;
  padding: 10px;
  width: 15%;
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

.flex-vertical{
  flex-direction: column;
}


.drop-button {
  background-color: rgb(48, 182, 48);
  color: white;
  padding: 8px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
}

.record-button-green {
  background-color: rgb(48, 182, 48);
  color: white;
  padding: 8px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  margin-left: 5px;
}

.record-button-red {
  background-color: rgb(255, 0, 0);
  color: white;
  padding: 8px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  margin-left: 5px;
  
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

.dropdown:hover .drop-button {
  background-color: rgb(22, 131, 28);
}
</style>