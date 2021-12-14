<template>
  <v-row justify="center" align="center" class="mt-5">
    <v-col cols="6">
      {{ user }}
    </v-col>
    <!-- <v-col cols="6"> <v-btn @click="test">te</v-btn></v-col> -->
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  layout: 'admin',
  middleware: 'permission-dashboard',
  data: () => ({
    items: [
      {
        text: 'Dashboard',
        disabled: false,
        href: 'breadcrumbs_dashboard',
      },
      {
        text: 'Link 1',
        disabled: false,
        href: 'breadcrumbs_link_1',
      },
      {
        text: 'Link 2',
        disabled: true,
        href: 'breadcrumbs_link_2',
      },
    ],
  }),
  computed: {
    ...mapGetters(['isAuthenticated', 'user']),
  },

  methods: {
    //
  },
}
</script>