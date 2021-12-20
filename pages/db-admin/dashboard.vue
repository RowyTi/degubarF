<template>
  <v-row justify="center" align="center" class="mt-5">
    <v-col cols="6">
      <v-sheet
        height="200"
        color="primary"
        rounded="xl"
        elevation="10"
        class="pa-10"
      >
        <h1 class="text-capitalize display-2">
          Bienvenido {{ $auth.user.username }}
        </h1>
      </v-sheet>
    </v-col>
    <v-col cols="6"> </v-col>
    <v-col cols="6">
      <v-card class="mt-4 mx-auto" max-width="400">
        <v-sheet
          class="v-sheet--offset mx-auto"
          color="cyan"
          elevation="12"
          max-width="calc(100% - 32px)"
        >
          <v-sparkline
            :labels="labels"
            :value="value"
            color="white"
            line-width="2"
            padding="16"
          ></v-sparkline>
        </v-sheet>

        <v-card-text class="pt-0">
          <div class="text-h6 font-weight-light mb-2">Ordenes Totales</div>
          <div class="subheading font-weight-light grey--text">
            Cantidad de ordenes entregadas
          </div>
          <v-divider class="my-2"></v-divider>
          <v-icon class="mr-2" small> mdi-clock </v-icon>
          <span class="text-caption grey--text font-weight-light"
            >ver todas las ordenes</span
          >
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-sheet
        color="info"
        height="200"
        rounded="xl"
        elevation="6"
        class="pa-5 d-flex justify-space-between"
      >
        <h2 class="display-2">Total Facturado</h2>
        <span class="display-2">100.000,00</span>
      </v-sheet>
    </v-col>
    <v-col cols="6">
      <v-sheet
        color="info"
        height="200"
        rounded="xl"
        elevation="6"
        class="pa-5 d-flex justify-space-between"
      >
        <h2 class="display-2">Ordenes Totales</h2>
        <span class="display-4">12</span>
      </v-sheet>
    </v-col>
    <v-col cols="6">
      <v-sheet
        color="info"
        height="200"
        rounded="xl"
        elevation="6"
        class="pa-5 d-flex justify-space-between"
      >
        <h2 class="display-2">Ordenes Totales</h2>
        <span class="display-4">12</span>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  layout: 'admin',
  middleware: 'permission-dashboard',
  data: () => ({
    labels: ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'],
    value: [200, 675, 410, 390, 310, 460, 250, 240],
  }),
  computed: {
    ...mapGetters(['isAuthenticated', 'user']),
  },
  mounted() {
    //
  },
  methods: {},
}
</script>
<style scoped>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>