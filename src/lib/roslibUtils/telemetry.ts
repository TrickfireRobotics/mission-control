import { useSubscriber } from '@/lib/roslibUtils/createSubscriber';

export interface MoteusMotorState {
  /**
   * The CAN ID of the motor.
   */
  can_id: number;

  /**
   * Current position of the motor in revolutions.
   */
  position?: number | null;

  /**
   * Current velocity of the motor in revolutions per second.
   */
  velocity?: number | null;

  /**
   * Current torque of the motor in newton meters.
   */
  torque?: number | null;

  /**
   * Current temperature of the controller in celcius.
   */
  temperature?: number | null;

  /**
   * Current power draw of the controller in watts.
   */
  power?: number | null;

  /**
   * Current voltage of the controller in volts.
   */
  input_voltage?: number | null;

  /**
   * Current q phase measured in amps.
   */
  q_current?: number | null;

  /**
   * Current d phase measured in amps.
   */
  d_current?: number | null;
}

/**
 * Retrieves telemetry data from the rover.
 * This will initially be an empty array.
 * @returns start.updated - is a function that's when data is received.
 */
export function useTelemetry(): {
  start: (updated: (data: MoteusMotorState[]) => void) => void;
  stop: () => void;
} {
  const missionControlUpdaterData = useSubscriber({
    topicName: 'mission_control_updater',
    topicType: 'std_msgs/String',
  });

  return {
    start: (updated) => {
      missionControlUpdaterData.start({
        callback: (result) => {
          if (!result?.data) return null;

          const parsedData = JSON.parse(result.data);
          if (
            !parsedData?.moteusMotors ||
            typeof parsedData.moteusMotors !== 'object' ||
            !Array.isArray(parsedData.moteusMotors)
          ) {
            return null;
          }

          updated(parsedData.moteusMotors);
        },
      });
    },
    stop: () => {
      missionControlUpdaterData.stop();
    },
  };
}
