<script setup lang="ts">
import ROSLIB, { Ros } from 'roslib';
import { ref, onMounted, inject } from 'vue'
 import genericPub from '../roslib/genericPub'

const myRos = inject<Ros>('ros')


onMounted(() => initialize());

let armModeService : ROSLIB.Service;


/**
 * disabled = 0
 * individual_motor_control_vel = 1
 * individual_motor_control_pos = 2
 * inverse_kinematics = 3
 */
let current_arm_mode = ref(-1) // Default is disabled
//let isLoaded = ref(false);


function initialize() {
    if (myRos != null) {
        armModeService = new ROSLIB.Service({
            ros: myRos,
            name: "/get_arm_mode",
            serviceType: "ArmMode"
        })

        getCurrentArmMode()

    }
}

function getCurrentArmMode() {
    var request = { //Dummy data for now
        input: 1
    }

    armModeService.callService(request, function(result) {
        console.log("Result from service " + result.current_mode)
        current_arm_mode.value = result.current_mode
        //isLoaded.value = true
    })


}


function changeArmMode(targetMode : Number){
    console.log("Target mode wanted" + targetMode)

    if (myRos != null) {
        genericPub(myRos,targetMode, "update_arm_mode","std_msgs/Int32")
        getCurrentArmMode()
    }
}

</script>


<template>
    <div class="mode-button-container">
        <div class="mode-button-vertical">
            <div>
                <b class="mode-text">Arm Control Mode:</b>
            </div>
            <div>
                <!--button class="button-mode" @click="sendRequest">TEST</button-->
                <button @click="changeArmMode(0)" v-bind:class="{'button-mode-unselected': current_arm_mode != 0, 'button-mode-selected': current_arm_mode == 0,}">Disabled</button>
                <button @click="changeArmMode(1)" v-bind:class="{'button-mode-unselected': current_arm_mode != 1, 'button-mode-selected': current_arm_mode == 1,}">Individual Motor Control (Velocity)</button>
                <button @click="changeArmMode(2)" v-bind:class="{'button-mode-unselected': current_arm_mode != 2, 'button-mode-selected': current_arm_mode == 2,}">Individual Motor Control (Position)</button>
                <button @click="changeArmMode(3)" v-bind:class="{'button-mode-unselected': current_arm_mode != 3, 'button-mode-selected': current_arm_mode == 3,}">Inverse Kinematics</button>
            </div>
        </div>
    </div>


</template>

<style lang="scss">
.mode-button-container {
    display: flex;
    justify-content: center;
}

.mode-text {
    display: flex;
    justify-content: center;
}

.mode-button-vertical {
    display: flex;
    flex-direction: column;
}

.button-mode-unselected {
    margin: 5px;
    background-color: rgb(201, 56, 56);
    color: white;
    padding: 8px;
    font-size: 16px;
    border: none;
    border-radius: 10px;
}

.button-mode-selected{
    margin: 5px;
    background-color: rgb(48, 182, 48);
    color: white;
    padding: 8px;
    font-size: 16px;
    border: none;
    border-radius: 10px;
}

.button-mode-unselected:hover {
    background-image: linear-gradient(rgb(0 0 0/40%) 0 0);
}

.button-mode-selected:hover {
    background-image: linear-gradient(rgb(0 0 0/40%) 0 0);
}

</style>