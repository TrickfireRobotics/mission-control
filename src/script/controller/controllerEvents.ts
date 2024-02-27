import ROSLIB, { Ros } from 'roslib';
import { ref } from 'vue';

const POLLING_RATE_IN_HERTZ = 20;
let controllerList :Map<number, string>;
let isGamepadConnected = ref<boolean>(false);


export default function getControllerStatus(){
    window.addEventListener("gamepadconnected", (e) => {
        console.log("Controller connected with index %d\n" + e.gamepad.id, e.gamepad.index);
        isGamepadConnected.value = true;
    });

    window.addEventListener("gamepaddisconnected", (e) => {
        console.log("Removing controller with index %d\n" + e.gamepad.id, e.gamepad.index);
        isGamepadConnected.value = false;
    });

    return isGamepadConnected;
}


// window.addEventListener("gamepadconnected", (e) => {
//     console.log("Controller connected with index %d\n" + e.gamepad.id, e.gamepad.index);
//     controllerList.set(e.gamepad.index, e.gamepad.id)
//     //getControllerStatus();
// })


// window.addEventListener("gamepaddisconnected", (e) => {
//     console.log("Removing controller with index %d\n" + e.gamepad.id, e.gamepad.index);
//     controllerList.delete(e.gamepad.index);
// })

// export default function startControllerCode(){
//     console.log("Starting controller code");
//     controllerList = new Map();
// }

// export function getControllerStatus() {
//     console.log("asdasas" + controllerList.has(0));
//     //isGamepadConnected.value = controllerList.has(0);
//     isGamepadConnected.value = true;

//     return isGamepadConnected;
// }

