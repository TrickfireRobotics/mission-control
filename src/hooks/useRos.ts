import ROSLIB from 'roslib'
import { ref, provide } from 'vue'

import type { Ros } from '../types'
let isWebSocketConnected = ref<boolean>(true)
export default function useRos(serverHost: string): {
  ros: Ros
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
