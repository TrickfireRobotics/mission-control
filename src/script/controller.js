let ros = null
let controllerObject = null

//Setup the ROS publishers
let testTopic = null

function publishTest(number) {
    let testMessage = new ROSLIB.Message({
        data: number
    });

    testTopic.publish(testMessage)
    console.log("test published")
}






function startControllerCode (rosObject) {
    ros = rosObject
    if (ros != null) {
        
        ros = rosObject
        testTopic = new ROSLIB.Topic({
            ros: ros,
            name:'/testTopic',
            messageType: 'std_msgs/Float32'
        });
        

        
    }

}

window.addEventListener("gamepadconnected", (e) => {
    console.log(
        "Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index,
        e.gamepad.id,
        e.gamepad.buttons.length,
        e.gamepad.axes.length,
    );
        
    controllerObject = navigator.getGamepads()[e.gamepad.index]

    //Going at 60 hertz
    //setInterval(pollController, 0.016)
    setInterval(pollController, 100)
    
  });
  

window.addEventListener("gamepaddisconnected", (e) => {
console.log(
    "Gamepad disconnected from index %d: %s",
    e.gamepad.index,
    e.gamepad.id,
);
});

function pollController() {
    controllerObject = navigator.getGamepads()[0]
    if (ros != null) {    
        
        //publishTest()
        
    }
    let buttonArray = controllerObject.axes
    //console.log("polling")
    console.log(buttonArray[0])
    publishTest(buttonArray[0])

}

export {startControllerCode}