<script lang="ts">
import { defineComponent } from 'vue'
import { MotorInfo } from '.././types'
// import MotorInfo from './MotorInfo.vue'

export default defineComponent({
  data() {
    return {
      motorsData: [{}]
    }
  },
  computed: {
    // addMotor() {
    //   this.motorsData.push()
    // }
  },
  mounted() {
    let tempMotorsData: Array<MotorInfo> = []
    for (let i = 0; i < 6; i++) {
      tempMotorsData.push({ velocity: i, id: i })
      this.motorsData = tempMotorsData
    }
  }
})
</script>
<template>
  <div>
    <!-- <MotorInfo /> -->
  </div>
</template>

<style scoped></style>
