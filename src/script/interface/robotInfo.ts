import ROSLIB from 'roslib';

class RobotInfo{

    myROS = null;
    getMoteusMotorStateService = null;

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

    getMoteusMotorState(canfdID : Number, callback){
        //console.log("I AM REQUSTING MOTEUS STUFF")
        var request = {
            target_can_id: canfdID
        }



        
        this.getMoteusMotorStateService.callService(request, callback)
    }

    getRMDx8MotorState(can2ID : Number){

    }
}

export {RobotInfo}