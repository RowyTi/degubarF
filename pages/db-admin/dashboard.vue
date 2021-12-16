<template>
  <v-row justify="center" align="center" class="mt-5">
    <v-col cols="6">
      {{ result }}
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
    result: {},
    order: [
      // items: [
      {
        id: '1',
        name: 'pizza muzzarella',
        description: 'pizza clasica',
        image: 'productos/9/9-pizza-muzzarella.jpeg',
        quantity: '3',
        unit_price: '600',
        total_price: '1800',
      },
      {
        id: '2',
        name: 'coca cola 500ml',
        description: 'coca',
        image: 'productos/9/9-coca-cola.jpeg',
        quantity: '3',
        unit_price: '100',
        total_price: '300',
      },
      // ],
    ],
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
  mounted() {
    this.enJson()
  },
  methods: {
    enJson() {
      this.result = JSON.stringify(this.order)
      console.log(JSON.parse(this.result))
    },
  },
}
</script>