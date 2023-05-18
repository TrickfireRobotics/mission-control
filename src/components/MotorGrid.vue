<script lang="ts">
// import { defineComponent } from 'vue'
import type { MotorData } from '../types'
import MotorInfo from './MotorInfo.vue'

export default {
  components: {
    MotorInfo
  },
  data() {
    return {
      motorDataList: [{}]
    }
  },
  computed: {
    addMotor() {
      this.motorDataList.push()
    }
  },
  mounted() {
    let tempMotorsData: Array<MotorData> = []
    for (let i = 0; i < 6; i++) {
      tempMotorsData.push({ velocity: i, id: i })
      this.motorDataList = tempMotorsData
    }
  }
}
</script>
<template>
  <div>
    <h1>Test</h1>
    <MotorInfo v-for="motorData in motorDataList"></MotorInfo>
    <!-- <MotorInfo /> -->
  </div>
</template>

<style scoped>
div {
  /* Styles!!! */
  /* display: grid;
  align-items: center;
  border: 5px solid black; */
}
</style>
