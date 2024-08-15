<script setup>

    const props = defineProps(['itemName', 'isSelected', 'value', 'shouldRecordData', 'shouldShowCheckBox']);

</script>


<template>
    <div v-if="isSelected" class="mycontainer">
        <div>
            <input v-if="shouldShowCheckBox" @click="$emit('checkboxClicked', itemName)" class="checkbox-style" type="checkbox" title="Select to include this value when recording data into a .csv file">
            <b>{{ itemName }}</b>
        </div>
        <b>{{ value }}</b>
    </div>

</template>


<style lang="scss">

.mycontainer {
  display: flex;
  
}

.checkbox-style{
    margin-right: 2px;
}

input[type="checkbox"] {
  accent-color: rgb(48, 182, 48);;
}

</style>