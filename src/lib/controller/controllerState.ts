import { useRoslibStore } from '@/store/useRoslib';

/* This stores controller data for each controller connected to the system.
 * Button data are always sent, no matter what.
 * Joystick/Triggers have to go above a certain threshold (deltaSenitivity)
 * in order to be sent in order to avoid flooding the ROS network with
 * cotroller data. Essentially, we look at the velocity of the joystick/trigger
 * and determine if it is fast enough to send data.
 */

class ControllerState {
  // Joysticks
  leftJoyStickArray = Array(2).fill(0); // [0] = x-axis [1] = y-axis
  rightJoyStickArray = Array(2).fill(0); // [0] = x-axis [1] = y-axis

  // Buttons
  currentStateButtons = Array(16).fill(0);
  // These indices are the same as the one in the JSON file
  // [0] aButton
  // [1] bButton
  // [2] xButton
  // [3] yButton
  // [4] leftBumperButton
  // [5] rightBumperButton
  // [6] leftTriggerButton (From 0 to 1 with all the decimal values inbetween)
  // [7] rightTriggerButton (From 0 to 1 with all the decimal values inbetween)
  // [8] backButton
  // [9] startButton
  // [10] leftJoyStickButton
  // [11] rightJoystickButton
  // [12] dpadUPButton
  // [13] dpadDOWNButton
  // [14] dpadLEFTButton
  // [15] dpadRIGHTButton

  //CHANGE IN THE VARIABLES
  leftJoyStickArrayDELTA = Array(2).fill(0); // [0] = x-axis [1] = y-axis
  rightJoyStickArrayDELTA = Array(2).fill(0); // [0] = x-axis [1] = y-axis

  // Same format as currentStateButtons
  deltaStateButtons = Array(16).fill(0);

  deltaSensitivity = 0;

  //Key bindings
  buttonIndexToPublisherName = new Map();
  joystickIndexToPublisherName = new Map();

  // Takes in a string that points to the binding JSON file as well as the deltaSensitivity
  constructor(jsonControllerBinding: string, deltaSensitivity: number) {
    this.deltaSensitivity = deltaSensitivity;

    fetch(jsonControllerBinding)
      .then((response) => response.json())
      .then((json) => this.readJSONFile(json));
  }

  readJSONFile(jsonInput: JSON) {
    // These two lines convert the JSON to be read
    let json = JSON.stringify(jsonInput);
    json = JSON.parse(json);

    // Since the JSON file is an array of length 20,
    // each entry has the following properties:
    // "name"
    // "type"
    // "index"
    // "publisherTopic"
    //
    // "entry" is the index of the JSON array [0,19]
    for (let entry = 0; entry < json.length; entry++) {
      // Get the JSON entry
      const controlSchemeEntry = json.bindings[entry];

      const index = Number(controlSchemeEntry.index);
      const type = controlSchemeEntry.type;
      const topicName = '/' + controlSchemeEntry.publisherTopic;

      if (type === 'button') {
        if (topicName !== '/') {
          this.buttonIndexToPublisherName.set(index, topicName);
          console.log('Mapped button with index ' + index + ' to topic ' + topicName);
        } else {
          this.buttonIndexToPublisherName.set(index, '');
        }
      } else if (type === 'joystick') {
        if (topicName !== '/') {
          this.joystickIndexToPublisherName.set(index, topicName);
          console.log('Mapped axis with index ' + index + ' to topic ' + topicName);
        } else {
          this.joystickIndexToPublisherName.set(index, '');
        }
      }
    }
  }

  // Update both the delta and the current values on the controller
  updateState(gamepad: Gamepad, deltaT: number) {
    const joystickArray = gamepad.axes;
    const buttonArray = gamepad.buttons;

    // Left joystick X and Y axis
    this.leftJoyStickArrayDELTA[0] = joystickArray[0] - this.leftJoyStickArray[0];
    this.leftJoyStickArrayDELTA[1] = joystickArray[1] - this.leftJoyStickArray[1];
    this.leftJoyStickArray[0] = joystickArray[0];
    this.leftJoyStickArray[1] = joystickArray[1];

    // Right joystick X and y axis
    this.rightJoyStickArrayDELTA[0] = joystickArray[2] - this.rightJoyStickArray[0];
    this.rightJoyStickArrayDELTA[1] = joystickArray[3] - this.rightJoyStickArray[1];
    this.rightJoyStickArray[0] = joystickArray[2];
    this.rightJoyStickArray[1] = joystickArray[3];

    // Update buttons

    for (let index = 0; index < 16; index++) {
      this.deltaStateButtons[index] = buttonArray[index].value - this.currentStateButtons[index];
      this.currentStateButtons[index] = buttonArray[index].value;
    }
  }

  // Print the current state of the controller as seen by the browser
  printNumbers() {}

  // Publish the values to the ROS network
  publishController() {
    const rosjs = useRoslibStore();

    //Left joystick X axis

    if (Math.abs(this.leftJoyStickArrayDELTA[0]) > this.deltaSensitivity) {
      //console.log("send LEFT joystick X");
      console.log(this.joystickIndexToPublisherName);
      rosjs.publish(
        this.joystickIndexToPublisherName.get(0),
        'std_msgs/Float32',
        this.leftJoyStickArray[0],
      );
      // controllerPub(ros, this.joystickIndexToPublisherName.get(0), this.leftJoyStickArray[0]);
    }

    //Left joystick Y axis
    if (Math.abs(this.leftJoyStickArrayDELTA[1]) > this.deltaSensitivity) {
      //console.log("send LEFT joystick Y");
      rosjs.publish(
        this.joystickIndexToPublisherName.get(1),
        'std_msgs/Float32',
        this.leftJoyStickArray[1],
      );
      // controllerPub(ros, this.joystickIndexToPublisherName.get(1), this.leftJoyStickArray[1]);
    }

    //Right joystick X axis
    if (Math.abs(this.rightJoyStickArrayDELTA[0]) > this.deltaSensitivity) {
      //console.log("send RIGHT joystick X");
      rosjs.publish(
        this.joystickIndexToPublisherName.get(2),
        'std_msgs/Float32',
        this.rightJoyStickArray[0],
      );
      // controllerPub(ros, this.joystickIndexToPublisherName.get(2), this.rightJoyStickArray[0]);
    }

    //Left joystick Y axis
    if (Math.abs(this.rightJoyStickArrayDELTA[1]) > this.deltaSensitivity) {
      //console.log("send RIGHT joystick Y");
      rosjs.publish(
        this.joystickIndexToPublisherName.get(3),
        'std_msgs/Float32',
        this.rightJoyStickArray[1],
      );
      // controllerPub(ros, this.joystickIndexToPublisherName.get(3), this.rightJoyStickArray[1]);
    }

    /*
     * Triggers are handled the same way as joysticks to prevent spamming
     */

    // Left Trigger
    if (Math.abs(this.deltaStateButtons[6]) > this.deltaSensitivity) {
      rosjs.publish(
        this.joystickIndexToPublisherName.get(6),
        'std_msgs/Float32',
        this.currentStateButtons[6],
      );
      // controllerPub(ros, this.buttonIndexToPublisherName.get(6), this.currentStateButtons[6]);
    }

    // Right Trigger
    if (Math.abs(this.deltaStateButtons[7]) > this.deltaSensitivity) {
      rosjs.publish(
        this.joystickIndexToPublisherName.get(7),
        'std_msgs/Float32',
        this.currentStateButtons[7],
      );
      // controllerPub(ros, this.buttonIndexToPublisherName.get(7), this.currentStateButtons[7]);
    }

    // Send button data. Skip index 6 and 7 as that are the triggers
    for (let index = 0; index < 16; index++) {
      if (index !== 6 && index !== 7 && Math.abs(this.deltaStateButtons[index]) === 1) {
        // controllerPub(
        //   ros,
        //   this.buttonIndexToPublisherName.get(index),
        //   this.currentStateButtons[index],
        // );
        rosjs.publish(
          this.buttonIndexToPublisherName.get(index),
          'std_msgs/Float32',
          this.currentStateButtons[index],
        );
      }
    }
  }
}

export { ControllerState };
