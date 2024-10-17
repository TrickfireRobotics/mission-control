<script setup>
  const props = defineProps(['itemName', 'isSelected']);    
</script>


<template>
    <div class="dropdown-item mycontainer prevent-select hover-highlight" @click="$emit('callback')">
        <div class="item-text"><span>{{ itemName }}</span></div>
        <div class="item-checkmark" >
            <b v-if="isSelected">✓</b>
        </div>

      </div>

</template>


<style lang="scss" scoped>

.mycontainer {
  display: flex;
  margin: 2px;
  justify-content: space-between;
  
}

.item-text{
  font-weight: bolder;
}

.item-checkmark{
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
