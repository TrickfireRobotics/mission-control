<script lang="ts" setup>
import { inject, onMounted, ref } from 'vue';
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

const webSocketStatus = inject<boolean>('isWebSocketConnected', false);
const controllerConnectedStatus = inject<boolean>('isGamepadConnected', false);
//TODO implement latency
const latency = ref(-1);
const currentTab = ref(0);
const setCurrentTab = (e) => {
  console.log(e);
  currentTab.value = e;
};

type PageIcon = { icon: any; label: string; helperText: string }[];

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
      <component :is="pageIcon.icon" class="page-icon" size="2rem" :title="pageIcon.helperText" />
    </RouterLink>
    <div class="container">
      <h4 id="status">WebSocket</h4>
      <div class="circle" :class="{ green: webSocketStatus, red: !webSocketStatus }"></div>
    </div>
    <div class="container">
      <h4 id="status">Camera Feed</h4>
      <div class="circle" :class="{ green: webSocketStatus, red: !webSocketStatus }"></div>
    </div>
    <div class="container">
      <h4 id="status">Controller Connected</h4>
      <div
        class="circle"
        :class="{ green: controllerConnectedStatus, red: !controllerConnectedStatus }"
      ></div>
    </div>
    <!-- TODO FIX LATER -->
    <!-- <div class="container">
      <h4>Ping</h4>
      <p>{{ `${latency}ms` }}</p>
    </div> -->
  </nav>
</template>

<style lang="scss" scoped>
nav {
  padding: 0rem 1rem;
  grid-area: nav;
  display: flex;
  gap: 5px;
  align-items: center;
  background-color: var(--black);
  // height: 10rem; // height: var(--nav-bar-height);
  h1,
  h2,
  h3,
  h4,
  p {
    color: var(--white);
  }
  .current-page {
    background-color: var(--light-grey);
  }
  .navbar-tab {
    margin: 0;
    padding: 0 0.3rem;
    min-width: 4rem;
  }
  .page-icon {
    // transform: scale(1.2);
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
  .circle {
    border-radius: 50%;
    background-color: inherit;
    // border-radius: 50%;
    height: 22px;
    width: 22px;
    border: 2px black solid;
    border-radius: 50%;
  }
  .red {
    background-color: var(--error);
  }
  .green {
    background-color: var(--correct);
  }
}
</style>
