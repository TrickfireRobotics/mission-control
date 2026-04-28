<script lang="ts" setup>
export interface DropDownItemProps {
  itemName: string;
  isSelected: boolean;
}
const props = defineProps<DropDownItemProps>();
const emit = defineEmits(['callback']);
</script>

<template>
  <div class="dropdown-item" @click="emit('callback')">
    <span class="item-text">{{ props.itemName }}</span>
    <span v-if="props.isSelected" class="item-check">✓</span>
  </div>
</template>

<style lang="scss" scoped>
.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 8px;
  border-radius: 3px;
  cursor: pointer;
  user-select: none;
  color: var(--dark-white);

  &:hover {
    background: var(--light-grey);
    color: var(--white);
  }
}

.item-text {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.item-check {
  font-size: 0.75rem;
  color: var(--tf-green);
  font-weight: 700;
}
</style>
