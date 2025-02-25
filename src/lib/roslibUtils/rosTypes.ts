// Types from https://docs.ros2.org/galactic/api/std_msgs/index-msg.html
// TODO: Separate std_msgs and custom messages due to non std_msgs may have more values than just .data that is used in MessageWrapper

// Feel free to add to TopicTypeMap.
// Most messages will use StdMsg.
export type TopicTypeMap = {
  'std_msgs/Int32': StdMsg<number>;
  'std_msgs/Bool': StdMsg<boolean>;
  'std_msgs/String': StdMsg<string>;
  'std_msgs/Char': StdMsg<string>;
  'std_msgs/Float32': StdMsg<number>;
  'std_msgs/Time': StdMsg<number>;
  'sensor_msgs/msg/CompressedImage': CompressedImage;
};

export type TopicType = keyof TopicTypeMap;

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
  data: Uint8Array;
};

//https://docs.ros.org/en/noetic/api/sensor_msgs/html/msg/NavSatFix.html
export type NavSatFix = {
  header: {
    stamp: {
      sec: number;
      nanosec: number;
    },
    frame_id: string,
  },
  status: {
    status: number;
    service: number;
  }
  latitude: 47.7918611;
  longitude: -122.1755833;
  altitude: 106.607;
  position_covariance: number[];
  position_covariance_type: number;
}