<script lang="ts" setup>
import { ref } from 'vue';
// Icons are from https://fonts.google.com/ names might be different but rely on vscode intelisense to get the matching name
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
import ControllerIcon from 'vue-material-design-icons/ControllerClassic.vue';
import { useRoslibStore } from '../store/useRoslib';
import { useControllerStore } from '../store/useController';

//TODO implement latency

const roslib = useRoslibStore();
const controller = useControllerStore();
const currentTab = ref(0);
const setCurrentTab = (newValue: number) => {
  currentTab.value = newValue;
};

type PageIcon = { icon: object; label: string; helperText: string }[];

const pageIconArr: PageIcon = [
  {
    icon: HomeIcon,
    label: 'Home',
    helperText:
      'Show a couple of cameras, basic telemetry, auto/teleop button, reconnect canfd bus button, allow basic info about motors (like power consumption?), battery power level, LATER- shows box of the map',
  },
  {
    icon: CameraIcon,
    label: 'Cameras',
    helperText: 'Shows all the cameras, can select which cameras to show ',
  },
  {
    icon: MapIcon,
    label: 'Map',
    helperText: 'Display map where the rover is, the target and line the rover will take',
  },
  {
    icon: RobotIndustrialIcon,
    label: 'Arm',
    helperText:
      '3D model of the arm, camera arms, Any information related to the arm should be here',
  },
  {
    icon: FlaskIcon,
    label: 'Science',
    helperText: 'Anything related to life detection, science stuff should be here',
  },
  {
    icon: HelpCircleIcon,
    label: 'Help',
    helperText: 'Layout of controls',
  },
  {
    icon: InformationIcon,
    label: 'Telemetry',
    helperText:
      'All information about rover like motor speed etc, position, potential record and export to csv',
  },
  {
    icon: TuneIcon,
    label: 'Settings',
    helperText:
      'any configuration like what input device (controller/keyboard) and change controller bindings',
  },
  {
    icon: BugIcon,
    label: 'Dev-Tab',
    helperText: 'Experimental page to test modules',
  },
];
</script>
<template>
  <nav>
    <img id="logo" src="../assets/trickfire_logo_transparent.png" alt="Trickfire logo" />
    <h1 id="logo-text">Mission Control</h1>
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
    <div
      class="container indicator-container"
      :title="`Websocket: ${roslib.isWebSocketConnected ? `Connected` : `Disconnected`}`"
    >
      <h4 id="status">WS</h4>
      <component
        :is="PowerPlugIcon"
        class="page-icon"
        :class="{ green: roslib.isWebSocketConnected, red: !roslib.isWebSocketConnected }"
      />
    </div>
    <div
      class="container indicator-container"
      :title="`Camera: ${roslib.isWebSocketConnected ? `Connected` : `Disconnected`}`"
    >
      <h4 id="status">CAM</h4>
      <component
        :is="CameraIcon"
        class="page-icon"
        :class="{ green: roslib.isWebSocketConnected, red: !roslib.isWebSocketConnected }"
      />
    </div>
    <div
      class="container indicator-container"
      :title="`Controller: ${controller.isGamepadConnected ? `Connected` : `Disconnected`}`"
    >
      <h4 id="status">CTRL</h4>
      <component
        :is="ControllerIcon"
        class="page-icon"
        :class="{ green: controller.isGamepadConnected, red: !controller.isGamepadConnected }"
      />
    </div>
    <div class="container indicator-container">
      <h4 id="status">Ping</h4>
      <h4>{{ roslib.latency + 'ms' }}</h4>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  padding: 0rem 1rem;
  grid-area: nav;
  display: flex;
  align-items: center;
  height: var(--nav-bar-size);
  background-color: var(--black);
  h1,
  h2,
  h3,
  h4,
  p {
    color: var(--white);
    white-space: nowrap;
    overflow: hidden;
  }
  .page-icon {
    transform: scale(1.25);
  }
  .current-page {
    background-color: var(--light-grey);
  }
  .navbar-tab {
    padding: 0 0.3rem;
    min-width: 4rem;
  }
  .navbar-tab:not(.current-page):hover {
    background-color: hsl(0, 0%, 16%);
  }
  #logo {
    max-width: 100%;
    max-height: 4rem;
  }
  #logo-text {
    margin: 0 1rem;
  }
  .container {
    height: var(--nav-bar-size);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .indicator-container {
    min-width: max-content;
    padding: 0 1.5rem;
    background-color: hsl(240, 20%, 20%);
  }
  .red {
    color: var(--error);
  }
  .green {
    color: var(--correct);
  }
}
</style>
