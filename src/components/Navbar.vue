<script>
export default {
  data() {
    return {
      webSocketStatus: false,
      latency: -1
    }
  },

  method: {
    setWebSocketStatus(status) {
      webSocketStatus = status
    }
  },
  mounted() {
    console.log('Created')
    // Create ros object to communicate over your Rosbridge connection
    const ros = new ROSLIB.Ros({ url: 'ws://localhost:9090' })

    // When the Rosbridge server connects, fill the span with id “status" with “successful"
    ros.on('connection', () => {
      console.log(this)
      this.webSocketStatus = true
      // document.getElementById('status').innerHTML = 'successful'
      ros.on('error', (error) => {
        this.webSocketStatus = false
        console.log(error)
        // document.getElementById('status').innerHTML = `errored out (${error})`
      })

      // When the Rosbridge server shuts down, fill the “status" span with “closed"
      ros.on('close', () => {
        this.webSocketStatus = false
        // document.getElementById('status').innerHTML = 'closed'
      })
    })
    //listens to mission_control
    const latency_listener = new ROSLIB.Topic({
      ros,
      name: '/latency',
      messageType: 'std_msgs/String'
    })
    // When we receive a message on /my_topic, add its data as a list item to the “messages" ul
    latency_listener.subscribe((message) => {
      let currTime = Date.now()
      let start = message.data.indexOf('=')
      let end = message.data.indexOf(',')
      let rosTime = message.data.substring(start + 1, end)
      let decimalPlaces = 1
      rosTime = rosTime.substring(0, currTime.toString().length)
      this.latency = currTime - rosTime
    })
  }
}

// When the Rosbridge server experiences an error, fill the “status" span with the returned error
</script>
<template>
  <nav>
    <div class="container">
      <h4 id="status">WebSocket</h4>
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
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100vw;
  background-color: #dfdfdf;
  height: 4rem;
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .circle {
    border-radius: 50%;
    background-color: inherit;
    // border-radius: 50%;
    height: 15px;
    width: 15px;
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
