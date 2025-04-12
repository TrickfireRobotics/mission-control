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
import Help from './pages/Help.vue';
import { createPinia } from 'pinia';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/Home', name: 'Home', component: Home },
  { path: '/Cameras', name: 'Cameras', component: Cameras },
  { path: '/Arm', name: 'Arm', component: Arm },
  { path: '/Science', name: 'Science', component: Science },
  { path: '/Help', name: 'Help', component: Help },
  { path: '/Telemetry', name: 'Telemetry', component: Telemetry },
  { path: '/Map', name: 'Map', component: Map },
  { path: '/Settings', name: 'Settings', component: Settings },
  { path: '/Dev-tab', name: 'DevTab', component: DevTab },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

const app = createApp(App);
//Set up Pinia
const pinia = createPinia();
app.use(pinia);

app.use(router).mount('#app');
