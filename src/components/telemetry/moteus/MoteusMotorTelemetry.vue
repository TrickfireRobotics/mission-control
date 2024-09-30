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

const props = defineProps(['moteusCANID', 'displayName', 'preset', 'dataSub', 'update_ms', 'showAllFeatures']);

const possiblePresets = ["FULL", "IMPORTANT"];

enum ChoiceToIndex {
  CAN_ID = 0,
  POSITION = 1,
  VELOCITY = 2,
  TORQUE = 3,
  TEMPERATURE = 4,
  POWER = 5,
  INPUT_VOLTAGE = 6,
  Q_CURRENT = 7,
  D_CURRENT = 8
}

let isRecordingData = false;
let csvData;

// We use this to fill up csv data
//Each element is another array that holds the actual data
let csvDataObjects: object[] = [];
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
// const moteuesDataChoice = [
//   {
//     prettyName: "CAN ID",
//     identifier: "canID",
//     dataValue: ref("N/A"),
//     isSelected: ref(false),
//     shouldRecordData: ref(true)
//   },
//   {
//     prettyName: "Position",
//     identifier: "position",
//     dataValue: ref("N/A"),
//     isSelected: ref(false),
//     shouldRecordData: ref(true)
//   },
//   {
//     prettyName: "Velocity",
//     identifier: "velocity",
//     dataValue: ref("N/A"),
//     isSelected: ref(false),
//     shouldRecordData: ref(true)
//   },
//   {
//     prettyName: "Torque",
//     identifier: "torque",
//     dataValue: ref("N/A"),
//     isSelected: ref(false),
//     shouldRecordData: ref(true)
//   },
//   {
//     prettyName: "Temperature",
//     identifier: "temperature",
//     dataValue: ref("N/A"),
//     isSelected: ref(false),
//     shouldRecordData: ref(true)
//   },
//   {
//     prettyName: "Power",
//     identifier: "power",
//     dataValue: ref("N/A"),
//     isSelected: ref(false),
//     shouldRecordData: ref(true)
//   },
//   {
//     prettyName: "Input Voltage",
//     identifier: "inputVoltage",
//     dataValue: ref("N/A"),
//     isSelected: ref(false),
//     shouldRecordData: ref(true)
//   },
//   {
//     prettyName: "Q Current",
//     identifier: "q_current",
//     dataValue: ref("N/A"),
//     isSelected: ref(false),
//     shouldRecordData: ref(true)
//   },
//   {
//     prettyName: "D Current",
//     identifier: "d_current",
//     dataValue: ref("N/A"),
//     isSelected: ref(false),
//     shouldRecordData: ref(true)
//   }

// ]

const moteuesDataChoice = ref([
  {
    prettyName: "CAN ID",
    identifier: "canID",
    dataValue: ref("N/A"),
    isSelected: ref(true),
    shouldRecordData: ref(true)
  }
  

])


function initialize() {
  //console.log(moteuesDataChoice.value[0].dataValue)
  moteuesDataChoice.value[0].dataValue = props.moteusCANID;
  csvData = new SaveCSVData()

  if (myRos != null) {
    getMoteusMotorStateService = new ROSLIB.Service({
      ros: myRos,
      name: "/get_moteus_motor_state",
      serviceType: "MoteusState"
    })
  }

  // // FULL
  // if (props.preset == possiblePresets[0]) {
  //   moteuesDataChoice.value[ChoiceToIndex.CAN_ID].isSelected = true;
  //   moteuesDataChoice.value[ChoiceToIndex.POSITION].isSelected = true;
  //   moteuesDataChoice.value[ChoiceToIndex.VELOCITY].isSelected = true;
  //   moteuesDataChoice.value[ChoiceToIndex.TORQUE].isSelected = true;
  //   moteuesDataChoice.value[ChoiceToIndex.TEMPERATURE].isSelected = true;
  //   moteuesDataChoice.value[ChoiceToIndex.POWER].isSelected = true;
  //   moteuesDataChoice.value[ChoiceToIndex.INPUT_VOLTAGE].isSelected = true;
  //   moteuesDataChoice.value[ChoiceToIndex.Q_CURRENT].isSelected = true;
  //   moteuesDataChoice.value[ChoiceToIndex.D_CURRENT].isSelected = true;

  // }
  // // IMPORTANT
  // else if (props.preset == possiblePresets[1]) {
  //   moteuesDataChoice[ChoiceToIndex.CAN_ID].isSelected.value = false;
  //   moteuesDataChoice[ChoiceToIndex.POSITION].isSelected.value = true;
  //   moteuesDataChoice[ChoiceToIndex.VELOCITY].isSelected.value = true;
  //   moteuesDataChoice[ChoiceToIndex.TORQUE].isSelected.value = false;
  //   moteuesDataChoice[ChoiceToIndex.TEMPERATURE].isSelected.value = false;
  //   moteuesDataChoice[ChoiceToIndex.POWER].isSelected.value = false;
  //   moteuesDataChoice[ChoiceToIndex.INPUT_VOLTAGE].isSelected.value = false;
  //   moteuesDataChoice[ChoiceToIndex.Q_CURRENT].isSelected.value = false;
  //   moteuesDataChoice[ChoiceToIndex.D_CURRENT].isSelected.value = false;
  // }

  // We enter this interval for at least once
  //pollingData = setInterval(readDataCallback, 500);//default 100
  //setInterval(requestMoteusState, 500)

  setInterval(test, 2000);

};
let counter = 0;
function test(){
  let entry = {
    prettyName: "HELP" + counter,
    identifier: "help",
    dataValue: "N/A",
    isSelected: true,
    shouldRecordData: true
  }

  moteuesDataChoice.value.push(entry);
  console.log("added")
  counter++
}


function requestMoteusState() {
  var request = {
    target_can_id: parseInt(moteuesDataChoice.value[0].dataValue)
  }

  getMoteusMotorStateService.callService(request, function (result) {
    //console.log("Result from service " + result.json_payload)
    updateUIWithNewData(result.json_payload)
  })
}

function updateUIWithNewData(jsonString) {
  let json = JSON.parse(jsonString)
  // Moteus Entries

  function updateEntry(target, dataRaw){
    if (dataRaw == null) {
      target = String("N/A")
      return
    }

    target = String(parseInt((dataRaw).toFixed(5)))
  }


  //check if this entry is ours via canid
  if (true) {
    updateEntry(moteuesDataChoice[ChoiceToIndex.POSITION], json.position)
    updateEntry(moteuesDataChoice[ChoiceToIndex.VELOCITY], json.velocity)
    updateEntry(moteuesDataChoice[ChoiceToIndex.TORQUE], json.torque)
    updateEntry(moteuesDataChoice[ChoiceToIndex.POWER], json.power)
    updateEntry(moteuesDataChoice[ChoiceToIndex.INPUT_VOLTAGE], json.input_voltage)
    updateEntry(moteuesDataChoice[ChoiceToIndex.Q_CURRENT], json.q_current)
    updateEntry(moteuesDataChoice[ChoiceToIndex.D_CURRENT], json.d_current)

    // Data recording; only do it if recording
    if (isRecordingData) {
      constructRecordingEntry()
    }
  }
  

}

function constructRecordingEntry(){
  let tempDataArray: any[] = [];

      // Go through each possible entry
      for (let index = 0; index < moteuesDataChoice.value.length; index++) {
        let entry = moteuesDataChoice[index];

        //If we have selected that entry to be recorded
        if (entry.shouldRecordData.value == true) {
          if (entry.dataValue.value != "N/A") {
            tempDataArray.push(entry.dataValue.value)
          }
          else {
            tempDataArray.push(" ")
          }


        }
      }

      console.log(tempDataArray.toString())
      csvData.addDataEntry(tempDataArray);
}

/**
 * This reads in the JSON string from the subscriber
 * 
 * From here, we will update the data to display from the JSON
 */
function readDataCallback() {

  if (props.dataSub.value == "" || props.dataSub.value == undefined) {
    return -1
  }
  let json = JSON.parse(props.dataSub.value)


  // Moteus Entries
  for (let entry = 0; entry < json.moteusMotorLength; entry++) {
    let moteusMotorEntry = json.moteusMotors[entry]

    //check if this entry is ours via canid
    if (moteusMotorEntry.canID == props.moteusCANID) {
      moteuesDataChoice[1].dataValue.value = String(moteusMotorEntry.position).substring(0, 6);
      moteuesDataChoice[2].dataValue.value = String(moteusMotorEntry.velocity).substring(0, 6);
      moteuesDataChoice[3].dataValue.value = String(moteusMotorEntry.torque).substring(0, 6);
      moteuesDataChoice[4].dataValue.value = String(moteusMotorEntry.temperature).substring(0, 6);
      moteuesDataChoice[5].dataValue.value = String(moteusMotorEntry.power).substring(0, 6);
      moteuesDataChoice[6].dataValue.value = String(moteusMotorEntry.inputVoltage).substring(0, 6);
      moteuesDataChoice[7].dataValue.value = String(moteusMotorEntry.qCurrent).substring(0, 6);
      moteuesDataChoice[8].dataValue.value = String(moteusMotorEntry.dCurrent).substring(0, 6);

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
        csvData.addDataEntry(tempDataArray);
        //csvDataObjects.push(tempDataArray)
      }

    }


  }

  //This code section is used to change the polling rate
  clearInterval(pollingData);//Stop the interval

  if (props.update_ms < 4) {//So we dont break the thing by going slower. It is 4 because browser limitations
    pollingData = setInterval(readDataCallback, 100);
  }
  else {
    pollingData = setInterval(readDataCallback, props.update_ms);
  }

}


/**
 * Used for the dropdown menu
 * We use this to select if we should display
 * the entry targeted via itemName
 * 
 */
function itemClicked(itemName: String) {
  // let mything = getMoteusDataObjectFromIdentifier(itemName);
  // if (mything != null) {
  //   mything.isSelected.value = !mything.isSelected.value;
  // }


}

/**
 * Handles the recording.
 * 
 * After stopping the recording, it will build the csv file
 */
function recordButtonPressed() {
  // if (!isRecordingData) {
  //   recordButtonText.value = "Stop Recording"
  //   showCheckbox.value = false;

  //   csvData = new SaveCSVData()

  //   let header: string[] = [];

  //   for (let index = 0; index < moteuesDataChoice.length; index++) {
  //     let entry = moteuesDataChoice[index];

  //     if (entry.shouldRecordData.value == true) {
  //       header.push(entry.identifier)
  //     }
  //   }

  //   csvData.setHeader(header)
  // }
  // else {
  //   recordButtonText.value = "Start Recording"
  //   showCheckbox.value = true

  //   csvData.saveToFile(props.displayName);
  // }

  // isRecordingData = !isRecordingData;
}

function getMoteusDataObjectFromIdentifier(itemName: String) {
  // for (let index = 0; index < moteuesDataChoice.length; index++) {
  //   if (moteuesDataChoice[index].identifier == itemName) {
  //     return moteuesDataChoice[index];
  //   }
  // }

  // return null;
}

function getMoteusDataObjectFromName(itemName: String) {
  // for (let index = 0; index < moteuesDataChoice.length; index++) {
  //   if (moteuesDataChoice[index].prettyName == itemName) {
  //     return moteuesDataChoice[index];
  //   }
  // }

  // return null;
}

/**
 * Used as a callback for the checkboxes
 * All this does it hold the logical state
 */
function checkboxClicked(name: String) {
  // let dataEntry = getMoteusDataObjectFromName(name)
  // if (dataEntry != null) {
  //   dataEntry.shouldRecordData.value = !dataEntry.shouldRecordData.value
  //   console.log(name + "" + dataEntry.shouldRecordData.value)
  // }
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

      <!--div class="moteus-reminder">Motor Controller: <b>Moteus</b></div-->

    </div>

    <div>
      <button v-if="showAllFeatures" id="record_button"
        v-bind:class="{ 'record-button-green': !isRecordingData, 'record-button-red': isRecordingData }"
        @click="recordButtonPressed">{{ recordButtonText }}</button>
    </div>


    <div class="flex-container flex-vertical">
      <TelemetryDataDisplay v-for="(item) in moteuesDataChoice" v-bind:itemName="item.prettyName"
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
  margin-top: 5px;
}

.record-button-red {
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