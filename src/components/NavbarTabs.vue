<script lang="ts" setup>
interface Props {
  icon: Object;
  text: string;
}
const props = defineProps<Props>();
console.log(props.icon);
</script>
<template>
  <div>
    <h3>{{ props.text }}</h3>
    <div class="icon" ref="props.icon"></div>
  </div>
</template>
<style lang="scss" scoped>
div {
  color: var(--white);
  .icon {
    text-align: center;
  }
}
</style>
