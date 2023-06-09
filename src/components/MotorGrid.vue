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
  <div>
    <h2>Motors</h2>
    <ul>
      <MotorInfo
        v-for="(motorData, index) in motorDataList"
        :motorData="motorData"
        key="data.id"
      ></MotorInfo>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
div {
  background-color: #dfdfdf;
  ul {
    padding: 0.5rem;
    // grid-area: motor-grid;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    // align-items: center;
  }
}
</style>
