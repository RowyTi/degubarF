<template>
<div>
  {{$auth.user.username}}
</div>

</template>

<script>
export default {
    layout: "admin",
    middleware: "permission-dashboard",
}
</script>

<style>

</style>