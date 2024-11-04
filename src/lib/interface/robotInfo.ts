import ROSLIB from 'roslib';

export default class RobotInfo {
  myROS = null;
  getMoteusMotorStateService = null;

  constructor(givenROS) {
    this.myROS = givenROS;

    if (this.myROS !== null) {
      this.getMoteusMotorStateService = new ROSLIB.Service({
        ros: this.myROS,
        name: '/get_moteus_motor_state',
        serviceType: 'MoteusState',
      });
    }
  }

  getMoteusMotorState(canfdID: number, callback) {
    const request = {
      target_can_id: canfdID,
    };

    this.getMoteusMotorStateService.callService(request, callback);
  }

  getRMDx8MotorState(can2ID: number) {}
}

export { RobotInfo };
