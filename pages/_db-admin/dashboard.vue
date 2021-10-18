<template>
<div>
  {{$auth.user.username}}
</div>

</template>

<script>
export default {
    layout: "admin",
    middelware: "permission-dashboard",
}
</script>

<style>

</style>