import { useSubscriber } from '@/lib/roslibUtils/createSubscriber';
import { ref, type Ref } from 'vue';

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
 * Every motor available on the rover.
 */
export enum CanBusID {
  FrontLeftDrive = 25,
  MidLeftDrive = 24,
  BackLeftDrive = 23,
  FrontRightDrive = 22,
  MidRightDrive = 21,
  BackRightDrive = 20,
  ArmShoulder = 1,
  ArmElbow = 2,
  ArmLeftWrist = 3,
  ArmRightWrist = 4,
  ArmTurntable = 5,
}

const canBusNameMap = {
  [CanBusID.FrontLeftDrive]: 'frontLeftDrive',
  [CanBusID.MidLeftDrive]: 'midLeftDrive',
  [CanBusID.BackLeftDrive]: 'backLeftDrive',
  [CanBusID.FrontRightDrive]: 'frontRightDrive',
  [CanBusID.MidRightDrive]: 'midRightDrive',
  [CanBusID.BackRightDrive]: 'backRightDrive',
  [CanBusID.ArmShoulder]: 'armShoulder',
  [CanBusID.ArmElbow]: 'armElbow',
  [CanBusID.ArmLeftWrist]: 'armLeftWrist',
  [CanBusID.ArmRightWrist]: 'armRightWrist',
  [CanBusID.ArmTurntable]: 'armTurntable',
} as const;

type CanBusNameMap = typeof canBusNameMap;

/**
 * Retrieves data about certain motors from the rover.
 * This is a high-level API.
 * @param canIDs - is a list of can IDs to read from the rover.
 * @param extractor - is a function to extract pertinent data from the `MoteusMotorState`.
 * @param defaultValue - is the default value for when no data is available.
 * @param onUpdate - is a map of functions to run when new data comes through.
 *                   These functions are not called when the data is null or undefined.
 */
export function useTelemetryData<OutT, CanMap extends (keyof CanBusNameMap)[]>(
  canIDs: CanMap,
  extractor: (data: MoteusMotorState) => OutT,
  defaultValue: OutT,
  onUpdate?: Partial<Record<CanBusNameMap[CanMap[number]], (data: NonNullable<OutT>) => void>>,
): Record<CanBusNameMap[CanMap[number]], Ref<OutT>> {
  // We'll get strange behavior if the canIDs object
  // is modified, so clone it to make these errors
  // less impactful and easier to debug.
  const clonedIDs = [...canIDs];

  // Create the output map from the input canIDs.
  // The output has the same keys as the input, just
  // different values.
  const output = Object.fromEntries(
    clonedIDs.map((key) => [canBusNameMap[key], ref(defaultValue)]),
  ) as unknown as Record<CanBusNameMap[CanMap[number]], Ref<OutT>>;

  const telemetry = useTelemetry();
  telemetry.start((updated) => {
    for (const canID of clonedIDs) {
      const motorData = updated.find((motor) => motor.can_id === canID);
      if (!motorData) continue;

      const extractedData = extractor(motorData);

      output[canBusNameMap[canID]].value = extractedData;
      if (extractedData) onUpdate?.[canBusNameMap[canID]]?.(extractedData);
    }
  });

  return output;
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
