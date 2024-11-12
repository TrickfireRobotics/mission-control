// Types from https://docs.ros2.org/galactic/api/std_msgs/index-msg.html
// TODO: Separate std_msgs and custom messages due to non std_msgs may have more values than just .data that is used in MessageWrapper

import { Ref } from 'vue';

// Feel free to add to TopicType, but also Add to TopicTypeMap to its corresponding primitive.
export type TopicType =
  | 'std_msgs/Int32'
  | 'std_msgs/Bool'
  | 'std_msgs/String'
  | 'std_msgs/Char'
  | 'std_msgs/Float32'
  | 'std_msgs/Time'
  | 'sensor_msgs/msg/CompressedImage';
export type TopicTypeMap = {
  'std_msgs/Int32': number;
  'std_msgs/Bool': boolean;
  'std_msgs/String': string;
  'std_msgs/Char': string;
  'std_msgs/Float32': number;
  'std_msgs/Time': number;
  'sensor_msgs/msg/CompressedImage': string;
};
export type StdMsg<T> = {
  data: T;
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

// Types are from rosbridge Documentation https://github.com/RobotWebTools/rosbridge_suite/blob/ros2/ROSBRIDGE_PROTOCOL.md
export type RosCompressionType = 'none' | 'png' | 'cbor' | 'cbor-raw';

export type Subscriber<T extends TopicType> = {
  data: Ref<TopicTypeMap[T] | undefined, TopicTypeMap[T] | undefined>;
  start: (options?: {
    callback?: (message: StdMsg<TopicTypeMap[T]>) => void;
    defaultValue?: TopicTypeMap[T];
    isDebugging?: boolean;
  }) => void;
  stop: () => void;
  isOn: Ref<boolean>;
};
export type Publisher<T extends TopicType> = {
  publish: (data: TopicTypeMap[T]) => void;
};
