<script setup lang="ts">
import ROSLIB, { Ros } from 'roslib';
import { ref, onMounted, inject } from 'vue'

const myRos = inject<Ros>('ros')

onMounted(() => initialize());

let service : ROSLIB.Service;

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
        service = new ROSLIB.Service({
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

    service.callService(request, function(result) {
        console.log("Result from service " + result.current_mode)
        current_arm_mode.value = result.current_mode
        //isLoaded.value = true
    })


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
                <button v-bind:class="{'button-mode-unselected': current_arm_mode != 0, 'button-mode-selected': current_arm_mode == 0,}">Disabled</button>
                <button v-bind:class="{'button-mode-unselected': current_arm_mode != 1, 'button-mode-selected': current_arm_mode == 1,}">Individual Motor Control (Velocity)</button>
                <button v-bind:class="{'button-mode-unselected': current_arm_mode != 2, 'button-mode-selected': current_arm_mode == 2,}">Individual Motor Control (Position)</button>
                <button v-bind:class="{'button-mode-unselected': current_arm_mode != 3, 'button-mode-selected': current_arm_mode == 3,}">Inverse Kinematics</button>
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
    background-color: rgb(56, 201, 68);
    color: white;
    padding: 8px;
    font-size: 16px;
    border: none;
    border-radius: 10px;
}

.button-mode:hover {
    background-color: rgb(22, 131, 28);
}
</style>