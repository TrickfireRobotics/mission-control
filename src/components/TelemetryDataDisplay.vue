<script>
    export default{
        props: {
            itemName: String,
            isSelected: Boolean,
            value: String
        }
    }

</script>


<template>
    <div v-if="isSelected" class="mycontainer">
        <b>{{ itemName }}</b>
        <b>{{ value }}</b>
    </div>

</template>


<style lang="scss">

.mycontainer {
  display: flex;
  
}

</style>