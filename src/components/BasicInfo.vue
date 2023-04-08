<script>
import ROSLIB from '../.././package/roslib.js'
console.log('hello')
// Create ros object to communicate over your Rosbridge connection
const ros = new ROSLIB.Ros({ url: 'ws://localhost:9090' })

// When the Rosbridge server connects, fill the span with id “status" with “successful"
ros.on('connection', () => {
  document.getElementById('status').innerHTML = 'successful'
})

// When the Rosbridge server experiences an error, fill the “status" span with the returned error
ros.on('error', (error) => {
  document.getElementById('status').innerHTML = `errored out (${error})`
})

// When the Rosbridge server shuts down, fill the “status" span with “closed"
ros.on('close', () => {
  document.getElementById('status').innerHTML = 'closed'
})
</script>
<template>
  <div id="status">Didn't work</div>
</template>
