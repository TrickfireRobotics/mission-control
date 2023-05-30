<script setup lang="ts">
import { defineComponent } from 'vue'
import type { MotorData } from '.././types'
// const props = defineProps<{
//   motorData : MotorData
// }>()
// defineProps<MotorData>()
export default defineComponent({
  props: {
    motorData: MotorData
    }
  },
  data() {
    return {
      // motor
    }
  }
  // props = definedProps<MotorInfo>
})
</script>
<template>
  <div>
    <ul>
      <li>this.motorData</li>
      <!-- <li>props.velocity</li>
      <li>props.id</li>
      <li>props.</li> -->
    </ul>
  </div>
</template>

<style scoped>
/* Styles */
div {
  display: flex;
  gap: 5px;
  align-content: end;
}
</style>
