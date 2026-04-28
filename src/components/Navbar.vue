<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

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

/** Strip ws:// prefix and any path - show just host:port. */
const roverHostDisplay = computed(() =>
  settings.settings.websocketAddress.replace(/^wss?:\/\//, '').replace(/\/.*$/, ''),
);

const setCurrentTab = (newValue: number) => {
  currentTab.value = newValue;
  sessionStorage.setItem('currentTab', newValue.toString());
  router.push(pageIconArr[newValue].label);
};

onMounted(() => {
  operation.operationStateSub.start();
  const savedTab = sessionStorage.getItem('currentTab');
  if (savedTab != null) currentTab.value = parseInt(savedTab, 10);
});

onUnmounted(() => {
  operation.operationStateSub.stop();
});

type PageIcon = { icon: object; label: string; helperText: string }[];

const pageIconArr: PageIcon = [
  {
    icon: HomeIcon,
    label: 'Home',
    helperText: 'Dashboard - cameras, telemetry, operation mode, motor status, battery, and map',
  },
  {
    icon: CameraIcon,
    label: 'Cameras',
    helperText: 'All camera feeds - select which cameras to display',
  },
  {
    icon: MapIcon,
    label: 'Map',
    helperText: 'Interactive map - rover GPS position, target waypoint, and planned path',
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
  { icon: HelpCircleIcon, label: 'Help', helperText: 'Controls layout and keybindings reference' },
  {
    icon: InformationIcon,
    label: 'Telemetry',
    helperText: 'Motor speeds, positions, temperatures - record and export to CSV',
  },
  {
    icon: ControllerIcon,
    label: 'Controller',
    helperText: 'Live gamepad input, axis visualiser, and controller bindings',
  },
  {
    icon: TuneIcon,
    label: 'Settings',
    helperText: 'Rover connection and app configuration',
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
    <!-- Logo / brand -->
    <section id="logo-section">
      <img id="logo" src="../assets/trickfire_logo_transparent.png" alt="TrickFire Robotics" />
      <span id="logo-text">Mission Control</span>
    </section>

    <!-- Page tabs -->
    <section id="page-section">
      <RouterLink
        v-for="(pageIcon, index) in pageIconArr"
        :key="index"
        :to="pageIcon.label"
        class="nav-tab"
        :class="{ 'nav-tab--active': currentTab === index }"
        :title="pageIcon.helperText"
        @click="setCurrentTab(index)"
      >
        <component :is="pageIcon.icon" class="nav-tab__icon" />
        <span class="nav-tab__label">{{ pageIcon.label }}</span>
      </RouterLink>
    </section>

    <!-- Right-side status & controls -->
    <section id="states-section">
      <!-- Operation mode -->
      <div id="op-selector">
        <button
          id="btn-disable"
          title="Disable all rover motion"
          :class="{ 'op-btn--active': operation.getOperationState() === 'disabled' }"
          @click="operation.setOperationState({ data: 'disabled' })"
        >
          Disable
        </button>
        <button
          id="btn-teleop"
          title="Enable manual teleoperation via gamepad"
          :class="{ 'op-btn--active': operation.getOperationState() === 'teleoperation' }"
          @click="operation.setOperationState({ data: 'teleoperation' })"
        >
          TeleOp
        </button>
        <button
          id="btn-auto"
          title="Enable autonomous navigation"
          :class="{ 'op-btn--active': operation.getOperationState() === 'autonomous' }"
          @click="operation.setOperationState({ data: 'autonomous' })"
        >
          Auto
        </button>
      </div>

      <div class="status-divider" />

      <!-- Rover ROS bridge -->
      <RouterLink
        to="/Settings"
        class="status-pill"
        :title="`Rover ROS bridge - ${
          roslib.isWebSocketConnected ? 'Connected' : 'Disconnected'
        } (${roverHostDisplay})\nClick to open Settings`"
      >
        <span class="status-pill__label">ROVER</span>
        <component
          :is="roslib.isWebSocketConnected ? PowerPlugIcon : PowerPlugOffIcon"
          class="status-pill__icon"
          :class="roslib.isWebSocketConnected ? 'icon--green' : 'icon--red'"
        />
      </RouterLink>

      <!-- Camera -->
      <div
        class="status-pill"
        :title="`Camera stream - ${roslib.isWebSocketConnected ? 'Connected' : 'Disconnected'}`"
      >
        <span class="status-pill__label">CAM</span>
        <component
          :is="CameraIcon"
          class="status-pill__icon"
          :class="roslib.isWebSocketConnected ? 'icon--green' : 'icon--red'"
        />
      </div>

      <!-- Gamepad -->
      <div
        class="status-pill"
        :title="`Gamepad - ${controller.isGamepadConnected ? 'Connected' : 'Not detected'}`"
      >
        <span class="status-pill__label">CTRL</span>
        <component
          :is="ControllerIcon"
          class="status-pill__icon"
          :class="controller.isGamepadConnected ? 'icon--green' : 'icon--red'"
        />
      </div>

      <!-- Ping -->
      <div class="status-pill" title="Round-trip latency to rover ROS bridge">
        <span class="status-pill__label">PING</span>
        <span
          class="status-pill__ping"
          :class="{ 'text--green': roslib.latency && roslib.latency < 100 }"
        >
          {{ roslib.latency ? Math.round(roslib.latency) + ' ms' : '- ms' }}
        </span>
      </div>
    </section>
  </nav>
</template>

<style lang="scss" scoped>
//  Nav shell
nav {
  display: flex;
  height: var(--nav-bar-size);
  background-color: var(--pure-black);
  overflow: hidden;
}

//  Logo
#logo-section {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 0.85rem;
  padding: 0 1.25rem;
  // Subtle neutral divider - no green border
  border-right: 1px solid rgba(255, 255, 255, 0.1);

  #logo {
    height: 2.4rem;
    width: auto;
  }

  #logo-text {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 600;
    font-size: 1.4rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--white);
    white-space: nowrap;
  }
}

//  Page-tab strip
#page-section {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.55rem;
  padding: 0 0.75rem;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.nav-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // Increase vertical breathing room and keep the icon/label visually centered
  gap: 0.25rem;
  padding: 0.42rem 0.85rem;
  min-width: 4.9rem;
  height: 3rem;
  flex-shrink: 0;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: background-color 0.12s, border-color 0.12s;
  cursor: pointer;

  &__icon {
    display: grid;
    place-items: center;
    color: var(--dark-white);
    opacity: 0.65;
    transition: color 0.12s, opacity 0.12s;

    :deep(svg) {
      // Slightly smaller icon gives label more visual weight
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  &__label {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 600;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    line-height: 1;
    color: var(--dark-white);
    opacity: 0.65;
    white-space: nowrap;
    transition: color 0.12s, opacity 0.12s;
  }

  // Hover - brighter chip
  &:not(.nav-tab--active):hover {
    background-color: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.2);

    .nav-tab__icon,
    .nav-tab__label {
      color: var(--white);
      opacity: 1;
    }
  }

  // Active - solid TF green, black text (highest contrast per style guide)
  &--active {
    background-color: var(--tf-green);
    border-color: var(--tf-green);

    .nav-tab__icon,
    .nav-tab__label {
      color: var(--pure-black);
      opacity: 1;
    }
  }
}

//  Right-side status section
#states-section {
  display: flex;
  align-items: center;
  gap: 0;
  flex-shrink: 0;
  padding: 0 0.75rem;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.status-divider {
  width: 1px;
  height: 60%;
  background-color: var(--light-grey);
  margin: 0 0.5rem;
}

// Operation mode pill-group
#op-selector {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  background-color: #111;
  border: 1px solid var(--light-grey);
  border-radius: 6px;

  button {
    background-color: transparent;
    color: var(--dark-white);
    border-radius: 4px;
    padding: 4px 14px;
    font-size: 0.78rem;
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: background-color 0.1s, color 0.1s;

    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
      color: var(--white);
      cursor: pointer;
    }
  }

  #btn-disable.op-btn--active {
    background-color: hsl(0, 80%, 26%);
    color: #ffaaaa;
  }
  #btn-teleop.op-btn--active {
    background-color: hsl(120, 80%, 16%);
    color: var(--tf-green);
  }
  #btn-auto.op-btn--active {
    background-color: #6b0059;
    color: #f9aaee;
  }
}

// Individual status indicator
.status-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  padding: 0 0.65rem;
  height: 100%;
  text-decoration: none;

  &__label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.55rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--dark-white);
    opacity: 0.6;
  }

  &__icon {
    :deep(svg) {
      width: 1.2rem;
      height: 1.2rem;
    }
  }

  &__sub {
    font-family: 'Overpass', monospace;
    font-size: 0.55rem;
    font-weight: 400;
    letter-spacing: 0;
    max-width: 8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-transform: none;
  }

  &__ping {
    font-family: 'Overpass', monospace;
    font-size: 0.72rem;
    font-weight: 400;
    color: var(--dark-white);
    white-space: nowrap;
    /* occupy same vertical space as icon and avoid width-driven reflow */
    height: 1.2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 3rem;
    text-align: right;
  }
}

//  Colour utilities
.icon--green {
  color: var(--tf-green);
}
.icon--red {
  color: var(--error);
}
.text--green {
  color: var(--tf-green);
}
.text--red {
  color: var(--error);
}
</style>
