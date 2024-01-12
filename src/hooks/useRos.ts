import ROSLIB from 'roslib'
import { ref, provide } from 'vue'

// import { Ros2 } from '../types'
// type useRosType = () =>
type Ros2 = ROSLIB.Ros
let isWebSocketConnected = ref<boolean>(true)
export default function useRos(serverHost: string): {
  ros: Ros2
  // isWebSocketConnected: typeof isWebSocketConnected
} {
  provide('isWebSocketConnected', isWebSocketConnected)
  const ros = new ROSLIB.Ros({ url: serverHost })
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
  return { ros }
}
