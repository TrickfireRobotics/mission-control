    
class ControllerState{

    // Joysticks
    leftJoyStickArray = Array(2).fill(0)  // [0] = x-axis [1] = y-axis
    rightJoyStickArray = Array(2).fill(0) // [0] = x-axis [1] = y-axis

    leftJoystickButtonState = 0
    rightJoystickButtonState = 0

    // The four main buttons
    xButtonState = 0; // 0 = false; 1 = true
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
    dpadUP = 0;
    dpadDOWN = 0;
    dpadLEFT = 0;
    dpadRIGHT = 0;

    //CHANGE IN THE VARIABLES
    leftJoyStickArrayDELTA = Array(2).fill(0)  // [0] = x-axis [1] = y-axis
    rightJoyStickArrayDELTA = Array(2).fill(0) // [0] = x-axis [1] = y-axis

    leftJoystickButtonStateDELTA = 0
    rightJoystickButtonStateDELTA = 0

    constructor() {

    }

    updateState(gamepad : Gamepad, deltaT : number) {
        let joystickArray = gamepad.axes;
        
        // Left joystick X and Y axis
        this.leftJoyStickArrayDELTA[0] = joystickArray[0] - this.leftJoyStickArray[0];
        this.leftJoyStickArrayDELTA[1] = joystickArray[1] - this.leftJoyStickArray[1];
        this.leftJoyStickArray[0] = joystickArray[0];
        this.leftJoyStickArray[1] = joystickArray[1];

        // RIght joystick X and y axis
        this.rightJoyStickArrayDELTA[0] = joystickArray[2] - this.rightJoyStickArray[2];
        this.rightJoyStickArrayDELTA[1] = joystickArray[3] - this.rightJoyStickArray[3];
        this.rightJoyStickArray[2] = joystickArray[2];
        this.rightJoyStickArray[3] = joystickArray[3];



        let buttonArray = gamepad.buttons;

        this.aButtonState = buttonArray[0].value;
        this.bButtonState = buttonArray[1].value;
        this.xButtonState = buttonArray[2].value;
        this.yButtonState = buttonArray[3].value;

        this.leftBumperButtonState = buttonArray[4].value;
        this.rightBumperButtonState = buttonArray[5].value;

        this.leftTriggerButtonState = buttonArray[6].value;
        this.rightBumperButtonState = buttonArray[7].value;

        //backbutton 8
        //startbutton 9

        this.leftJoystickButtonState = buttonArray[10].value;
        this.rightBumperButtonState = buttonArray[11].value;

        //dpad up 12
        //dpad down 13
        //dpad left 14
        //dpad right 15

        
    }

    printNumbers () {
        console.log("LEFT JOYSTICK X" + this.leftJoyStickArray[0]);
        console.log("LEFT JOYSTICK Y" + this.leftJoyStickArray[1]);

        console.log("RIGHT JOYSTICK X" + this.rightJoyStickArray[2]);
        console.log("RIGHT JOYSTICK Y" + this.rightJoyStickArray[3]);
    }

}


export {ControllerState}
    
