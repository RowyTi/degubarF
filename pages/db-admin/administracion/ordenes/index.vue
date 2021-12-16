<template>
  <v-row justify="center" align="center" class="mt-5">
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
        <!-- <template #leftCardTitle>
          <v-btn
            color="accent"
            small
            class="mr-2"
            :disabled="tables.length < 1"
            @click="print(tables)"
          >
            Imprimir QR <v-icon right dark v-text="'mdi-qrcode-scan'" />
          </v-btn>
          <v-btn
            color="primary accent--text"
            small
            @click.stop="dialog = !dialog"
          >
            Agregar Mesa<v-icon right dark>mdi-table-chair</v-icon>
          </v-btn>
        </template> -->
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
              <v-btn color="error" icon x-small @click="deleteItem(item)">
                <v-icon> mdi-delete </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </template>
      </base-card>
    </v-col>
    <table-dialog
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
import TableDialog from '~/components/dialog/table/TableDialog.vue'
export default {
  name: 'AdministracionOrder',
  components: { BaseCard, TableDialog },
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
    form: {
      name: '',
      slug: '',
      state: 'inactivo',
      qr: '',
    },
    defaultForm: {
      name: '',
      slug: '',
      state: 'inactivo',
      qr: '',
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
    async getData() {
      try {
        this.loading = true
        this.options.id = this.$auth.user.branch.id
        await this.$store.dispatch(
          'administracion/branch/getOrders',
          this.options
        )
      } catch (error) {
        if (error.response.status === 403)
          alert('Usted no esta Autorizado para realizar esta acción')
      } finally {
        this.loading = false
      }
    },
    async showItem(item) {
      try {
        await this.$store.dispatch('administracion/table/getResource', item.id)
        this.showMode = true
        this.$nextTick(() => {
          this.form = Object.assign({}, this.table)
        })
        this.dialog = true
      } catch (error) {
        if (error.response.status === 403)
          await this.$notify({
            group: 'error',
            title: 'No Autorizado',
            text: 'Usted no está autorizado a realizar esta acción',
          })
      }
    },
    async editItem(item) {
      try {
        const res = await this.$axios.$get(`tables/${item.id}`, {
          params: {
            // include: 'branch',
          },
        })
        const deserializeData = deserialize(res, {
          changeCase: 'camelCase',
        })
        this.editedIndex = this.tables.indexOf(item)
        this.form = Object.assign({}, deserializeData)
        this.dialog = true
      } catch (error) {
        if (error.response.status === 403)
          await this.$notify({
            group: 'error',
            title: 'No Autorizado',
            text: 'Usted no está autorizado a realizar esta acción',
          })
      }
    },
    async deleteItem(item) {
      try {
        const res = await this.$confirm(
          `Está seguro que desea eliminar la mesa ${item.name} ?`,
          {
            title: `Eliminar ${item.name}`,
            icon: 'mdi-delete',
            color: 'error',
            with: 'auto',
            buttonTrueText: 'Eliminar',
          }
        )
        if (res) {
          await this.$store.dispatch(
            'administracion/table/deleteResource',
            item.id
          )
          await this.$notify({
            group: 'success',
            title: 'Mesa Eliminada',
            text: `La mesa ${item.name} fue elimianda con éxito!`,
          })
        }
      } catch (error) {
        if (error.response.status === 403)
          await this.$notify({
            group: 'error',
            title: 'No Autorizado',
            text: 'Usted no está autorizado a realizar esta acción',
          })
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