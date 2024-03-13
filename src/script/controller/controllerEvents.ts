import ROSLIB from 'roslib';
import { ref } from 'vue';
import {ControllerState} from "./controllerState"; 

// How many times a second we update the controller
const POLLING_RATE_IN_HERTZ = 20;

// Used to determine when we should send joystick/trigger data
// We only send joystick/trigger data when a large enough change 
// in the position of the joystick/triggerr happen. Aka the velocity
// of the joystick/trigger
// The higher the value, the faster we must be moving the joystick/trigger
// in order to send the value. 
//
// 0 = always send data
// 1 = never send data (unless you are really fast with the joystick/trigger)
const DELTA_SENSITIVTY = 0.01;


let indexToControllerName = new Map();
let indexToControllerState = new Map();
let isGamepadConnected = ref<boolean>(false);
let ros : ROSLIB.Ros;

// Currently, I have it hardcoded that we use index 0 (the first controller connected)
// TODO: Make it possible to use multiple controllers and map different controller bindings
// to each controller using the UI. 
export default function getControllerStatus(passedRos : ROSLIB.Ros){
    ros = passedRos;

    // When the cotnroller is added
    window.addEventListener("gamepadconnected", (e) => {
        console.log("Controller connected with index %d\n" + e.gamepad.id, e.gamepad.index);
        indexToControllerName.set(e.gamepad.index, e.gamepad.id)
        let state = new ControllerState("src\\script\\controller\\testControllerBindings.json", DELTA_SENSITIVTY);
        indexToControllerState.set(e.gamepad.index, state);

        if (indexToControllerName.has(0)) {
            isGamepadConnected.value = true;
            setInterval(pollController, 1000 / POLLING_RATE_IN_HERTZ);
        }

        
    });

    // When a controller is removed
    window.addEventListener("gamepaddisconnected", (e) => {
        console.log("Removing controller with index %d\n" + e.gamepad.id, e.gamepad.index);
        indexToControllerName.delete(e.gamepad.index);
        indexToControllerState.delete(e.gamepad.index);
        isGamepadConnected.value = false;
    });

    return isGamepadConnected;
}

// Poll each controller
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
