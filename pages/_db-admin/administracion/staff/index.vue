<template>
  <h1>staff</h1>
</template>

<script>
export default {
    name:"AdministracionStaff",
    layout: "admin",
    middleware: "permission-staff",
    head: {
        title: "Staff"
    }
}
</script>

<style>

</style>