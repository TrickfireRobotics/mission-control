<script>
    import { ref, onMounted } from 'vue'

    export default{
        props: {
            itemName: String,
            isSelected: Boolean
        }
    }

    


    
</script>

<!--script setup>
    var isSelected = ref(false);

    defineExpose({
        isSelected
    })
</script-->



<template>
    <div class="dropdown-item mycontainer prevent-select" @click="$emit('callback')">
        <div class="item-text"><span>{{ itemName }}</span></div>
        <div class="item-checkmark" >
            <b v-if="isSelected">✓</b>
        </div>

      </div>

</template>


<style>

.mycontainer {
  display: flex;

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

</style>