<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import DropDownItem from "../components/DropDownItem.vue"
import { render, h } from 'vue'

onMounted(() => initialize());



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
    isSelected: ref(true)
  },

]

const canID = ref(null);

function initialize() {


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
  <div class="dropdown" style="border: 2px solid RED;">
    <button class="dropbtn">Dropdown</button>
    <div class="dropdown-content">
      <DropDownItem
        v-for="(item) in moteuesDataChoice"
        @callback="itemClicked(item.identifier)"
        v-bind:itemName="item.prettyName"
        v-bind:isSelected="item.isSelected.value"
      ></DropDownItem>

    </div>


  </div>

  <!--div class="dropdown" style="border: 2px solid RED;">
    <button class="dropbtn">Dropdown</button>
    <div class="dropdown-content" v-html="raw_html"></di>
    <div class="dropdown-content">
      <DropDownItem ref="canIDref" @callback="itemClicked('canID')" itemName="canID"></DropDownItem>
      <DropDownItem @callback="itemClicked('position')" itemName="position"></DropDownItem>
      <DropDownItem @callback="itemClicked('velocity')" itemName="velocity"></DropDownItem>
      <DropDownItem @callback="itemClicked('torque')" itemName="torque"></DropDownItem>
      <DropDownItem @callback="itemClicked('temperature')" itemName="temperature"></DropDownItem>
      <DropDownItem @callback="itemClicked('power')" itemName="power"></DropDownItem>
      <DropDownItem @callback="itemClicked('inputVoltage')" itemName="inputVoltage"></DropDownItem>
    </div>
  </div>

  <div>
      <b>canID: </b>
      <b>{{canIDVal}}</b>
  </div-->



</template>


<style>
.flex-container {
  display: flex;
  justify-content: space-between;
}

.item{
  font-weight: bolder;
}


.dropdown-item {
  color: blue;
}


.dropbtn {
  background-color: #04AA6D;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
  background-color: #3e8e41;
}
</style>