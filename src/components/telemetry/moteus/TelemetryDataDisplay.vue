<script lang="ts" setup>
export interface TelemetryDataDisplayProps {
  itemName: string;
  isSelected: boolean;
  value: string;
  shouldRecordData: boolean;
  shouldShowCheckBox: boolean;
  showAllFeatures: boolean;
}

const props = defineProps<TelemetryDataDisplayProps>();
const emit = defineEmits(['checkboxClicked']);
</script>

<template>
  <div v-if="props.isSelected" class="mycontainer">
    <div>
      <input
        v-if="props.showAllFeatures"
        v-show="props.shouldShowCheckBox"
        checked
        class="checkbox-style"
        type="checkbox"
        title="Select to include this value when recording data into a .csv file"
        @click="emit('checkboxClicked', props.itemName)"
      />
      <b>{{ props.itemName }}: </b>
    </div>
    <b>{{ props.value }}</b>
  </div>
</template>

<style lang="scss" scoped>
.mycontainer {
  display: flex;
}

.checkbox-style {
  margin-right: 2px;
}

input[type='checkbox'] {
  accent-color: rgb(48, 182, 48);
}
</style>
