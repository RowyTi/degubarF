<template>
  <v-app dark>
    <v-main>
      <v-container fluid>
        <error-notification />
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ErrorNotification from '~/components/notifications/ErrorNotification.vue'
export default {
  components: { ErrorNotification },
}
</script>
