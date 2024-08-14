<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import DropDownItem from "../components/DropDownItem.vue"
import TelemetryDataDisplay from "../components/TelemetryDataDisplay.vue"
import { render, h } from 'vue'

onMounted(() => initialize());

const props = defineProps(['moteusCANID', 'displayName', 'preset']);

const possiblePresets = ["FULL", "IMPORTANT"];

const moteuesDataChoice = [
  {
    prettyName: "CAN ID",
    identifier: "canID",
    dataValue: -1,
    isSelected: ref(false)
  },
  {
    prettyName: "Position",
    identifier: "position",
    dataValue: -1,
    isSelected: ref(false)
  },
  {
    prettyName: "Velocity",
    identifier: "velocity",
    dataValue: -1,
    isSelected: ref(false)
  },
  {
    prettyName: "Torque",
    identifier: "torque",
    dataValue: -1,
    isSelected: ref(false)
  },
  {
    prettyName: "Temperature",
    identifier: "temperature",
    dataValue: -1,
    isSelected: ref(false)
  },
  {
    prettyName: "Power",
    identifier: "power",
    dataValue: -1,
    isSelected: ref(false)
  },
  {
    prettyName: "Input Voltage",
    identifier: "inputVoltage",
    dataValue: -1,
    isSelected: ref(false)
  },

]

function initialize() {
  console.log(props.moteusCANID)
  moteuesDataChoice[0].dataValue = props.moteusCANID;
  

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

};


function itemClicked(itemName: String) {
  //alert(itemName)
  let mything = getMoteusObject(itemName);
  if (mything != null) {
    mything.isSelected.value = !mything.isSelected.value;
  }
  

}

function getMoteusObject(itemName: String){
  for (let index = 0; index < moteuesDataChoice.length; index++) {
    if (moteuesDataChoice[index].identifier == itemName) {
      return moteuesDataChoice[index];
    }
  }

  return null;
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
  
        <div class="moteus-reminder">Motor Controller: <b>Moteus</b></div>

      </div>

    
      <div>
        <TelemetryDataDisplay 
          v-for="(item) in moteuesDataChoice"
          v-bind:itemName="item.prettyName"
          v-bind:isSelected="item.isSelected.value"
          v-bind:value="item.dataValue">
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