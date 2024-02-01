class ControllerObject {
    // Instance fields

    // Joysticks
    leftJoyStickArray = Array(2).fill(0)  // [0] = x-axis [1] = y-axis
    rightJoyStickArray = Array(2).fill(0) // [0] = x-axis [1] = y-axis

    leftJoystickButtonState = 0
    rightJoystickButtonState = 0

    // The four main buttons
    xButtonState = 0 // 0 = false; 1 = true
    yButtonState = 0
    bButtonState = 0
    aButtonState = 0

    // Bumpers
    leftBumperButtonState = 0
    rightBumperButtonState = 0

    // Triggers
    leftTriggerButtonState = 0
    rightTriggerButtonState = 0

    // D-Pad

    // ROSBRIDGE
    ros = null
    controllerBindings = null

    pubIDToPubObj = new Map()

    // Maps and builds the publishers
    constructor(){
        //console.log("creating")

    }

    createController(rosBridge, jsonControllerBindingFile) {
        console.log("createController")
        this.ros = rosBridge

        fetch(jsonControllerBindingFile)
            .then(response => response.json())
            .then(json => this.controllerBindings = json)
            .then(json => this.createPublishers(this.controllerBindings))
    }

    createPublishers(json){
        console.log("create publishers")

        json = JSON.stringify(json)
        json = JSON.parse(json)
        //console.log(json.bindings[0])

        for (let inputIndex = 0; inputIndex < json.length; inputIndex++) {
            let controlSchemeEntry = json.bindings[inputIndex]
            let topicName = "/" + controlSchemeEntry.publisherTopic

            let aPublisher = new ROSLIB.Topic({
                ros: this.ros,
                name: topicName,
                messageType: 'std_msgs/Float32'
            })

            this.pubIDToPubObj.set(inputIndex, aPublisher)
        }

    }

    updateController(jsControllerObject){
        //console.log("updating")

        let joystickArray = jsControllerObject.axes;

        //console.log(joystickArray)

        this.leftJoyStickArray[0] = joystickArray[0]
        this.leftJoyStickArray[1] = joystickArray[1]

        this.rightJoyStickArray[0] = joystickArray[2]
        this.rightJoyStickArray[1] = joystickArray[3]

        let buttonArray = jsControllerObject.buttons;

        

        this.aButtonState = buttonArray[0];
        this.bButtonState = buttonArray[1];
        this.xButtonState = buttonArray[2];
        this.yButtonState = buttonArray[3];

        this.leftBumperButtonState = buttonArray[4];
        this.rightBumperButtonState = buttonArray[5];

        this.leftTriggerButtonState = buttonArray[6];
        this.rightBumperButtonState = buttonArray[7];

        //backbutton 8
        //startbutton 9

        this.leftJoystickButtonState = buttonArray[10];
        this.rightBumperButtonState = buttonArray[11];

        //dpad up 12
        //dpad down 13
        //dpad left 14
        //dpad right 15

        //Publish left joystick x axis and y axis
        this.publishJoystick(this.pubIDToPubObj.get(17), this.leftJoyStickArray[1]);
        this.publishJoystick(this.pubIDToPubObj.get(19), this.rightJoyStickArray[1]);





        


    }

    publishJoystick(publisher, number){
        let message = new ROSLIB.Message({
            data: number
        });

        publisher.publish(message);
    }

    publishButton(publisher, data){

    }
}

export {ControllerObject}