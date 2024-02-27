import ROSLIB from 'roslib';
import { ref } from 'vue';
import {ControllerState} from "./controllerState"; 

const POLLING_RATE_IN_HERTZ = 20;
const DELTA_SENSITIVTY = 0.01;
let indexToControllerName = new Map();
let indexToControllerState = new Map();
//let indexToJSCGamepad = new Map();
let isGamepadConnected = ref<boolean>(false);
let ros : ROSLIB.Ros;
let test = 0;


export default function getControllerStatus(passedRos : ROSLIB.Ros){
    ros = passedRos;
    window.addEventListener("gamepadconnected", (e) => {
        console.log("Controller connected with index %d\n" + e.gamepad.id, e.gamepad.index);
        indexToControllerName.set(e.gamepad.index, e.gamepad.id)
        let state = new ControllerState("src\\script\\controller\\testControllerBindings.json", DELTA_SENSITIVTY);
        indexToControllerState.set(e.gamepad.index, state);
        //indexToJSCGamepad.set(e.gamepad.index, e.gamepad);

        if (indexToControllerName.has(0)) {
            isGamepadConnected.value = true;
            setInterval(pollController, 1000 / POLLING_RATE_IN_HERTZ);
            //setInterval(function() {pollController(e.gamepad)} , 1000 / POLLING_RATE_IN_HERTZ);
        }

        
    });

    window.addEventListener("gamepaddisconnected", (e) => {
        console.log("Removing controller with index %d\n" + e.gamepad.id, e.gamepad.index);
        indexToControllerName.delete(e.gamepad.index);
        indexToControllerState.delete(e.gamepad.index);
        //indexToJSCGamepad.delete(e.gamepad.index);
        isGamepadConnected.value = false;
    });

    return isGamepadConnected;
}


function pollController(){
    if (ros.isConnected) {
        indexToControllerState.forEach(processInput);

    }

}

function processInput(state : ControllerState, key : number, map : Map<number, Gamepad>) {
    let jsGamepad = navigator.getGamepads()[key];

    if (jsGamepad != null) {
        state.updateState(jsGamepad, 1000 - POLLING_RATE_IN_HERTZ);
        state.publishController(ros);
        //state.printNumbers();
    }
    
    

}
