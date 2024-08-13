<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import DropDownItem from "../components/DropDownItem.vue"

onMounted(() => initialize());


var raw_html = ref("");

const possibleChoices = new Set([
  "canID",
  "position",
  "velocity",
  "torque",
  "temperature",
  "power",
  "inputVoltage"
]);



function initialize() {



  //alert("setting up page")
};


function itemClicked(itemName: String) {
  //alert(itemName)

  

}

</script>



<template>
  <div style="border: 2px solid RED;">
    Welcome to the moteusmotortelemetry
  </div>


  <div class="dropdown">
    <button class="dropbtn">Dropdown</button>
    <!--div class="dropdown-content" v-html="raw_html"></div-->
    <div class="dropdown-content">
      <DropDownItem ref="canIDref" @callback="itemClicked('canID')" itemName="canID"></DropDownItem>
      <DropDownItem @callback="itemClicked('position')" itemName="position"></DropDownItem>
      <DropDownItem @callback="itemClicked('velocity')" itemName="velocity"></DropDownItem>
      <DropDownItem @callback="itemClicked('torque')" itemName="torque"></DropDownItem>
      <DropDownItem @callback="itemClicked('temperature')" itemName="temperature"></DropDownItem>
      <DropDownItem @callback="itemClicked('power')" itemName="power"></DropDownItem>
      <DropDownItem @callback="itemClicked('inputVoltage')" itemName="inputVoltage"></DropDownItem>
      

      <!--div class="dropdown-item flex-container" @click="itemClicked('ahhh')">
        <div class="item">ahhh</div>
        <div class="item">✓</div-->

      




    </div>
  </div>



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