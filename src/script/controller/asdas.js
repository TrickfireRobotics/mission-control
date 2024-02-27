// import {ControllerObject} from "./controllerObj"; 

// // This connect us to the rosbridge object
// let ros = null;
// let pollingHateInHertz = 20
// let controllerSet = new Set()
// let controllerMap = new Map() // index -> controllerObj
// let controllerScheme1 = new ControllerObject();



// // This is the entry point to start the controller code
// // This is where we create the publishers and
// // set the ros variable to the rosbridge ros object
// function startControllerCode(rosObject) {
    
//     if (rosObject != null) {
//         ros = rosObject
//         // console.log("I am here")

//         //controllerMap.forEach((value, key, map) => {controllerMap.get(value).createController(ros, "src\\script\\controller\\testControllerBindings.json")});

        

//         // for (let index = 0; index < controllerArray.length; index++) {
//         //     controllerMap.set(index, controllerScheme1)
//         //     console.log(controllerMap.get(index))
//         // }
        
//         //createPublishers()    

//     }
//     else {
//         console.log("Failed to start controller code. The rosbridge object is null. Check Navbar.vue")
//     }


// }

// // This happens once a new controller is connected/plugged in
// // Hardcode to work with index 0 for now
// window.addEventListener("gamepadconnected", (e) => {
//     console.log("Controller connect with index %d",e.gamepad.index)

//     // controllerSet.add(e.gamepad.index);
//     // controllerMap.set(e.gamepad.index, controllerScheme1);

//     if (ros != null) {
//         controllerScheme1.createController(ros, "src\\script\\controller\\testControllerBindings.json");
//         //controllerMap.forEach((value, key, map) => {controllerMap.get(value).createController(ros, "src\\script\\controller\\testControllerBindings.json")});
//     }

//     // controllerArray.push(e.gamepad.index)
//     // let controllerScheme1 = new ControllerObject(ros, "src\\script\\controller\\testControllerBindings.json")


//     setInterval(function() {pollController(e.gamepad.index)} , pollingHateInHertz)

// })


// // This happens once a controller is removed
// window.addEventListener("gamepaddisconnected", (e) => {
//     console.log("Gamepad disconnected with index %d", e.gamepad.index)
//     controllerSet.delete(e.gamepad.index);
// })

// // We check the status of the controller.
// // We then update out controller object
// // TODO, deal with controller indexes
// function pollController(index){
//     // If we have created the rosbridge correctly
//     if (ros != null) {

//         controllerScheme1.updateController(navigator.getGamepads()[0])

//         // for (let index = 0; index < controllerArray.length; index++) {
//         //     let jsControllerObject = controllerMap.get(index)
//         //     let controllerObject = controllerMap.get(index)
//         //     controllerObject.updateController(jsControllerObject)
//         // }

//         //hardcode index 0
//         //controllerObject = navigator.getGamepads()[index];
//         //updateControllerData()
//     }
// }



// // let ros = null
// // let controllerObject = null

// // //joysticks
// // let leftJoyStickArray = Array(2).fill(0)  //[0] = x-axis [1] = y-axis
// // let rightJoyStickArray = Array(2).fill(0) //[0] = x-axis [1] = y-axis

// // //buttons
// // let xButtonState = 0; //true = pressed down, false = not pressed
// // let yButtonState = 0;
// // let bButtonState = 0;
// // let aButtonState = 0;

// // let leftJoyStickButtonState = 0;
// // let rightJoyStickButtonState = 0;

// // let leftBumperButtonState = 0;
// // let rightBumperButtonState = 0;

// // let leftTriggerButtonState = 0;
// // let rightTriggerButtonState = 0;

// // //Publishers
// // let moveLeftDriveBaseCommand = null
// // let moveRightDriveBaseCommand = null


// // //Dpad




// // //Setup the ROS publishers
// // let testTopic = null

// // // function publishTest(number) {
// // //     let testMessage = new ROSLIB.Message({
// // //         data: number
// // //     });

// // //     testTopic.publish(testMessage)
// // //     console.log("test published")
// // // }






// // function startControllerCode (rosObject) {
// //     ros = rosObject
// //     if (ros != null) {
        
// //         ros = rosObject
// //         // testTopic = new ROSLIB.Topic({
// //         //     ros: ros,
// //         //     name:'/testTopic',
// //         //     messageType: 'std_msgs/Float32'
// //         // });

// //         moveLeftDriveBaseCommand = new ROSLIB.Topic({
// //             ros: ros,
// //             name: '/move_left_drivebase_side_message',
// //             messageType: 'std_msgs/Float32'
// //         });

// //         moveRightDriveBaseCommand = new ROSLIB.Topic({
// //             ros : ros,
// //             name: "move_right_drivebase_side_message",
// //             messageType: 'std_msgs/Float32'
// //         })

        
        

        
// //     }

// // }

// // window.addEventListener("gamepadconnected", (e) => {
// //     console.log(
// //         "Gamepad connected at index %d: %s. %d buttons, %d axes.",
// //         e.gamepad.index,
// //         e.gamepad.id,
// //         e.gamepad.buttons.length,
// //         e.gamepad.axes.length,
// //     );
        
// //     controllerObject = navigator.getGamepads()[e.gamepad.index]

// //     //Going at 60 hertz
// //     //setInterval(pollController, 0.016)
// //     setInterval(pollController, 1000)
    
    
// //   });
  

// // window.addEventListener("gamepaddisconnected", (e) => {
// // console.log(
// //     "Gamepad disconnected from index %d: %s",
// //     e.gamepad.index,
// //     e.gamepad.id,
// // );
// // });

// // function pollController() {
// //     //By default, the id for the first controller plugged in is 0
// //     controllerObject = navigator.getGamepads()[2]
// //     //updateControllerState()
// //     console.log(controllerObject.buttons)


// //     if (ros != null) {    
        
// //         let moveLeftDriveBaseMessage = new ROSLIB.Message({
// //             data: leftJoyStickArray[1]
// //         });
// //         moveLeftDriveBaseCommand.publish(moveLeftDriveBaseMessage)

// //         let moveRightDriveBaseMessage = new ROSLIB.Message({
// //             data: rightJoyStickArray[1]
// //         })
// //         moveRightDriveBaseCommand.publish(moveRightDriveBaseMessage)
        
// //     }
// //     //let buttonArray = controllerObject.axes
// //     //console.log("polling")
// //     //console.log(buttonArray)
// //     //publishTest(buttonArray[0])

// // }

// // function updateControllerState() {
// //     let joystickArray = controllerObject.axes;
// //     leftJoyStickArray[0] = joystickArray[0]
// //     leftJoyStickArray[1] = joystickArray[1]

// //     rightJoyStickArray[0] = joystickArray[2]
// //     rightJoyStickArray[1] = joystickArray[3]


// //     let buttonArray = controllerObject.buttons
// //     //console.log(buttonArray)

// //     aButtonState = buttonArray[0]
// //     bButtonState = buttonArray[1]
// //     xButtonState = buttonArray[2]
// //     yButtonState = buttonArray[3]

// //     leftJoyStickButtonState = buttonArray[10]
// //     rightJoyStickButtonState = buttonArray[11]

// //     leftBumperButtonState = buttonArray[4]
// //     rightBumperButtonState = buttonArray[5]

// //     leftTriggerButtonState = buttonArray[6]
// //     rightTriggerButtonState = buttonArray[7]

// // }

// export {startControllerCode}
