<script>
    import { ref, onMounted } from 'vue'

    export default{
        props: {
            itemName: String
        }
    }

    


    
</script>

<script setup>
    var isSelected = ref(false);
</script>



<template>
    <div class="dropdown-item mycontainer prevent-select" @click="$emit('callback')">
        <div class="item-text" @click="isSelected = !isSelected"><span>{{ itemName }}</span></div>
        <div class="item-checkmark" v-if="isSelected">✓</div>

      </div>

</template>


<style>

.mycontainer {
  display: flex;

  justify-content: space-between;
  
}

.item-text{
  font-weight: bolder;
  
  flex-grow: 1;
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

</style>