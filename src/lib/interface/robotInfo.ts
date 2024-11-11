import ROSLIB from 'roslib';

export default class RobotInfo {
  myROS: ROSLIB.Ros;
  getMoteusMotorStateService: ROSLIB.Service;

  constructor(givenROS: ROSLIB.Ros) {
    this.myROS = givenROS;

    this.getMoteusMotorStateService = new ROSLIB.Service({
      ros: this.myROS,
      name: '/get_moteus_motor_state',
      serviceType: 'MoteusState',
    });
  }

  getMoteusMotorState(canfdID: number, callback) {
    const request = {
      target_can_id: canfdID,
    };

    this.getMoteusMotorStateService.callService(request, callback);
  }

  getRMDx8MotorState(can2ID: number) {}
}
