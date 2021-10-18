<template>
  <v-app :dark="$vuetify.theme.dark" :class="!$vuetify.theme.dark ? 'bgLight':''">
    <base-nav-bar />
    <v-main>
      <v-container fluid >
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import BaseNavBar from '~/components/ui/layouts/BaseNavBar.vue';

export default {
  name: "Admin",
  components: { BaseNavBar },
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
