<script lang="ts" setup>
import { ref, onMounted, inject} from 'vue'
import DropDownItem from "../components/DropDownItem.vue"
import TelemetryDataDisplay from "../components/TelemetryDataDisplay.vue"
import { render, h } from 'vue'
//import controllerPub from '../../roslib/controllerPub';
import missionControlSub from '../roslib/missionControlSub'
import ROSLIB, { Ros } from 'roslib';

onMounted(() => initialize());

const props = defineProps(['moteusCANID', 'displayName', 'preset', 'dataSub']);

const possiblePresets = ["FULL", "IMPORTANT"];

const UPDATE_DATA_MS = 100;//Update the data ever 100ms
let isRecordingData = false;
let csvDataObjects :object[] = []


let sub;
let recordButtonText = ref("Start Recording")


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

]

function initialize() {
  moteuesDataChoice[0].dataValue.value = props.moteusCANID;

  //console.log(sub)
  

  // FULL
  if (props.preset == possiblePresets[0]) {
    moteuesDataChoice[0].isSelected.value = true;
    moteuesDataChoice[1].isSelected.value = true;
    moteuesDataChoice[2].isSelected.value = true;
    moteuesDataChoice[3].isSelected.value = true;
    moteuesDataChoice[4].isSelected.value = true;
    moteuesDataChoice[5].isSelected.value = true;
    moteuesDataChoice[6].isSelected.value = true;

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
  }

  setInterval(readDataCallback, UPDATE_DATA_MS);

};


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

      
      if (isRecordingData) {
        let tempDataArray: any[] = [];
        
        for (let index = 0; index < 7; index++) {
          let entry = moteuesDataChoice[index];

          if (entry.shouldRecordData.value == true) {

            tempDataArray.push(entry.dataValue.value)

          }
        }

        csvDataObjects.push(tempDataArray)



        

      }

    }


  }
  
}


function itemClicked(itemName: String) {
  let mything = getMoteusDataObjectFromIdentifier(itemName);
  if (mything != null) {
    mything.isSelected.value = !mything.isSelected.value;
  }
  

}




function recordButtonPressed(){
  if (!isRecordingData) {
    recordButtonText.value = "Stop Recording" 
    csvDataObjects = []

    //Create file
  }
  else {
    recordButtonText.value = "Start Recording" 

    //Create and save the file
    let csvString = "";
    csvString += createrHeaderString();

    for (let fullEntryIndex = 0; fullEntryIndex < csvDataObjects.length; fullEntryIndex++) {
      let entryArray = csvDataObjects[fullEntryIndex];
      let entryString = ""

      for (let dataIndex = 0; dataIndex < entryArray.length; dataIndex++) {
        entryString += "" + entryArray[dataIndex] + ","
      }

      entryString = entryString.substring(0, entryString.length - 1) + "\n"

      csvString += entryString

    }

    console.log(csvString)

    // const download = (data) => {
    // // Create a Blob with the CSV data and type
    // const blob = new Blob([data], { type: 'text/csv' });
    
    // // Create a URL for the Blob
    // const url = URL.createObjectURL(blob);
    
    // // Create an anchor tag for downloading
    // const a = document.createElement('a');
    
    // // Set the URL and download attribute of the anchor tag
    // a.href = url;
    // a.download = 'download.csv';
    
    // // Trigger the download by clicking the anchor tag
    // a.click();
    // }

    const blob = new Blob([csvString], {type: 'text.csv'})
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = "data.csv"
    a.href = url;

    a.click();



    // const data = JSON.stringify({'hello': 1})
    // const blob = new Blob([data], {type: 'text/plain'})
    // const e = document.createEvent('MouseEvents'),
    // a = document.createElement('a');
    // a.download = "test.json";
    // a.href = window.URL.createObjectURL(blob);
    // a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    // //idk I copy pasted this code
    // e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    // a.dispatchEvent(e);

  }

  isRecordingData = !isRecordingData;
}




function createrHeaderString(){
  let headerString = "";

  for (let index = 0; index < 7; index++) {
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
        <button id="record_button" v-bind:class="{'record-button-green': !isRecordingData, 'record-button-red': isRecordingData}" @click="recordButtonPressed">{{ recordButtonText }}</button>
      </div>

    
      <div>
        <TelemetryDataDisplay 
          v-for="(item) in moteuesDataChoice"
          v-bind:itemName="item.prettyName"
          v-bind:isSelected="item.isSelected.value"
          v-bind:value="item.dataValue.value"
          v-bind:shouldRecordData="item.shouldRecordData.value"
          @checkboxClicked="checkboxClicked">
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