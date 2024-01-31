import ROSLIB from 'roslib'
import { ref, provide } from 'vue'

let isWebSocketConnected = ref<boolean>(false)
export default function rosInit(serverHost: string): {
  ros: ROSLIB.Ros
  isWebSocketConnected: typeof isWebSocketConnected
} {
  const ros = new ROSLIB.Ros({ url: serverHost })

  console.count()
  ros.on('connection', () => {
    isWebSocketConnected.value = true
    ros.on('error', (error) => {
      isWebSocketConnected.value = false
      console.log(error)
    })
    ros.on('close', () => {
      isWebSocketConnected.value = false
    })
  })
  return { ros, isWebSocketConnected }
}
