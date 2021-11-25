<template>
  <v-row>
    <v-col cols="6">
      {{ user }}
    </v-col>
    <v-col cols="6"> </v-col>
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
    //
  },
}
</script>