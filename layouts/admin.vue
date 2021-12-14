<template>
  <v-app
    :dark="$vuetify.theme.dark"
    :class="!$vuetify.theme.dark ? 'bgLight' : ''"
  >
    <base-nav-bar />
    <v-main>
      <base-breadcrumbs />
      <v-container fluid>
        <check-state />
        <success-notification />
        <error-notification />
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import CheckState from '~/components/CheckState.vue'
import ErrorNotification from '~/components/notifications/ErrorNotification.vue'
import SuccessNotification from '~/components/notifications/SuccessNotification.vue'
import BaseBreadcrumbs from '~/components/ui/BaseBreadcrumbs.vue'
import BaseNavBar from '~/components/ui/layouts/BaseNavBar.vue'

export default {
  name: 'Admin',
  components: {
    BaseNavBar,
    BaseBreadcrumbs,
    SuccessNotification,
    ErrorNotification,
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
