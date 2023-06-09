<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
// import type { Ref } from 'vue'
import type { MotorData } from '../types'
import MotorInfo from './MotorInfo.vue'

const motorDataList = ref<MotorData[]>()

onMounted(() => {
  let tempMotorsData: Array<MotorData> = []
  for (let i = 1; i <= 6; i++) {
    tempMotorsData.push({ velocity: i, id: i })
  }
  motorDataList.value = tempMotorsData
})
</script>
<template>
  <ul>
    <MotorInfo
      v-for="(motorData, index) in motorDataList"
      :motorData="motorData"
      key="data.id"
    ></MotorInfo>
    <!-- <MotorInfo /> -->
  </ul>
</template>

<style lang="scss" scoped>
ul {
  grid-area: motor-grid;
  display: flex;
  // align-items: center;
  border: 2px solid black;
}
</style>
