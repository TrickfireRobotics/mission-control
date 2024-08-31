<script setup lang="ts">
import ROSLIB, { Ros } from 'roslib';
import { ref, onMounted, inject } from 'vue'

const myRos = inject<Ros>('ros')

onMounted(() => initialize());

let service : ROSLIB.Service;

function initialize() {
    if (myRos != null) {
        service = new ROSLIB.Service({
            ros: myRos,
            name: "/get_arm_mode",
            serviceType: "ResponseStructure"
        })
    }
}

function sendRequest() {
    var request = {
        input: 1
    }

    service.callService(request, function(result) {
        console.log("Result from service")
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
                <button class="button-mode" @click="sendRequest">TEST</button>
                <button class="button-mode">Individual Motor Control (Velocity)</button>
                <button class="button-mode">Individual Motor Control (Position)</button>
                <button class="button-mode">Inverse Kinematics</button>
                <button class="button-mode">Disabled</button>
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

.button-mode {
    margin: 5px;
    background-color: rgb(48, 182, 48);
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