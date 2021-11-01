<template>
  <v-app
    :dark="$vuetify.theme.dark"
    :class="!$vuetify.theme.dark ? 'bgLight' : ''"
  >
    <base-nav-bar />
    <v-main>
      <v-container fluid>
        <success-notification />
        <error-notification />
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ErrorNotification from '~/components/notifications/ErrorNotification.vue'
import SuccessNotification from '~/components/notifications/SuccessNotification.vue'
import BaseNavBar from '~/components/ui/layouts/BaseNavBar.vue'

export default {
  name: 'Admin',
  components: { BaseNavBar, SuccessNotification, ErrorNotification },
}
</script>
<style lang="scss">
html {
  overflow-y: auto !important;
}
.bgLight {
  background-color: #ebecef !important;
}
</style>
