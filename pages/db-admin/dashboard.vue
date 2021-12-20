<template>
  <v-row justify="center" align="center" class="mt-5">
    <v-col cols="6">
      <v-sheet
        height="200"
        max-width="500"
        color="primary"
        rounded="xl"
        elevation="10"
        class="pa-10"
      >
        <h1 class="text-capitalize display-2 accent--text">
          Bienvenido {{ $auth.user.username }}
        </h1>
      </v-sheet>
    </v-col>
    <v-col cols="6">
      <v-sheet
        height="200"
        max-width="500"
        color="accent"
        rounded="xl"
        elevation="10"
        class="pa-10"
        dark
      >
        <v-rating
          v-model="report.rating"
          color="yellow darken-3"
          background-color="grey lighten-2"
          empty-icon="$ratingFull"
          half-increments
          readonly
          large
        ></v-rating>
        <h2 class="display-1">Cervelar Villa Urquiza</h2>
      </v-sheet>
    </v-col>
    <v-col cols="6" class="mt-6">
      <v-card class="mt-4 mx-auto" max-width="400">
        <v-sheet
          class="v-sheet--offset mx-auto pa-6"
          color="accent"
          elevation="12"
          max-width="calc(100% - 32px)"
          dark
        >
          <h2 class="display-3">
            <span class="primary--text">$</span>{{ report.total }}
          </h2>
        </v-sheet>

        <v-card-text class="pt-0">
          <div class="text-h6 font-weight-light mb-2">Facturacion total</div>
          <div class="subheading font-weight-light grey--text">
            Facturacion correspondiente a las ordenes completadas
          </div>
          <v-divider class="my-2"></v-divider>
          <v-icon class="mr-2" small> mdi-clock </v-icon>
          <span class="text-caption grey--text font-weight-light"
            >last registration 26 minutes ago</span
          >
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="6" class="mt-6">
      <v-card class="mt-4 mx-auto" max-width="400">
        <v-sheet
          class="v-sheet--offset mx-auto pa-6"
          color="success"
          elevation="12"
          max-width="calc(100% - 32px)"
          dark
        >
          <h2 class="display-3">
            <span class="primary--text"></span>{{ report.ordenes }}
          </h2>
        </v-sheet>

        <v-card-text class="pt-0">
          <div class="text-h6 font-weight-light mb-2">Ordenes completadas</div>
          <div class="subheading font-weight-light grey--text">
            Cantidad de ordenes completadas satisfactoriamente.
          </div>
          <v-divider class="my-2"></v-divider>
          <v-icon class="mr-2" small> mdi-clock </v-icon>
          <span class="text-caption grey--text font-weight-light"
            >last registration 26 minutes ago</span
          >
        </v-card-text>
      </v-card>
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
    report: {
      total: null,
      ordenes: null,
      rating: null,
    },
  }),
  computed: {
    ...mapGetters(['isAuthenticated', 'user']),
  },
  mounted() {
    this.getReport()
  },
  methods: {
    async getReport() {
      const res = await this.$axios.get('dashboard/report/2')

      this.report = Object.assign({}, res.data)
      console.log(this.report)
    },
  },
}
</script>
<style scoped>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
</style>