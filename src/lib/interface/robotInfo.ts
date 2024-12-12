import ROSLIB from 'roslib';

export class RobotInfo {
  myROS: ROSLIB.Ros;
  getMoteusMotorStateService: ROSLIB.Service<{ target_can_id: number }, { json_payload: string }>;

  constructor(givenROS: ROSLIB.Ros) {
    this.myROS = givenROS;

    this.getMoteusMotorStateService = new ROSLIB.Service({
      ros: this.myROS,
      name: '/get_moteus_motor_state',
      serviceType: 'MoteusState',
    });
  }

  getMoteusMotorState(canfdID: number, callback: (result: { json_payload: string }) => void) {
    const request = {
      target_can_id: canfdID,
    };

    this.getMoteusMotorStateService.callService(request, callback);
  }

  // TODO: getRMDx8MotorState
  // getRMDx8MotorState(can2ID: number) {
  // }
}
