<template>
  <v-app>
    <base-nav-bar />
    <v-main>
      <v-container fluid>
        <check-state />
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import CheckState from '~/components/CheckState.vue'
import BaseNavBar from '~/components/ui/layouts/BaseNavBar.vue'

export default {
  name: 'Admin',
  components: {
    BaseNavBar,
    CheckState,
  },
}
</script>
<style lang="scss">
html {
  overflow-y: auto !important;
  font-family: 'Roboto';
}
.v-data-table-header__icon {
  color: #ffb300 !important;
}
</style>
