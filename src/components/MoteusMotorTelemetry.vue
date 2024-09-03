<script lang="ts" setup>
import { ref, onMounted, inject} from 'vue'
import DropDownItem from "../components/DropDownItem.vue"
import TelemetryDataDisplay from "../components/TelemetryDataDisplay.vue"
import { render, h } from 'vue'
//import controllerPub from '../../roslib/controllerPub';
import missionControlSub from '../roslib/missionControlSub'
import ROSLIB, { Ros } from 'roslib';

onMounted(() => initialize());

const props = defineProps(['moteusCANID', 'displayName', 'preset', 'dataSub', 'update_ms','showAllFeatures']);

const possiblePresets = ["FULL", "IMPORTANT"];

let isRecordingData = false;

// We use this to fill up csv data
//Each element is another array that holds the actual data
let csvDataObjects :object[] = [];
let showCheckbox = ref(true);

let recordButtonText = ref("Start Recording")

let pollingData; //Used to keep track of the object id when we do setInterval

/**
 * This is used to store what kind of data we will be displaying
 * and handling through the whole thing.
 * 
 * It should be possible to simply add another entry to this, and everyting should
 * show up, assuming that the data recieved from the the rover also has these values
 */
const moteuesDataChoice = [
  {
    prettyName: "CAN ID",
    identifier: "canID",
    dataValue: ref("N/A"),
    isSelected: ref(false),
    shouldRecordData: ref(false)
  },
  {
    prettyName: "Position",
    identifier: "position",
    dataValue: ref("N/A"),
    isSelected: ref(false),
    shouldRecordData: ref(false)
  },
  {
    prettyName: "Velocity",
    identifier: "velocity",
    dataValue: ref("N/A"),
    isSelected: ref(false),
    shouldRecordData: ref(false)
  },
  {
    prettyName: "Torque",
    identifier: "torque",
    dataValue: ref("N/A"),
    isSelected: ref(false),
    shouldRecordData: ref(false)
  },
  {
    prettyName: "Temperature",
    identifier: "temperature",
    dataValue: ref("N/A"),
    isSelected: ref(false),
    shouldRecordData: ref(false)
  },
  {
    prettyName: "Power",
    identifier: "power",
    dataValue: ref("N/A"),
    isSelected: ref(false),
    shouldRecordData: ref(false)
  },
  {
    prettyName: "Input Voltage",
    identifier: "inputVoltage",
    dataValue: ref("N/A"),
    isSelected: ref(false),
    shouldRecordData: ref(false)
  },
  {
    prettyName: "Q Current",
    identifier: "qCurrent",
    dataValue: ref("N/A"),
    isSelected: ref(false),
    shouldRecordData: ref(false)
  },
  {
    prettyName: "D Current",
    identifier: "dCurrent",
    dataValue: ref("N/A"),
    isSelected: ref(false),
    shouldRecordData: ref(false)
  }

]

function initialize() {
  moteuesDataChoice[0].dataValue.value = props.moteusCANID;

  // FULL
  if (props.preset == possiblePresets[0]) {
    moteuesDataChoice[0].isSelected.value = true;
    moteuesDataChoice[1].isSelected.value = true;
    moteuesDataChoice[2].isSelected.value = true;
    moteuesDataChoice[3].isSelected.value = true;
    moteuesDataChoice[4].isSelected.value = true;
    moteuesDataChoice[5].isSelected.value = true;
    moteuesDataChoice[6].isSelected.value = true;
    moteuesDataChoice[7].isSelected.value = true;
    moteuesDataChoice[8].isSelected.value = true;

  }
  // IMPORTANT
  else if (props.preset == possiblePresets[1]){
    moteuesDataChoice[0].isSelected.value = false;
    moteuesDataChoice[1].isSelected.value = true;
    moteuesDataChoice[2].isSelected.value = true;
    moteuesDataChoice[3].isSelected.value = false;
    moteuesDataChoice[4].isSelected.value = false;
    moteuesDataChoice[5].isSelected.value = false;
    moteuesDataChoice[6].isSelected.value = false;
    moteuesDataChoice[7].isSelected.value = false;
    moteuesDataChoice[8].isSelected.value = false;
  }

  // We enter this interval for at least once
  pollingData = setInterval(readDataCallback, 500);//default 100

};

/**
 * This reads in the JSON string from the subscriber
 * 
 * From here, we will update the data to display from the JSON
 */
function readDataCallback(){

  if (props.dataSub.value == "" || props.dataSub.value == undefined) {
    return -1
  }
  let json = JSON.parse(props.dataSub.value)

  // Moteus Entries
  for (let entry = 0; entry < json.moteusMotorLength; entry++){
    let moteusMotorEntry = json.moteusMotors[entry]
    
    //check if this entry is ours via canid
    if (moteusMotorEntry.canID == props.moteusCANID) {
      moteuesDataChoice[1].dataValue.value = String(moteusMotorEntry.position).substring(0,6);
      moteuesDataChoice[2].dataValue.value = String(moteusMotorEntry.velocity).substring(0,6);
      moteuesDataChoice[3].dataValue.value = String(moteusMotorEntry.torque).substring(0,6);
      moteuesDataChoice[4].dataValue.value = String(moteusMotorEntry.temperature).substring(0,6);
      moteuesDataChoice[5].dataValue.value = String(moteusMotorEntry.power).substring(0,6);
      moteuesDataChoice[6].dataValue.value = String(moteusMotorEntry.inputVoltage).substring(0,6);
      moteuesDataChoice[7].dataValue.value = String(moteusMotorEntry.qCurrent).substring(0,6);
      moteuesDataChoice[8].dataValue.value = String(moteusMotorEntry.dCurrent).substring(0,6);

      // Data recording; only do it if recording
      if (isRecordingData) {
        let tempDataArray: any[] = [];
        
        // Go through each possible entry
        for (let index = 0; index < moteuesDataChoice.length; index++) {
          let entry = moteuesDataChoice[index];

          //If we have selected that entry to be recorded
          if (entry.shouldRecordData.value == true) {

            tempDataArray.push(entry.dataValue.value)

          }
        }
        csvDataObjects.push(tempDataArray)
      }

    }

    //This code section is used to change the polling rate
    clearInterval(pollingData);//Stop the interval
    
    if (props.update_ms < 4) {//So we dont break the thing by going slower. It is 4 because browser limitations
      pollingData = setInterval(readDataCallback, 100);
    }
    else{
      pollingData = setInterval(readDataCallback, props.update_ms);
    }
  }
  
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
function recordButtonPressed(){
  if (!isRecordingData) {
    recordButtonText.value = "Stop Recording" 
    showCheckbox.value = false;

    // reset the data
    csvDataObjects = []

  }
  else {
    recordButtonText.value = "Start Recording" 
    showCheckbox.value = true

    //Create and save the file
    let csvString = "";
    csvString += createrHeaderString();

    // Fill in the values
    for (let fullEntryIndex = 0; fullEntryIndex < csvDataObjects.length; fullEntryIndex++) {
      //Grabs the data array entry from the list of data (csvDataObjects)
      let entryArray = csvDataObjects[fullEntryIndex];
      let entryString = ""

      //Builds the line
      for (let dataIndex = 0; dataIndex < entryArray.length; dataIndex++) {
        entryString += "" + entryArray[dataIndex] + ","
      }

      entryString = entryString.substring(0, entryString.length - 1) + "\n"

      csvString += entryString

    }

    // This is used to download the file
    const blob = new Blob([csvString], {type: 'text.csv'})
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    let now = new Date()
    a.download = props.displayName + " " + now.getHours() % 12 + "_" + ((now.getMinutes() < 10 ? '0' : '') + now.getMinutes()) + "_" + now.getSeconds() + ".csv"
    a.href = url;
    a.click();

  }

  isRecordingData = !isRecordingData;
}

/**
 * Creates the csv header based on the 
 * selected data to record
 */
function createrHeaderString(){
  let headerString = "";

  for (let index = 0; index < moteuesDataChoice.length; index++) {
    let entry = moteuesDataChoice[index];

    if (entry.shouldRecordData.value == true) {
      headerString += entry.identifier + ","
    }
  }

  return headerString.substring(0,headerString.length - 1) + "\n";// Get rid of the last comma

}


function getMoteusDataObjectFromIdentifier(itemName: String){
  for (let index = 0; index < moteuesDataChoice.length; index++) {
    if (moteuesDataChoice[index].identifier == itemName) {
      return moteuesDataChoice[index];
    }
  }

  return null;
}

function getMoteusDataObjectFromName(itemName: String){
  for (let index = 0; index < moteuesDataChoice.length; index++) {
    if (moteuesDataChoice[index].prettyName == itemName) {
      return moteuesDataChoice[index];
    }
  }

  return null;
}

/**
 * Used as a callback for the checkboxes
 * All this does it hold the logical state
 */
function checkboxClicked(name: String){
  let dataEntry = getMoteusDataObjectFromName(name)
  if (dataEntry != null) {
    dataEntry.shouldRecordData.value = !dataEntry.shouldRecordData.value
    console.log(name + "" + dataEntry.shouldRecordData.value)
  }
}

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
            <DropDownItem
              v-for="(item) in moteuesDataChoice"
              @callback="itemClicked(item.identifier)"
              v-bind:itemName="item.prettyName"
              v-bind:isSelected="item.isSelected.value"
            ></DropDownItem>
      
          </div>
      
      
        </div>
  
        <!--div class="moteus-reminder">Motor Controller: <b>Moteus</b></div-->

      </div>

      <div>
        <button v-if="showAllFeatures" id="record_button" v-bind:class="{'record-button-green': !isRecordingData, 'record-button-red': isRecordingData}" @click="recordButtonPressed">{{ recordButtonText }}</button>
      </div>

    
      <div>
        <TelemetryDataDisplay 
          v-for="(item) in moteuesDataChoice"
          v-bind:itemName="item.prettyName"
          v-bind:isSelected="item.isSelected.value"
          v-bind:value="item.dataValue.value"
          v-bind:shouldRecordData="item.shouldRecordData.value"
          @checkboxClicked="checkboxClicked"
          v-bind:shouldShowCheckBox="showCheckbox"
          v-bind:showAllFeatures="showAllFeatures">
        </TelemetryDataDisplay>
      </div>

  </div>




</template>


<style>

.module-bg{
  background-color: rgb(109, 109, 109);
  border-radius: 20px;
  padding: 10px;
  width: 15%;
  height: fit-content;
}

.moteus-reminder{
  margin: 4px;
}

.flex-container {
  display: flex;
  justify-content: left;
}

.item{
  font-weight: bolder;
}


.dropdown-item {
  color: black;
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
  margin-top: 5px;
}

.record-button-red{
  background-color: rgb(255, 0, 0);
  color: white;
  padding: 8px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  margin-top: 5px;
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