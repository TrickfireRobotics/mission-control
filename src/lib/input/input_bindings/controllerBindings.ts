import type { ControllerBind } from "./bindingTypes";

function Say(str: string, times: number) {
  console.log(str.repeat(times));
}

function SayStuff() {
  console.log('Stuff!');
}

const controllerBindings: {[input: string]: ControllerBind}[][] = [
    [
        {
            aButton: SayStuff,
            bButton: { function: Say, args: ['Controller', 3] },
            xButton: 'gripLinearOpen',
            yButton: 'gripLinearClose',
            leftBumperButton: 'left_wrist_ccw',
            rightBumperButton: 'right_wrist_ccw',
            leftTriggerButton: 'left_wrist_cw',
            rightTriggerButton: 'right_wrist_cw',
            backButton: 'turntable_ccw',
            startButton: 'turntable_cw',
            leftJoystickButton: '',
            rightJoystickButton: '',
            dpadUPButton: 'elbow_up',
            dpadDOWNButton: 'elbow_down',
            dpadLEFTButton: 'shoulder_down',
            dpadRIGHTButton: 'shoulder_up',
            leftJoyXAxis: '',
            leftJoyYAxis: 'move_left_drivebase_side_message',
            rightJoyXAxis: '',
            rightJoyYAxis: 'move_right_drivebase_side_message',
        }
    ],
    [
        {
            aButton: SayStuff,
            bButton: { function: Say, args: ['Controller', 3] },
            xButton: 'gripLinearOpen',
            yButton: 'gripLinearClose',
            leftBumperButton: 'left_wrist_ccw',
            rightBumperButton: 'right_wrist_ccw',
            leftTriggerButton: 'left_wrist_cw',
            rightTriggerButton: 'right_wrist_cw',
            backButton: 'turntable_ccw',
            startButton: 'turntable_cw',
            leftJoystickButton: '',
            rightJoystickButton: '',
            dpadUPButton: 'elbow_up',
            dpadDOWNButton: 'elbow_down',
            dpadLEFTButton: 'shoulder_down',
            dpadRIGHTButton: 'shoulder_up',
            leftJoyXAxis: '',
            leftJoyYAxis: 'move_left_drivebase_side_message',
            rightJoyXAxis: '',
            rightJoyYAxis: 'move_right_drivebase_side_message',
        }
    ]
]

export default controllerBindings;