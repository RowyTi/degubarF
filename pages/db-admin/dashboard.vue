<template>
  <v-row justify="center" align="start">
    <v-sheet v-if="!user.sa" width="100vw" color="amber accent-4 pb-sm-16">
      <v-col cols="12">
        <v-row justify="center" align="center">
          <v-col cols="12" sm="6" md="3">
            <v-sheet
              v-if="!loaded"
              rounded="xl"
              elevation="5"
              color="grey lighten-4"
              height="123"
              class="d-flex align-center justify-center"
            >
              <v-progress-circular
                v-show="!loaded"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-sheet>
            <v-sheet
              v-else
              rounded="xl"
              elevation="5"
              color="grey lighten-4"
              class="mx-sm-auto d-flex flex-column mx-1"
            >
              <div class="d-flex justify-space-between mt-2 mx-2">
                <v-subheader class="text-capitalize pl-0"
                  >ventas mensuales</v-subheader
                >
                <v-avatar color="red" class="">
                  <v-icon dark> mdi-currency-usd </v-icon>
                </v-avatar>
              </div>
              <h3 class="mx-2">${{ report.ventas }}</h3>
              <p class="text-caption mx-2">
                <span
                  :class="
                    report.variacion_ventas > 0
                      ? 'success--text'
                      : 'error--text'
                  "
                  >{{ report.variacion_ventas }}%
                </span>
                Desde el último mes
              </p>
            </v-sheet>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-sheet
              v-if="!loaded"
              rounded="xl"
              elevation="5"
              color="grey lighten-4"
              height="123"
              class="d-flex align-center justify-center"
            >
              <v-progress-circular
                v-show="!loaded"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-sheet>
            <v-sheet
              v-else
              rounded="xl"
              elevation="5"
              color="grey lighten-4"
              class="mx-sm-auto d-flex flex-column mx-1"
            >
              <div class="d-flex justify-space-between mt-2 mx-2">
                <v-subheader class="text-capitalize pl-0"
                  >ventas anuales</v-subheader
                >
                <v-avatar color="red" class="">
                  <v-icon dark> mdi-currency-usd </v-icon>
                </v-avatar>
              </div>
              <h3 class="mx-2">${{ report.ventas_anuales }}</h3>
              <p class="text-caption mx-2">Venta total anual 2021</p>
            </v-sheet>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-sheet
              v-if="!loaded"
              rounded="xl"
              elevation="5"
              color="grey lighten-4"
              height="123"
              class="d-flex align-center justify-center"
            >
              <v-progress-circular
                v-show="!loaded"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-sheet>
            <v-sheet
              v-else
              rounded="xl"
              elevation="5"
              color="grey lighten-4"
              class="mx-sm-auto d-flex flex-column mx-1"
            >
              <div class="d-flex justify-space-between mt-2 mx-2">
                <v-subheader class="text-capitalize pl-0"
                  >Ordenes mensuales</v-subheader
                >
                <v-avatar color="red" class="">
                  <v-icon dark> mdi-order-bool-ascending </v-icon>
                </v-avatar>
              </div>
              <h3 v-if="report.ordenes === 0" class="mx-2 text-capitalize">
                sin ordenes
              </h3>
              <h3 v-else class="mx-2">{{ report.ordenes }}.-</h3>

              <p class="text-caption mx-2">
                <span
                  :class="
                    report.variacion_ordenes > 0
                      ? 'success--text'
                      : 'error--text'
                  "
                  >{{ report.variacion_ordenes }} %
                </span>
                Desde el último mes
              </p>
            </v-sheet>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-sheet
              v-if="!loaded"
              rounded="xl"
              elevation="5"
              color="grey lighten-4"
              height="123"
              class="d-flex align-center justify-center"
            >
              <v-progress-circular
                v-show="!loaded"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-sheet>
            <v-sheet
              v-else
              rounded="xl"
              elevation="5"
              color="grey lighten-4"
              class="mx-sm-auto d-flex flex-column mx-1"
            >
              <div class="d-flex justify-space-between mt-2 mx-2">
                <v-subheader class="text-capitalize pl-0">ranking</v-subheader>
                <v-avatar color="red" class="" dark>
                  <span class="font-weight-bold white--text">{{
                    report.rating
                  }}</span>
                </v-avatar>
              </div>
              <v-rating
                v-model="report.rating"
                color="yellow darken-3"
                background-color="grey lighten-2"
                empty-icon="$ratingFull"
                half-increments
                readonly
                small
                class="mt-n1"
              ></v-rating>
              <p class="text-caption mx-2">Valoraciones de usuarios</p>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
    </v-sheet>
    <v-col v-else cols="12" class="pa-0">
      <h1 class="pa-5">Bienvenido de nuevo {{ user.username }}</h1>
    </v-col>
    <v-col v-show="!user.sa" cols="12" md="6">
      <v-card
        class="pa-5 mt-md-n10 mx-auto"
        elevation="5"
        rounded="xl"
        max-width="700"
      >
        <v-sheet
          v-if="!loaded"
          class="d-flex align-center justify-center"
          height="300"
        >
          <v-progress-circular
            v-show="!loaded"
            indeterminate
            color="primary"
          ></v-progress-circular>
        </v-sheet>
        <bar-chart v-if="loaded" :chartdata="chartdataSales" :height="300" />
      </v-card>
    </v-col>
    <v-col v-show="!user.sa" cols="12" md="6">
      <v-row>
        <v-col cols="12" sm="6"
          ><v-card
            class="pa-5 mt-md-n10 mx-auto"
            elevation="5"
            rounded="xl"
            max-width="600"
          >
            <v-sheet
              v-if="!loaded"
              class="d-flex align-center justify-center"
              height="100"
            >
              <v-progress-circular
                v-show="!loaded"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-sheet>
            <pie-chart
              v-if="loaded"
              :chartdata="charDataTake"
              :options="takeOption"
            /> </v-card
        ></v-col>
        <v-col cols="12" sm="6"
          ><v-card
            class="pa-5 mt-md-n10 mx-auto"
            elevation="5"
            rounded="xl"
            max-width="600"
          >
            <v-sheet
              v-if="!loaded"
              class="d-flex align-center justify-center"
              height="100"
            >
              <v-progress-circular
                v-show="!loaded"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-sheet>

            <pie-chart v-if="loaded" :chartdata="charDataPayment" /></v-card
        ></v-col>
        <v-col cols="12">
          <v-card
            class="pa-5 mx-auto"
            elevation="5"
            rounded="xl"
            max-width="800"
          >
            <v-sheet
              v-if="!loaded"
              class="d-flex align-center justify-center"
              height="150"
            >
              <v-progress-circular
                v-show="!loaded"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-sheet>
            <bar-chart
              v-if="loaded"
              :chartdata="chartdataOrders"
              :height="150"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import BarChart from '~/components/charts/BarChart.vue'
import PieChart from '~/components/charts/PieChart.vue'
export default {
  components: { BarChart, PieChart },
  layout: 'admin',
  middleware: 'permission-dashboard',
  data: () => ({
    report: {},
    loaded: false,
    chartdataOrders: null,
    chartdataSales: null,
    charDataPayment: null,
    charDataTake: null,
    takeOption: {
      plugins: {
        title: {
          display: true,
          text: 'Custom Chart Title',
        },
      },
    },
  }),
  computed: {
    ...mapGetters(['isAuthenticated', 'user']),
  },
  async mounted() {
    try {
      if (!this.user.sa && this.isAuthenticated) {
        await this.getReport()
        await this.getSalesReport()
        await this.getOrdersReport()
        await this.getTakeReport()
        await this.getPaymentMethodReport()
      }
    } catch (error) {
      console.log(error)
    } finally {
      this.loaded = true
    }
  },
  methods: {
    async getReport() {
      const res = await this.$axios.get(
        `dashboard/report/${this.$auth.user.branch.id}`
      )
      this.report = res.data
    },
    async getOrdersReport() {
      try {
        const res = await this.$axios.get(
          `orders/report/${this.$auth.user.branch.id}`
        )
        this.chartdataOrders = res.data
      } catch (e) {
        console.error(e)
      }
    },
    async getSalesReport() {
      try {
        const res = await this.$axios.get(
          `sales/report/${this.$auth.user.branch.id}`
        )
        this.chartdataSales = res.data
      } catch (e) {
        console.error(e)
      }
    },
    async getTakeReport() {
      try {
        const res = await this.$axios.get(
          `take/report/${this.$auth.user.branch.id}`
        )
        this.charDataTake = res.data
      } catch (e) {
        console.error(e)
      }
    },
    async getPaymentMethodReport() {
      try {
        const res = await this.$axios.get(
          `payment/report/${this.$auth.user.branch.id}`
        )
        this.charDataPayment = res.data
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>
<style scoped>
.v-sheet--offset {
  top: -24px;
  position: relative;
}
.max {
  max-width: 1400px !important;
}
</style>