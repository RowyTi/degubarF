<template>
  <v-data-table
    :headers="headers"
  
  ></v-data-table>
</template>

<script>
export default {
    name: "BaseDataTable",
    props: {
        headers: {
            type: Array,
            default: () => [],
            required: true
        }
    }
}
</script>

<style>

</style>