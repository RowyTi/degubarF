<template>
  <v-row justify="center" align="center" class="my-5">
    <v-container>
      <v-row>
        <v-col v-for="(f, i) in filters" :key="i" cols="12" sm="6" md="3">
          <v-sheet
            rounded="lg"
            height="100"
            :color="f.color"
            class="pa-5 d-flex flex-row"
            elevation="3"
            dark
          >
            <span class="text-uppercase">{{ f.state }}</span>
            <v-spacer></v-spacer>
            <span
              v-if="f.count === '' || f.count === 0"
              class="display-3 font-weight-black"
              >--</span
            >
            <span v-else class="display-3 font-weight-black" v-text="f.count" />
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>

    <v-col cols="12" md="11">
      <base-card :dialog="false">
        <template #rightCardTitle>
          <span class="font-weight-light accent--text">
            Administración de
            <span class="primary--text text-uppercase font-weight-bold">
              Ordenes</span
            >
          </span>
        </template>
        <template #body>
          <v-data-table
            :headers="headers"
            :items="orders"
            :footer-props="{
              'items-per-page-options': [10, 20, 30],
              'items-per-page-text': 'Filas por página',
            }"
            :options.sync="options"
            :server-items-length="totalData"
            loading-text="Cargando...Espere por favor!"
            :loading="loading"
            class="gblue-grey lighten-3--text font-weight-light text-capitalize"
          >
            <v-alert
              slot="no-data"
              type="info"
              outlined
              dense
              max-width="400"
              class="mx-auto mt-4"
            >
              No han pedido nada aún!
            </v-alert>
            <template #[`item.id`]="{ item }">
              <span class="font-weight-bold grey--text">#</span>
              <span class="font-weight-bold black--text">{{ item.id }}</span>
            </template>
            <template #[`item.total`]="{ item }">
              <span class="font-weight-bold grey--text">$</span
              ><span class="font-weight-bold black--text">
                {{ item.total }}</span
              >
            </template>
            <template #[`item.updatedAt`]="{ item }"
              >{{ item.updatedAt }}
            </template>
            <template #[`item.paymentMethod`]="{ item }">
              {{ setPaymentMethod(item.paymentMethod) }}
            </template>
            <template #[`item.takeAway`]="{ item }">
              {{ setTakeAway(item.takeAway) }}
            </template>
            <template #[`item.state`]="{ item }">
              <v-chip
                label
                small
                :color="setStateColor(item.state)"
                class="text-caption text-uppercase"
                >{{ item.state }}</v-chip
              >
            </template>
            <template #[`item.acciones`]="{ item }">
              <v-btn color="info" icon x-small @click="showItem(item)">
                <v-icon> mdi-eye </v-icon>
              </v-btn>
              <v-btn
                color="error"
                icon
                x-small
                :disabled="
                  item.state === 'entregado' || item.state === 'anulado'
                "
                @click="deleteItem(item)"
              >
                <v-icon> mdi-cancel </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </template>
      </base-card>
    </v-col>
    <order-dialog
      v-model="dialog"
      :form="form"
      :edited-index="editedIndex"
      :show-mode="showMode"
      @closeDialog="closeDialog"
    />
  </v-row>
</template>

<script>
import { deserialize } from 'jsonapi-fractal'
import { mapState } from 'vuex'
import BaseCard from '~/components/ui/BaseCard.vue'
import OrderDialog from '~/components/dialog/order/OrderDialog.vue'
export default {
  name: 'AdministracionOrder',
  components: { BaseCard, OrderDialog },
  layout: 'admin',
  middleware: ['permission-order'],
  data: () => ({
    headers: [
      {
        text: 'Nro Orden',
        sortable: true,
        value: 'id',
      },
      {
        text: 'Metodo de pago',
        sortable: true,
        value: 'paymentMethod',
      },
      {
        text: 'Take Away',
        sortable: true,
        value: 'takeAway',
      },

      {
        text: 'Estado',
        sortable: true,
        value: 'state',
      },
      {
        text: 'Actualizado',
        sortable: true,
        value: 'updatedAt',
      },
      {
        text: 'Total',
        sortable: true,
        value: 'total',
      },
      {
        text: 'Acciones',
        value: 'acciones',
        sortable: false,
        width: '8rem',
      },
    ],
    itemState: [
      {
        text: 'Inactivo',
        value: 'inactivo',
      },
      {
        text: 'Ocupado',
        value: 'ocupado',
      },
      {
        text: 'Libre',
        value: 'libre',
      },
    ],
    filters: {
      pendiente: {
        color: 'primary',
        state: 'pendiente',
        count: '',
      },
      preparacion: {
        color: 'info',
        state: 'preparando',
        count: '',
      },
      entregado: {
        color: 'success',
        state: 'entregado',
        count: '',
      },
      anulado: {
        color: 'error',
        state: 'anulado',
        count: '',
      },
    },
    form: {
      content: '',
      takeAway: false,
      paymentMethod: '',
      state: '',
      total: '',
    },
    defaultForm: {
      content: '',
      takeAway: false,
      paymentMethod: '',
      state: '',
      total: '',
    },
    loading: false,
    dialog: false,
    editedIndex: -1,
    showMode: false,
    options: { id: '', sortBy: ['updatedAt'], sortDesc: [true] },
  }),
  head: {
    title: 'Ordenes',
  },
  computed: {
    ...mapState('administracion/branch', ['orders', 'totalData']),
  },

  watch: {
    options: {
      handler() {
        this.getData()
      },
    },
    deep: true,
  },
  mounted() {
    this.pendiente()
    this.preparacion()
    this.entregado()
    this.anulado()
    this.refreshData()
  },
  methods: {
    closeDialog() {
      this.dialog = false
      setTimeout(() => {
        this.$nextTick(() => {
          this.form = Object.assign({}, this.defaultForm)
          this.editedIndex = -1
          this.showMode = false
        })
      }, 500)
    },
    refreshData() {
      setInterval(() => {
        this.getData()
        this.pendiente()
        this.preparacion()
        this.entregado()
        this.anulado()
      }, 60000)
    },
    async getData() {
      try {
        this.loading = true
        this.options.id = this.$auth.user.branch.id
        await this.$store.dispatch(
          'administracion/branch/getOrders',
          this.options
        )
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
        } else if (error.request) {
          this.$toast.error(`Ocurrió un problema al cargar las ordenenes`)
        }
      } finally {
        this.loading = false
      }
    },
    async showItem(item) {
      try {
        const res = await this.$axios.get(`orders/${item.id}`)
        const serializedData = deserialize(res.data, {
          changeCase: 'snakeCase',
        })
        this.showMode = true
        this.form = Object.assign({}, serializedData)
        this.dialog = true
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
        } else if (error.request) {
          this.$toast.error(
            `Ocurrió un problema al cargar la orden nro ${item.id}`
          )
        }
      }
    },
    async updateStatePreparando(id) {
      try {
        await this.$axios.patch(`orders/state/${id}`, this.updatePreparando)
        this.updatePreparando.state = ''
        this.orderDetailPreparando = Object.assign({}, this.defaultDetail)
        this.$toast.success(`La Mesa fue actualizada con éxito!`, {
          icon: 'mdi-checkbox-marked-circle-outline',
        })
        await this.getOrdersPreparando()
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
          if (error.response.status === 422) this.$toast.global.e422()
        } else if (error.request) {
          this.$toast.error('Ocurrió un problema al cargar las mesas')
        }
      }
    },

    async deleteItem(item) {
      try {
        const res = await this.$confirm(
          `Está seguro que desea anular la orden nro ${item.id} ?`,
          {
            title: `Anularorden Nro ${item.id}`,
            icon: 'mdi-delete',
            color: 'error',
            with: 'auto',
            buttonTrueText: 'Anular',
          }
        )
        if (res) {
          const update = {
            state: 'anulado',
          }
          await this.$axios.patch(`orders/state/${item.id}`, update)
          await this.getData()
          await this.pendiente()
          await this.preparacion()
          await this.entregado()
          await this.anulado()
          this.$toast.success(
            `La orden nro ${item.id} fue anulada con éxito!`,
            {
              icon: 'mdi-checkbox-marked-circle-outline',
            }
          )
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
        } else if (error.request) {
          this.$toast.error(
            `Ocurrió un problema al anular la orden nro ${item.id}`
          )
        }
      }
    },
    setTakeAway(value) {
      if (value) {
        return 'si'
      } else {
        return 'no'
      }
    },
    setPaymentMethod(value) {
      if (value === '1') {
        return 'Mercado Pago'
      } else {
        return 'Efectivo'
      }
    },
    setStateColor(value) {
      let color = ''
      switch (value) {
        case 'pendiente':
          color = 'primary'
          return color
        case 'preparando':
          color = 'info'
          return color
        case 'entregado':
          color = 'success'
          return color
        default:
          color = 'error'
          return color
      }
    },
    async preparacion() {
      const res = await this.$axios.get('orders', {
        params: {
          'filter[branch_id]': this.$auth.user.branch.id,
          'filter[state]': 'preparando',
        },
      })
      const deserializeData = deserialize(res.data, { changeCase: 'snakeCase' })
      this.filters.preparacion.count = deserializeData.length
    },
    async pendiente() {
      const res = await this.$axios.get('orders', {
        params: {
          'filter[branch_id]': this.$auth.user.branch.id,
          'filter[state]': 'pendiente',
        },
      })
      const deserializeData = deserialize(res.data, { changeCase: 'snakeCase' })
      this.filters.pendiente.count = deserializeData.length
    },
    async entregado() {
      const res = await this.$axios.get('orders', {
        params: {
          'filter[branch_id]': this.$auth.user.branch.id,
          'filter[state]': 'entregado',
        },
      })
      const deserializeData = deserialize(res.data, { changeCase: 'snakeCase' })
      this.filters.entregado.count = deserializeData.length
    },
    async anulado() {
      const res = await this.$axios.get('orders', {
        params: {
          'filter[branch_id]': this.$auth.user.branch.id,
          'filter[state]': 'anulado',
        },
      })
      const deserializeData = deserialize(res.data, { changeCase: 'snakeCase' })
      this.filters.anulado.count = deserializeData.length
    },
  },
}
</script>

<style>
/* .test {
  border-style: dotted !important;
  border-color: black !important;
  border-width: 1px !important;
} */
</style>