/**
 * Central motor configuration - the single source of truth for every motor on the rover.
 *
 * To add, remove, or change motors (IDs, names, controller model) edit this file only.
 * Everything else (telemetry, arm model, velocity display, …) derives its data from here.
 */

/** Controller model for the drivetrain motors. */
export const DRIVE_CONTROLLER = 'RMDx8';

/** Controller model for the arm motors. */
export const ARM_CONTROLLER_DEFAULT = 'Moteus r4.11';
export const ARM_CONTROLLER_SHOULDER = 'Moteus n1';
export type MotorGroup = 'drivetrain' | 'arm';

export interface MotorConfig {
    /** Human-readable label shown in the UI. */
    displayName: string;
    /** CAN FD bus ID used to address this motor. */
    canfdID: number;
    /** Controller model string shown as a badge in the UI. */
    controller: string;
    /** Functional group this motor belongs to. */
    group: MotorGroup;
}

// ---------------------------------------------------------------------------
// Motor list - edit here when the rover hardware changes
// ---------------------------------------------------------------------------

export const motorConfigs: MotorConfig[] = [
    // Drivetrain — RMDx8 -------------------------------------------------------
    {
        displayName: 'Back Left Drive',
        canfdID: 26,
        controller: DRIVE_CONTROLLER,
        group: 'drivetrain',
    },
    {
        displayName: 'Back Right Drive',
        canfdID: 25,
        controller: DRIVE_CONTROLLER,
        group: 'drivetrain',
    },
    {
        displayName: 'Middle Left Drive',
        canfdID: 24,
        controller: DRIVE_CONTROLLER,
        group: 'drivetrain',
    },
    {
        displayName: 'Middle Right Drive',
        canfdID: 23,
        controller: DRIVE_CONTROLLER,
        group: 'drivetrain',
    },
    {
        displayName: 'Front Left Drive',
        canfdID: 22,
        controller: DRIVE_CONTROLLER,
        group: 'drivetrain',
    },
    {
        displayName: 'Front Right Drive',
        canfdID: 21,
        controller: DRIVE_CONTROLLER,
        group: 'drivetrain',
    },

    // Arm — Moteus -------------------------------------------------------------
    { displayName: 'Arm Shoulder', canfdID: 1, controller: ARM_CONTROLLER_SHOULDER, group: 'arm' },
    { displayName: 'Arm Elbow', canfdID: 2, controller: ARM_CONTROLLER_DEFAULT, group: 'arm' },
    { displayName: 'Arm Left Wrist', canfdID: 3, controller: ARM_CONTROLLER_DEFAULT, group: 'arm' },
    {
        displayName: 'Arm Right Wrist',
        canfdID: 4,
        controller: ARM_CONTROLLER_DEFAULT,
        group: 'arm',
    },
    { displayName: 'Arm Turntable', canfdID: 5, controller: ARM_CONTROLLER_DEFAULT, group: 'arm' },
];

export const drivetrainMotors = motorConfigs.filter((m) => m.group === 'drivetrain');
export const armMotors = motorConfigs.filter((m) => m.group === 'arm');

// ---------------------------------------------------------------------------
// CAN bus ID enum
// ---------------------------------------------------------------------------

/**
 * Type-safe enumeration of every motor's CAN ID.
 * Used in telemetry subscriptions, arm model, velocity display, etc.
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

// ---------------------------------------------------------------------------
// CAN ID → camelCase name map
// ---------------------------------------------------------------------------

export const canBusNameMap = {
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
