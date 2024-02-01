import ROSLIB from 'roslib';

export type MotorData = {
  velocity: Number;
  id: Number;
};
export type RosMessage<T> = {
  (data: T): void;
};
