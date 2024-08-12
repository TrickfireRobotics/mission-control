import { createApp } from 'vue';
import App from './App.vue';
import Home from './pages/Home.vue';
import Map from './pages/Map.vue';
import Cameras from './pages/Cameras.vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import DevTab from './pages/DevTab.vue';
import Arm from './pages/Arm.vue';
import Science from './pages/Science.vue';
import Telemetry from './pages/Telemetry.vue';
import Settings from './pages/Settings.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/Home', component: Home },
  { path: '/Cameras', component: Cameras },
  { path: '/Arm', component: Arm },
  { path: '/Science', component: Science },
  { path: '/Telemetry', component: Telemetry },
  { path: '/Map', component: Map },
  { path: '/Settings', component: Settings },
  { path: '/Dev-tab', component: DevTab },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

createApp(App).use(router).mount('#app');
