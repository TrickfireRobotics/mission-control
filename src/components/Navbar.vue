<script lang="ts" setup>
import ROSLIB, { Ros } from 'roslib';
import { inject, onMounted, ref } from 'vue';
//guarantee ros is defined
// use this instead want to handle case where ros is undefined
// const ros = inject<Ros>('ros')
const webSocketStatus = inject<boolean>('isWebSocketConnected', false);

//TODO FIX CODE
const latency = ref(-1);
// const latency_listener = new ROSLIB.Topic({
//   ros,
//   name: '/latency',
//   messageType: 'std_msgs/String'
// })
// onMounted(() => {
//   console.log('Created')
//   // Create ros object to communicate over your Rosbridge connection
//   const ros = new ROSLIB.Ros({ url: 'ws://localhost:9090' })
//   // When the Rosbridge server connects, fill the span with id “status" with “successful"
//   ros.on('connection', () => {
//     console.log(this)
//     webSocketStatus.value = true
//     // document.getElementById('status').innerHTML = 'successful'
//     // @ts-ignore
//     ros.on('error', (error) => {
//       webSocketStatus.value = false
//       console.log(error)
//       // document.getElementById('status').innerHTML = `errored out (${error})`
//     })

//     // When the Rosbridge server shuts down, fill the “status" span with “closed"
//     ros.on('close', () => {
//       webSocketStatus.value = false
//       // document.getElementById('status').innerHTML = 'closed'
//     })
//   })
//   //listens to mission_control
//   // @ts-ignore
//   const latency_listener = new ROSLIB.Topic({
//     ros,
//     name: '/latency',
//     messageType: 'std_msgs/String'
//   })
//   // When we receive a message on /my_topic, add its data as a list item to the “messages" ul
//   // @ts-ignore
//   latency_listener.subscribe((message) => {
//     let currTime = Date.now()
//     let start = message.data.indexOf('=')
//     let end = message.data.indexOf(',')
//     let rosTime = message.data.substring(start + 1, end)
//     let decimalPlaces = 1
//     rosTime = rosTime.substring(0, currTime.toString().length)
//     latency.value = currTime - rosTime
//   })
// })

// When the Rosbridge server experiences an error, fill the “status" span with the returned error
</script>
<template>
  <nav>
    <img id="logo" src="../assets/trickfire_logo_transparent.png" alt="Trickfire logo" />
    <h1>Mission Control</h1>
    <div class="container">
      <h4 id="status">WebSocket</h4>
      <div class="circle" :class="{ green: webSocketStatus, red: !webSocketStatus }"></div>
    </div>
    <div class="container">
      <h4 id="status">Robot Interface</h4>
      <div class="circle" :class="{ green: webSocketStatus, red: !webSocketStatus }"></div>
    </div>
    <div class="container">
      <h4 id="status">Camera Feed</h4>
      <div class="circle" :class="{ green: webSocketStatus, red: !webSocketStatus }"></div>
    </div>
    <div class="container">
      <h4>Ping</h4>
      <p>{{ `${latency}ms` }}</p>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  padding: 0rem 1rem;
  grid-area: nav;
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  background-color: #dfdfdf;
  height: 4rem;
  #logo {
    max-width: 100%;
    max-height: 100%;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .circle {
    border-radius: 50%;
    background-color: inherit;
    // border-radius: 50%;
    height: 18px;
    width: 20px;
    border: 2px black solid;
    border-radius: 50%;
  }
  .red {
    background-color: red;
  }
  .green {
    background-color: lime;
  }
}
</style>
