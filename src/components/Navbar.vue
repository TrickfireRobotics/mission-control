<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// Icons are from https://fonts.google.com/
import MapIcon from 'vue-material-design-icons/Map.vue';
import InformationIcon from 'vue-material-design-icons/Information.vue';
import RobotIndustrialIcon from 'vue-material-design-icons/RobotIndustrial.vue';
import HelpCircleIcon from 'vue-material-design-icons/HelpCircle.vue';
import FlaskIcon from 'vue-material-design-icons/Flask.vue';
import HomeIcon from 'vue-material-design-icons/Home.vue';
import CameraIcon from 'vue-material-design-icons/Camera.vue';
import TuneIcon from 'vue-material-design-icons/Tune.vue';
import BugIcon from 'vue-material-design-icons/Bug.vue';
import PowerPlugIcon from 'vue-material-design-icons/PowerPlug.vue';
import PowerPlugOffIcon from 'vue-material-design-icons/PowerPlugOff.vue';
import ControllerIcon from 'vue-material-design-icons/ControllerClassic.vue';

import { useRoslibStore } from '@/store/roslibStore';
import { useControllerStore } from '@/store/controllerStore';
import { useOperationStateStore } from '../store/operationStateStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useRouter } from 'vue-router';

const roslib = useRoslibStore();
const controller = useControllerStore();
const operation = useOperationStateStore();
const settings = useSettingsStore();
const currentTab = ref(0);
const router = useRouter();

/** Extracts host:port from a WebSocket URL for compact display. */
const roverHostDisplay = computed(() => {
  const addr = settings.settings.websocketAddress;
  return addr.replace(/^wss?:\/\//, '').replace(/\/.*$/, '');
});

const setCurrentTab = (newValue: number) => {
  currentTab.value = newValue;
  sessionStorage.setItem('currentTab', newValue.toString());
  router.push(pageIconArr[newValue].label);
};

onMounted(() => {
  operation.operationStateSub.start();

  const savedTab = sessionStorage.getItem('currentTab');
  if (savedTab != null) {
    currentTab.value = parseInt(savedTab, 10);
  }
});

onUnmounted(() => {
  operation.operationStateSub.stop();
});

type PageIcon = { icon: object; label: string; helperText: string }[];

const pageIconArr: PageIcon = [
  {
    icon: HomeIcon,
    label: 'Home',
    helperText: 'Dashboard — cameras, telemetry, operation mode, motor status, battery, and map',
  },
  {
    icon: CameraIcon,
    label: 'Cameras',
    helperText: 'All camera feeds — select which cameras to display',
  },
  {
    icon: MapIcon,
    label: 'Map',
    helperText: 'Interactive map — rover GPS position, target waypoint, and planned path',
  },
  {
    icon: RobotIndustrialIcon,
    label: 'Arm',
    helperText: '3D arm model, camera arms, and all arm-related controls',
  },
  {
    icon: FlaskIcon,
    label: 'Science',
    helperText: 'Life detection instruments, soil sample analysis, and spectroscopy data',
  },
  {
    icon: HelpCircleIcon,
    label: 'Help',
    helperText: 'Controls layout and keybindings reference',
  },
  {
    icon: InformationIcon,
    label: 'Telemetry',
    helperText: 'Motor speeds, positions, temperatures — record and export to CSV',
  },
  {
    icon: TuneIcon,
    label: 'Settings',
    helperText: 'Rover connection, input device, and controller bindings',
  },
  {
    icon: BugIcon,
    label: 'Dev-Tab',
    helperText: 'Experimental module testing and developer tools',
  },
];
</script>

<template>
  <nav>
    <section id="logo-section">
      <img id="logo" src="../assets/trickfire_logo_transparent.png" alt="TrickFire Robotics logo" />
      <h1 id="logo-text">Mission Control</h1>
    </section>

    <section id="page-section">
      <RouterLink
        v-for="(pageIcon, index) in pageIconArr"
        :key="index"
        :to="pageIcon.label"
        class="container navbar-tab"
        :class="{ 'current-page': currentTab === index }"
        @click="setCurrentTab(index)"
      >
        <h4>{{ pageIcon.label }}</h4>
        <component :is="pageIcon.icon" class="page-icon" :title="pageIcon.helperText" />
      </RouterLink>
    </section>

    <section id="states-section">
      <!-- Operation mode selector -->
      <div id="operation-selector" class="container">
        <button
          id="disable-button"
          title="Disable all rover motion"
          :class="{ checked: operation.getOperationState() === 'disabled' }"
          @click="operation.setOperationState({ data: 'disabled' })"
        >
          Disable
        </button>
        <button
          id="teleoperation-button"
          title="Enable manual teleoperation via gamepad"
          :class="{ checked: operation.getOperationState() === 'teleoperation' }"
          @click="operation.setOperationState({ data: 'teleoperation' })"
        >
          TeleOp
        </button>
        <button
          id="autonomous-button"
          title="Enable autonomous navigation"
          :class="{ checked: operation.getOperationState() === 'autonomous' }"
          @click="operation.setOperationState({ data: 'autonomous' })"
        >
          Auto
        </button>
      </div>

      <!-- Rover ROS bridge connection -->
      <RouterLink
        to="/Settings"
        class="container status-indicator"
        :title="`Rover ROS Bridge — ${roslib.isWebSocketConnected ? 'Connected' : 'Disconnected'} (${roverHostDisplay})\nClick to open Settings`"
      >
        <h4 class="status-label">ROVER</h4>
        <span class="host-badge" :class="{ connected: roslib.isWebSocketConnected }">
          {{ roverHostDisplay }}
        </span>
        <component
          :is="roslib.isWebSocketConnected ? PowerPlugIcon : PowerPlugOffIcon"
          class="page-icon"
          :class="{ green: roslib.isWebSocketConnected, red: !roslib.isWebSocketConnected }"
        />
      </RouterLink>

      <!-- Camera feed connection -->
      <div
        class="container status-indicator"
        :title="`Camera Stream — ${roslib.isWebSocketConnected ? 'Connected' : 'Disconnected'}`"
      >
        <h4 class="status-label">CAM</h4>
        <component
          :is="CameraIcon"
          class="page-icon"
          :class="{ green: roslib.isWebSocketConnected, red: !roslib.isWebSocketConnected }"
        />
      </div>

      <!-- Gamepad / controller -->
      <div
        class="container status-indicator"
        :title="`Gamepad — ${controller.isGamepadConnected ? 'Connected' : 'Not detected'}`"
      >
        <h4 class="status-label">CTRL</h4>
        <component
          :is="ControllerIcon"
          class="page-icon"
          :class="{ green: controller.isGamepadConnected, red: !controller.isGamepadConnected }"
        />
      </div>

      <!-- Round-trip latency -->
      <div
        id="ping_container"
        class="container status-indicator"
        :title="`Round-trip latency to rover ROS bridge`"
      >
        <h4 class="status-label">PING</h4>
        <span class="ping-value" :class="{ 'ping-ok': roslib.latency && roslib.latency < 100 }">
          {{ roslib.latency ? Math.round(roslib.latency) + ' ms' : '— ms' }}
        </span>
      </div>
    </section>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  grid-area: nav;
  display: flex;
  height: var(--nav-bar-size);
  background-color: var(--pure-black);

  h1,
  h2,
  h3,
  h4,
  p,
  select {
    color: var(--white);
    white-space: nowrap;
    overflow: hidden;
  }

  // Active tab: subtle green tint + green bottom border
  .current-page {
    background-color: var(--tf-green-dim);
    border-bottom: 3px solid var(--tf-green);
  }

  .navbar-tab {
    padding: 0 0.5rem;
    min-width: 4.5rem;
    border-bottom: 3px solid transparent;

    .page-icon {
      transform: scale(1.25);
    }
  }

  .navbar-tab:not(.current-page):hover {
    background-color: rgba(255, 255, 255, 0.06);
  }

  .container {
    height: var(--nav-bar-size);
    margin-top: 0.1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  // Status indicators on the right (ROVER, CAM, CTRL, PING)
  .status-indicator {
    gap: 2px;
    padding: 0 0.4rem;

    .status-label {
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      color: var(--dark-white);
      opacity: 0.8;
    }

    .host-badge {
      font-family: 'Overpass', monospace;
      font-size: 0.6rem;
      color: var(--error);
      letter-spacing: 0;
      max-width: 7rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-transform: none;

      &.connected {
        color: var(--tf-green);
      }
    }

    .ping-value {
      font-family: 'Overpass', monospace;
      font-size: 0.75rem;
      color: var(--dark-white);

      &.ping-ok {
        color: var(--tf-green);
      }
    }
  }

  #ping_container {
    min-width: 3.5rem;
  }

  #logo-section {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    background-color: var(--pure-black);
    border-right: 2px solid var(--tf-green);
    padding: 0 1.25rem;
    gap: 1rem;
    height: 100%;

    #logo {
      max-width: 100%;
      max-height: 2.8rem;
    }

    #logo-text {
      font-size: 1.5rem;
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--white);
    }
  }

  #page-section {
    display: flex;
    overflow-x: scroll;
    overflow-y: hidden;
    scrollbar-width: none;
    flex-grow: 1;
  }

  #states-section {
    display: flex;
    gap: 0.5rem;
    height: var(--nav-bar-size);
    padding: 0 1rem;
    background-color: var(--pure-black);
    border-left: 2px solid var(--tf-green);
    align-items: center;

    #operation-selector {
      display: flex;
      flex-direction: row;
      padding: 0 0.4rem;
      background-color: #111111;
      border: 1px solid var(--light-grey);
      border-radius: 4px;
      height: 72%;
      gap: 0.2rem;
      align-items: center;

      button {
        height: 78%;
        cursor: pointer;
        padding: 0 0.85rem;
        border-radius: 4px;
        background-color: transparent;
        color: var(--dark-white);
        font-size: 0.8rem;

        &:hover {
          background-color: rgba(255, 255, 255, 0.08);
          color: var(--white);
        }

        &.checked {
          background-image: none;
          box-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
          color: var(--white);
        }

        &#disable-button.checked {
          background-color: hsl(0, 90%, 28%);
        }

        &#autonomous-button.checked {
          background-color: #8b0075;
        }

        &#teleoperation-button.checked {
          background-color: hsl(120, 90%, 18%);
          color: var(--tf-green);
        }
      }
    }
  }

  .red {
    color: var(--error);
  }

  .green {
    color: var(--tf-green);
  }
}
</style>
