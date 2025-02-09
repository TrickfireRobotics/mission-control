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
import { useRoslibStore } from '@/store/roslibStore';
import { useControllerStore } from '@/store/controllerStore';
import { useOperationStateStore } from '../store/operationStateStore';
import { onMounted } from 'vue';
import { createSubscriber } from '@/lib/roslibUtils/createSubscriber';

//TODO implement latency

const roslib = useRoslibStore();
const controller = useControllerStore();
const operation = useOperationStateStore();
const currentTab = ref(0);
const setCurrentTab = (newValue: number) => {
  currentTab.value = newValue;
};

const pingSubscriber = createSubscriber({
  topicName: "/ping",
  topicType: "std_msgs/Float32",
  startingDefaultValue: {data: 0.0},
})

onMounted(() => {
  operation.operationState.start();
  pingSubscriber.start();
})

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
    <section id="logo-section">
      <img id="logo" src="../assets/trickfire_logo_transparent.png" alt="Trickfire logo" />
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
      <div id="operation-selector" class="container">
        <button
          id="disable-button"
          title="Disabled"
          :class="{ checked: operation.operationState.msg?.data === 'disabled' }"
          @click="operation.setOperationState({data: 'disabled'})"
        >
          Disable
        </button>
        <button
          id="teleoperation-button"
          title="TeleOperation"
          :class="{ checked: operation.operationState.msg?.data === 'teleoperation' }"
          @click="operation.setOperationState({data: 'teleoperation'})"
        >
          TeleOp
        </button>
        <button
          id="autonomous-button"
          title="Autonomous"
          :class="{ checked: operation.operationState.msg?.data === 'autonomous' }"
          @click="operation.setOperationState({data: 'autonomous'})"
        >
          Auto
        </button>
      </div>
      <div
        class="container"
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
        class="container"
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
        class="container"
        :title="`Controller: ${controller.isGamepadConnected ? `Connected` : `Disconnected`}`"
      >
        <h4 id="status">CTRL</h4>
        <component
          :is="ControllerIcon"
          class="page-icon"
          :class="{ green: controller.isGamepadConnected, red: !controller.isGamepadConnected }"
        />
      </div>
      <div class="container">
        <h4 id="status">Ping</h4>
        <h4>{{ pingSubscriber.msg?.value?.data ? (Math.round(pingSubscriber.msg?.value?.data * 1000)) + 'ms' : "N/A" }}</h4>
      </div>
    </section>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  padding: 0 0 0 1rem;
  grid-area: nav;
  display: flex;
  align-items: center;
  height: var(--nav-bar-size);
  background-color: var(--black);
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
  .current-page {
    background-color: var(--light-grey);
  }
  .navbar-tab {
    padding: 0 0.3rem;
    min-width: 4.5rem;
    .page-icon {
      transform: scale(1.25);
    }
  }
  .navbar-tab:not(.current-page):hover {
    background-color: hsl(0, 0%, 16%);
  }
  .container {
    height: var(--nav-bar-size);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  #logo-section {
    display: flex;
    align-items: center;
    flex-shrink: 0;

    #logo {
      max-width: 100%;
      max-height: 3rem;
    }
    #logo-text {
      margin: 0 1rem;
    }
  }
  #page-section {
    display: flex;
    overflow-x: scroll;
    overflow-y: hidden;
    scrollbar-width: none;
    flex-grow: 1;
    border-right: 1px solid var(--white);
    border-left: 1px solid var(--white);
  }
  #states-section {
    display: flex;
    gap: 1.75rem;
    height: var(--nav-bar-size);
    padding: 0 2rem 0 1.5rem;
    background-color: hsl(240, 20%, 20%);

    #operation-selector {
      margin: auto 0;
      display: flex;
      flex-direction: row;
      padding: 0 0.5rem;
      background-color: hsl(240, 20%, 10%);
      border-radius: 4px;
      height: 80%;
      gap: 0.25rem;

      button {
        height: 80%;
        cursor: pointer;
        align-items: center;
        padding: 0 1rem;
        border-radius: 4px;
        background-color: transparent;
        color: white;

        &.checked {
          background-image: none;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }

        &#disable-button.checked {
          background-color: hsl(0, 100%, 27%);
        }

        &#autonomous-button.checked {
          background-color: hsl(300, 100%, 23%);
        }

        &#teleoperation-button.checked {
          background-color: hsl(120, 100%, 15%);
        }
      }
    }
  }
  .red {
    color: var(--error);
  }
  .green {
    color: var(--correct);
  }
}
</style>
