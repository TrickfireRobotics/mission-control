<script setup lang="ts">
import { onActivated, onDeactivated, ref } from 'vue';
import CompassArrow from 'vue-material-design-icons/ArrowUp.vue';

const rotation = ref(180);

const rotation_css_val = rotation.value + 'deg';
let rotate_str = rotation.value + 'º ';
if (rotation.value === 0) {
  rotate_str += 'N';
} else if (rotation.value < 90) {
  rotate_str += 'NE';
} else if (rotation.value === 90) {
  rotate_str += 'E';
} else if (rotation.value < 180) {
  rotate_str += 'SE';
} else if (rotation.value === 180) {
  rotate_str += 'S';
} else if (rotation.value < 270) {
  rotate_str += 'SW';
} else if (rotation.value === 270) {
  rotate_str += 'W';
} else {
  rotate_str += 'NW';
}
</script>
<template>
  <div id="compass_container">
    <div id="compass_grid">
      <div class="grid_item"></div>
      <div class="grid_item"><h4>N</h4></div>
      <div class="grid_item"></div>
      <div class="grid_item"><h4>W</h4></div>
      <CompassArrow id="compass_arrow" class="grid_item" />
      <div class="grid_item"><h4>E</h4></div>
      <div class="grid_item"></div>
      <div class="grid_item"><h4>S</h4></div>
      <div class="grid_item"></div>
      <div id="compass_circle"></div>
    </div>
    <h3>{{ rotate_str }}</h3>
  </div>
</template>
<style lang="scss" scoped>
#compass_container {
  background-color: var(--light-grey);
  border-radius: 5%;
  width: 98%;
  height: 98%;
  margin: auto;
  border: solid 4px hsl(0, 0%, 15%);
  display: flex;
  flex-direction: column;
  align-items: center;

  #compass_grid {
    width: 50%;
    aspect-ratio: 1/1;
    margin-top: 5%;
    display: grid;
    grid-template: 1fr 1fr 1fr / 1fr 1fr 1fr;
    align-items: center;
    position: relative;

    .grid_item {
      text-align: center;
      width: 100%;
      height: 100%;
      aspect-ratio: 1/1;
      display: flex;
      align-items: center;
      justify-content: center;

      h4 {
        font-size: 1.5rem;
      }

      &#compass_arrow {
        color: var(--error);
        transform: scale(2.5) rotate(v-bind(rotation_css_val));
      }
    }

    #compass_circle {
      width: 90%;
      height: 90%;
      left: 0;
      right: 0;
      margin: auto;
      border-radius: 50%;
      border: solid hsl(0, 0%, 50%) 5px;
      position: absolute;
    }
  }

  h3 {
    font-size: 2.5rem;
    color: white !important;
  }
}
</style>
