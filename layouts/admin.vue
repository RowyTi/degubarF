<template>
  <v-app :dark="$vuetify.theme.dark" :class="!$vuetify.theme.dark ? 'bgLight':''">
    <!-- <base-nav-bar /> -->
    <v-main>
      <v-container fluid >
        <nuxt />
      </v-container>
    </v-main>
    <!-- <base-footer /> -->
  </v-app>
</template>

<script>
// import BaseFooter from "~/components/ui/layouts/BaseFooter.vue";
// import BaseNavBar from "~/components/ui/layouts/BaseNavBar.vue";
export default {
  name: "Admin",
  // components: { BaseNavBar, BaseFooter }
};
</script>
<style>
html {
  overflow-y: auto !important;
}
.bgLight {
  background-color: #ebecef !important;
}
</style>
