<script lang="ts" setup>
export interface DropDownItemProps {
  itemName: string;
  isSelected: boolean;
}
const props = defineProps<DropDownItemProps>();
</script>

<template>
  <div class="dropdown-item mycontainer prevent-select hover-highlight" @click="$emit('callback')">
    <div class="item-text">
      <span>{{ props.itemName }}</span>
    </div>
    <div class="item-checkmark">
      <b v-if="props.isSelected">✓</b>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mycontainer {
  display: flex;
  margin: 2px;
  justify-content: space-between;
}

.item-text {
  font-weight: bolder;
}

.item-checkmark {
  font-weight: bolder;
}

.prevent-select {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}

.dropdown-item {
  color: blue;
}

.hover-highlight:hover {
  background-color: rgb(161, 161, 161);
  border-radius: 7px;
}
</style>
