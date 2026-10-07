<script setup lang="ts">
import GenericMotorTelemetry from '@/components/telemetry/moteus/GenericMotorTelemetry.vue';
import DriveMotorCard from '@/components/telemetry/drive/DriveMotorCard.vue';
import { ref, computed, watch, onMounted, useTemplateRef } from 'vue';
import { RobotInfo } from '@/lib/interface/robotInfo';
import { useRoslibStore } from '@/store/roslibStore';
import { drivetrainMotors, armMotors } from '@/lib/motorConfig';

const updateTimeMs = ref(100);
const recordingAll = ref(false);
const isFinishedLoading = ref(false);

const myChild = useTemplateRef<(typeof GenericMotorTelemetry)[]>('myChild');

let robotInfo: RobotInfo;
const roslib = useRoslibStore();

onMounted(() => {
    robotInfo = new RobotInfo(roslib.ros);
    isFinishedLoading.value = true;
});

watch(updateTimeMs, (newValue) => {
    updateTimeMs.value = newValue < 4 ? 4 : newValue;
});

function recordAllPressed() {
    if (myChild.value === null) return;
    for (const child of myChild.value) {
        child.recordButtonPressed();
    }
    recordingAll.value = !recordingAll.value;
}

function getMotorStateProxy(
    param: number,
    dataCallback: (result: { json_payload: string }) => void,
) {
    return robotInfo.getMoteusMotorState(param, dataCallback);
}

const POSITION_ORDER = ['Front', 'Middle', 'Back'] as const;

function positionRank(name: string): number {
    return POSITION_ORDER.findIndex((p) => name.includes(p));
}

const leftMotors = computed(() =>
    drivetrainMotors
        .filter((m) => m.displayName.includes('Left'))
        .sort((a, b) => positionRank(a.displayName) - positionRank(b.displayName)),
);

const rightMotors = computed(() =>
    drivetrainMotors
        .filter((m) => m.displayName.includes('Right'))
        .sort((a, b) => positionRank(a.displayName) - positionRank(b.displayName)),
);

const wheelTemps = ref<Record<number, number>>({});

function onTempUpdate(canId: number, temp: number) {
    wheelTemps.value[canId] = temp;
}

function motorCanId(position: string, side: string): number {
    return (
        drivetrainMotors.find(
            (m) => m.displayName.includes(position) && m.displayName.includes(side),
        )?.canfdID ?? 0
    );
}

function wheelFill(canId: number): string {
    const t = wheelTemps.value[canId];
    if (t == null) return '#2c2c2c';
    if (t > 80) return 'rgba(239,68,68,0.30)';
    if (t > 60) return 'rgba(245,158,11,0.22)';
    return 'rgba(0,254,0,0.10)';
}

function wheelStroke(canId: number): string {
    const t = wheelTemps.value[canId];
    if (t == null) return '#3a3a3a';
    if (t > 80) return '#ef4444';
    if (t > 60) return '#f59e0b';
    return 'rgba(0,254,0,0.45)';
}

const schematicIds = {
    FL: motorCanId('Front', 'Left'),
    FR: motorCanId('Front', 'Right'),
    ML: motorCanId('Middle', 'Left'),
    MR: motorCanId('Middle', 'Right'),
    BL: motorCanId('Back', 'Left'),
    BR: motorCanId('Back', 'Right'),
};
</script>

<template>
    <div class="telemetry-page">
        <!-- ── Top control bar ── -->
        <header class="telemetry-header">
            <h2 class="telemetry-title">Telemetry</h2>

            <div class="telemetry-controls">
                <label class="control-group">
                    <span class="control-label">Poll Interval</span>
                    <div class="control-input-wrap">
                        <input
                            v-model="updateTimeMs"
                            class="poll-input"
                            min="4"
                            type="number"
                            title="Milliseconds between each poll. Also affects recording."
                        />
                        <span class="control-unit">ms</span>
                    </div>
                </label>

                <button
                    :class="{
                        'button-toggle--on': !recordingAll,
                        'button-toggle--off': recordingAll,
                    }"
                    @click="recordAllPressed()"
                >
                    {{ recordingAll ? 'Stop All' : 'Record All' }}
                </button>
            </div>
        </header>

        <div v-if="isFinishedLoading" class="telemetry-body">
            <section class="motor-group drivetrain-group">
                <div class="group-header">
                    <span class="group-label">Drivetrain</span>
                    <span class="group-count">{{ drivetrainMotors.length }} motors · RMDx8</span>
                </div>

                <div class="drivetrain-layout">
                    <!-- Left column: FL → ML → BL -->
                    <div class="drive-col">
                        <DriveMotorCard
                            v-for="m in leftMotors"
                            :key="m.canfdID"
                            :display-name="m.displayName"
                            :data-source-parameter="m.canfdID"
                            :motor-type="m.controller"
                            :update-ms="updateTimeMs"
                            @temp-update="onTempUpdate"
                        />
                    </div>

                    <!-- Centre: rover schematic -->
                    <div class="schematic-wrapper">
                        <!-- SVG top-down rover outline
                 viewBox: 170 × 280
                 Body: x=50  y=22  w=70  h=236  rx=8
                 Left  wheels (x=8,  w=40, rx=5): FL y=30, ML y=109, BL y=188 each h=62
                 Right wheels (x=122, w=40, rx=5): FR y=30, MR y=109, BR y=188 each h=62
            -->
                        <svg
                            class="rover-svg"
                            viewBox="0 0 170 280"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-label="Rover top-down schematic"
                        >
                            <!-- ── Defs ── -->
                            <defs>
                                <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stop-color="#232323" />
                                    <stop offset="50%" stop-color="#2a2a2a" />
                                    <stop offset="100%" stop-color="#232323" />
                                </linearGradient>
                            </defs>

                            <!-- ── Axle lines ── -->
                            <line
                                x1="48"
                                y1="61"
                                x2="122"
                                y2="61"
                                stroke="#3a3a3a"
                                stroke-width="3"
                                stroke-linecap="round"
                            />
                            <line
                                x1="48"
                                y1="140"
                                x2="122"
                                y2="140"
                                stroke="#3a3a3a"
                                stroke-width="3"
                                stroke-linecap="round"
                            />
                            <line
                                x1="48"
                                y1="219"
                                x2="122"
                                y2="219"
                                stroke="#3a3a3a"
                                stroke-width="3"
                                stroke-linecap="round"
                            />

                            <!-- ── Rover body ── -->
                            <rect
                                x="50"
                                y="22"
                                width="70"
                                height="236"
                                rx="8"
                                fill="url(#bodyGrad)"
                                stroke="#4a4a4a"
                                stroke-width="1.5"
                            />

                            <!-- Body centre-line (dashed) -->
                            <line
                                x1="85"
                                y1="30"
                                x2="85"
                                y2="250"
                                stroke="#3a3a3a"
                                stroke-width="1"
                                stroke-dasharray="4 4"
                            />

                            <!-- Body internal detail box -->
                            <rect
                                x="58"
                                y="90"
                                width="54"
                                height="100"
                                rx="4"
                                fill="none"
                                stroke="#3a3a3a"
                                stroke-width="1"
                                stroke-dasharray="3 3"
                            />

                            <!-- "ROVER" label inside body -->
                            <text
                                x="85"
                                y="147"
                                text-anchor="middle"
                                fill="#3a3a3a"
                                font-family="'Barlow Condensed', sans-serif"
                                font-size="9"
                                font-weight="700"
                                letter-spacing="3"
                                text-transform="uppercase"
                            >
                                ROVER
                            </text>

                            <!-- ── Left wheels ── -->
                            <!-- FL -->
                            <rect
                                x="8"
                                y="30"
                                width="40"
                                height="62"
                                rx="5"
                                :style="{
                                    fill: wheelFill(schematicIds.FL),
                                    stroke: wheelStroke(schematicIds.FL),
                                }"
                                stroke-width="1.5"
                            />
                            <text
                                x="28"
                                y="58"
                                text-anchor="middle"
                                fill="#888"
                                font-family="'Barlow Condensed', sans-serif"
                                font-size="9"
                                font-weight="700"
                                letter-spacing="1"
                            >
                                FL
                            </text>
                            <text
                                x="28"
                                y="70"
                                text-anchor="middle"
                                :fill="wheelStroke(schematicIds.FL)"
                                font-family="'Barlow Condensed', sans-serif"
                                font-size="7.5"
                                letter-spacing="0.5"
                            >
                                {{
                                    wheelTemps[schematicIds.FL] != null
                                        ? `${wheelTemps[schematicIds.FL]?.toFixed(0)}°`
                                        : '—'
                                }}
                            </text>

                            <!-- ML -->
                            <rect
                                x="8"
                                y="109"
                                width="40"
                                height="62"
                                rx="5"
                                :style="{
                                    fill: wheelFill(schematicIds.ML),
                                    stroke: wheelStroke(schematicIds.ML),
                                }"
                                stroke-width="1.5"
                            />
                            <text
                                x="28"
                                y="137"
                                text-anchor="middle"
                                fill="#888"
                                font-family="'Barlow Condensed', sans-serif"
                                font-size="9"
                                font-weight="700"
                                letter-spacing="1"
                            >
                                ML
                            </text>
                            <text
                                x="28"
                                y="149"
                                text-anchor="middle"
                                :fill="wheelStroke(schematicIds.ML)"
                                font-family="'Barlow Condensed', sans-serif"
                                font-size="7.5"
                                letter-spacing="0.5"
                            >
                                {{
                                    wheelTemps[schematicIds.ML] != null
                                        ? `${wheelTemps[schematicIds.ML]?.toFixed(0)}°`
                                        : '—'
                                }}
                            </text>

                            <!-- BL -->
                            <rect
                                x="8"
                                y="188"
                                width="40"
                                height="62"
                                rx="5"
                                :style="{
                                    fill: wheelFill(schematicIds.BL),
                                    stroke: wheelStroke(schematicIds.BL),
                                }"
                                stroke-width="1.5"
                            />
                            <text
                                x="28"
                                y="216"
                                text-anchor="middle"
                                fill="#888"
                                font-family="'Barlow Condensed', sans-serif"
                                font-size="9"
                                font-weight="700"
                                letter-spacing="1"
                            >
                                BL
                            </text>
                            <text
                                x="28"
                                y="228"
                                text-anchor="middle"
                                :fill="wheelStroke(schematicIds.BL)"
                                font-family="'Barlow Condensed', sans-serif"
                                font-size="7.5"
                                letter-spacing="0.5"
                            >
                                {{
                                    wheelTemps[schematicIds.BL] != null
                                        ? `${wheelTemps[schematicIds.BL]?.toFixed(0)}°`
                                        : '—'
                                }}
                            </text>

                            <!-- FR -->
                            <rect
                                x="122"
                                y="30"
                                width="40"
                                height="62"
                                rx="5"
                                :style="{
                                    fill: wheelFill(schematicIds.FR),
                                    stroke: wheelStroke(schematicIds.FR),
                                }"
                                stroke-width="1.5"
                            />
                            <text
                                x="142"
                                y="58"
                                text-anchor="middle"
                                fill="#888"
                                font-family="'Barlow Condensed', sans-serif"
                                font-size="9"
                                font-weight="700"
                                letter-spacing="1"
                            >
                                FR
                            </text>
                            <text
                                x="142"
                                y="70"
                                text-anchor="middle"
                                :fill="wheelStroke(schematicIds.FR)"
                                font-family="'Barlow Condensed', sans-serif"
                                font-size="7.5"
                                letter-spacing="0.5"
                            >
                                {{
                                    wheelTemps[schematicIds.FR] != null
                                        ? `${wheelTemps[schematicIds.FR]?.toFixed(0)}°`
                                        : '—'
                                }}
                            </text>

                            <!-- MR -->
                            <rect
                                x="122"
                                y="109"
                                width="40"
                                height="62"
                                rx="5"
                                :style="{
                                    fill: wheelFill(schematicIds.MR),
                                    stroke: wheelStroke(schematicIds.MR),
                                }"
                                stroke-width="1.5"
                            />
                            <text
                                x="142"
                                y="137"
                                text-anchor="middle"
                                fill="#888"
                                font-family="'Barlow Condensed', sans-serif"
                                font-size="9"
                                font-weight="700"
                                letter-spacing="1"
                            >
                                MR
                            </text>
                            <text
                                x="142"
                                y="149"
                                text-anchor="middle"
                                :fill="wheelStroke(schematicIds.MR)"
                                font-family="'Barlow Condensed', sans-serif"
                                font-size="7.5"
                                letter-spacing="0.5"
                            >
                                {{
                                    wheelTemps[schematicIds.MR] != null
                                        ? `${wheelTemps[schematicIds.MR]?.toFixed(0)}°`
                                        : '—'
                                }}
                            </text>

                            <!-- BR -->
                            <rect
                                x="122"
                                y="188"
                                width="40"
                                height="62"
                                rx="5"
                                :style="{
                                    fill: wheelFill(schematicIds.BR),
                                    stroke: wheelStroke(schematicIds.BR),
                                }"
                                stroke-width="1.5"
                            />
                            <text
                                x="142"
                                y="216"
                                text-anchor="middle"
                                fill="#888"
                                font-family="'Barlow Condensed', sans-serif"
                                font-size="9"
                                font-weight="700"
                                letter-spacing="1"
                            >
                                BR
                            </text>
                            <text
                                x="142"
                                y="228"
                                text-anchor="middle"
                                :fill="wheelStroke(schematicIds.BR)"
                                font-family="'Barlow Condensed', sans-serif"
                                font-size="7.5"
                                letter-spacing="0.5"
                            >
                                {{
                                    wheelTemps[schematicIds.BR] != null
                                        ? `${wheelTemps[schematicIds.BR]?.toFixed(0)}°`
                                        : '—'
                                }}
                            </text>

                            <!-- FWD arrow at top (above body, which starts at y=22) -->
                            <polygon points="85,3 79,13 91,13" fill="rgba(0,254,0,0.6)" />
                            <text
                                x="85"
                                y="20"
                                text-anchor="middle"
                                fill="rgba(0,254,0,0.55)"
                                font-family="'Barlow Condensed', sans-serif"
                                font-size="6"
                                font-weight="700"
                                letter-spacing="1.5"
                            >
                                FWD
                            </text>
                            <!-- BACK label at bottom -->
                            <text
                                x="85"
                                y="272"
                                text-anchor="middle"
                                fill="#444"
                                font-family="'Barlow Condensed', sans-serif"
                                font-size="7"
                                font-weight="600"
                                letter-spacing="2"
                            >
                                BACK
                            </text>
                        </svg>

                        <!-- Temperature legend -->
                        <div class="schematic-legend">
                            <span class="legend-item legend-item--normal">Normal</span>
                            <span class="legend-item legend-item--warn">&gt;60°C</span>
                            <span class="legend-item legend-item--critical">&gt;80°C</span>
                        </div>
                    </div>

                    <!-- Right column: FR → MR → BR -->
                    <div class="drive-col">
                        <DriveMotorCard
                            v-for="m in rightMotors"
                            :key="m.canfdID"
                            :display-name="m.displayName"
                            :data-source-parameter="m.canfdID"
                            :motor-type="m.controller"
                            :update-ms="updateTimeMs"
                            @temp-update="onTempUpdate"
                        />
                    </div>
                </div>
            </section>

            <section v-if="armMotors.length > 0" class="motor-group">
                <div class="group-header">
                    <span class="group-label">Arm</span>
                    <span class="group-count">{{ armMotors.length }} motors</span>
                </div>
                <div class="motor-grid">
                    <GenericMotorTelemetry
                        v-for="item in armMotors"
                        :key="item.displayName"
                        ref="myChild"
                        :display-name="item.displayName"
                        :show-all-features="true"
                        :update-ms="updateTimeMs"
                        :motor-type="item.controller"
                        :data-source-method="getMotorStateProxy"
                        :data-source-parameter="item.canfdID"
                    />
                </div>
            </section>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.telemetry-page {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: calc(100vh - var(--nav-bar-size));
    overflow: hidden;
    background: var(--app-background);
}

.telemetry-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 1.1rem;
    background: var(--component-background);
    border-bottom: 1px solid var(--light-grey);
    border-top: 2px solid var(--tf-green-mid);
    flex-shrink: 0;
    gap: 1.1rem;
}

.telemetry-title {
    font-size: 0.95rem;
    margin: 0;
    letter-spacing: 0.08em;
}

.telemetry-controls {
    display: flex;
    align-items: center;
    gap: 0.9rem;
}

.control-group {
    display: flex;
    align-items: center;
    gap: 0.65rem;
}

.control-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.72rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(255, 255, 255, 0.46);
    white-space: nowrap;
}

.control-input-wrap {
    display: flex;
    align-items: center;
    gap: 0.35rem;
}

.poll-input {
    width: 72px;
}

.control-unit {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.5);
}

.telemetry-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 0.85rem 0.95rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.95rem;
}

.motor-group {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
}

.drivetrain-group {
    height: 100%;
    flex-shrink: 0;
    min-height: 0;
}

.group-header {
    display: flex;
    align-items: baseline;
    gap: 0.7rem;
    padding-bottom: 0.45rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    flex-shrink: 0;
}

.group-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--tf-green);
}

.group-count {
    font-size: 0.64rem;
    color: rgba(255, 255, 255, 0.42);
    letter-spacing: 0.03em;
}

.drivetrain-layout {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(280px, 0.95fr) minmax(0, 1fr);
    gap: 0.8rem;
    align-items: stretch;
    width: 100%;
}

.drive-col {
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    gap: 0.55rem;
    min-height: 0;
    width: 100%;
}

.schematic-wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: 0.6rem;
    padding: 0.8rem 0;
    background: var(--component-background);
    border: 1px solid var(--light-grey);
    border-top: 2px solid rgba(0, 254, 0, 0.25);
    border-radius: 14px;
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
    min-height: 0;
    overflow: hidden;
}

.rover-svg {
    display: block;
    width: min(78%, 210px);
    aspect-ratio: 170 / 280;
    max-height: 100%;
    margin-inline: auto;
    filter: drop-shadow(0 0 8px rgba(0, 254, 0, 0.1));
}

.schematic-legend {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    align-self: center;
    flex-shrink: 0;
}

.legend-item {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.52rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 0.08rem 0.4rem;
    border-radius: 999px;

    &--normal {
        color: rgba(0, 254, 0, 0.7);
        background: rgba(0, 254, 0, 0.08);
        border: 1px solid rgba(0, 254, 0, 0.2);
    }

    &--warn {
        color: #f59e0b;
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid rgba(245, 158, 11, 0.25);
    }

    &--critical {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.25);
    }
}

.motor-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 0.9rem;
}
</style>
