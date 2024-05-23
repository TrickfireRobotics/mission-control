import ROSLIB from 'roslib';

export type MotorData = {
  velocity: Number;
  id: Number;
};

export type CompressedImage = {
  Header: {
    //header is not confirmed on types
    frame_id: string;
    stamp: { sec: number; nanosec: number };
  };
  format: 'jpg' | 'png';
  data: string; //hexadecimal
};
