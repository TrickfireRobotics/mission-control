import { useSubscriber } from '@/lib/roslibUtils/createSubscriber';
import { ref, type Ref } from 'vue';

// Re-export from the single motor config source so existing imports
// (ArmModel, RoverVelocityDisplay, …) continue to work unchanged.
export { CanBusID, canBusNameMap } from '@/lib/motorConfig';
import { type CanBusID, canBusNameMap } from '@/lib/motorConfig';

// ---------------------------------------------------------------------------
// Motor state interface
// ---------------------------------------------------------------------------

export interface MoteusMotorState {
  /** The CAN ID of the motor. */
  can_id: number;

  /** Current position of the motor in revolutions. */
  position?: number | null;

  /** Current velocity of the motor in revolutions per second. */
  velocity?: number | null;

  /** Current torque of the motor in newton meters. */
  torque?: number | null;

  /** Current temperature of the controller in celsius. */
  temperature?: number | null;

  /** Current power draw of the controller in watts. */
  power?: number | null;

  /** Current voltage of the controller in volts. */
  input_voltage?: number | null;

  /** Current q phase measured in amps. */
  q_current?: number | null;

  /** Current d phase measured in amps. */
  d_current?: number | null;
}

// ---------------------------------------------------------------------------
// Internal types derived from the re-exported map
// ---------------------------------------------------------------------------

type CanBusNameMap = typeof canBusNameMap;

// ---------------------------------------------------------------------------
// useTelemetryData
// ---------------------------------------------------------------------------

/**
 * Retrieves data about certain motors from the rover.
 * This is a high-level API.
 * @param canIDs - list of CAN IDs to read from the rover.
 * @param extractor - function that extracts the desired value from `MoteusMotorState`.
 * @param defaultValue - default value when no data is available.
 * @param onUpdate - optional map of callbacks fired when new non-null data arrives.
 */
export function useTelemetryData<OutT, CanMap extends (keyof CanBusNameMap)[]>(
  canIDs: CanMap,
  extractor: (data: MoteusMotorState) => OutT,
  defaultValue: OutT,
  onUpdate?: Partial<Record<CanBusNameMap[CanMap[number]], (data: NonNullable<OutT>) => void>>,
): Record<CanBusNameMap[CanMap[number]], Ref<OutT>> {
  // Clone so external mutations don't cause subtle bugs.
  const clonedIDs = [...canIDs];

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

// ---------------------------------------------------------------------------
// useTelemetry
// ---------------------------------------------------------------------------

/**
 * Low-level hook that subscribes to the `mission_control_updater` ROS topic
 * and calls `updated` with the parsed motor array each time data arrives.
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
