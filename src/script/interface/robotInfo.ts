class RobotInfo{

    myROS = null;
    getMoteusMotorStateService;

    constructor(givenROS){
        this.myROS = givenROS;
        if (this.myROS != null) {
            this.getMoteusMotorStateService = new ROSLIB.Service({
                ros: this.myROS,
                name: "/get_moteus_motor_state",
                serviceType: "MoteusState"
            })
        }   
    }

    getMoteusMotorState(canfdID : Number){
        var request = {
            target_can_id: canfdID
        }
        
        this.getMoteusMotorStateService.callService(request, function (result) {
            return result.json_payload;
        })
    }

    getRMDx8MotorState(can2ID : Number){

    }
}