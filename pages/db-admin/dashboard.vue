<template>
  <v-row justify="center" align="center" class="mt-5">
    <v-col cols="6">
      {{ user }}
    </v-col>
    <v-col cols="6"> <v-btn @click="test">te</v-btn></v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  layout: 'admin',
  middleware: 'permission-dashboard',
  data: () => ({
    //
  }),
  computed: {
    ...mapGetters(['isAuthenticated', 'user']),
  },

  methods: {
    test() {
      this.$toast.success(`El usuario pirulito fue eliminado con éxito`, {
        icon: 'mdi-checkbox-marked-circle-outline',
        // position: 'top-center',
      })
    },
  },
}
</script>