<template>
  <v-row justify="start" align="start" class="my-5">
    <v-col cols="12">
      <v-row>
        <v-col cols="6">
          <base-card :dialog="false">
            <template #rightCardTitle>
              <span class="font-weight-light accent--text">
                Entrada de ordenes
                <span class="primary--text text-uppercase font-weight-bold">
                  Pendientes</span
                >
              </span>
            </template>
            <template #body>
              <v-data-table
                v-model="selectedRowPendiente"
                single-select
                :headers="headers"
                :items="ordersPendiente"
                :footer-props="{
                  'items-per-page-options': [10, 20, 30],
                  'items-per-page-text': 'Filas por página',
                }"
                :options.sync="options"
                loading-text="Cargando...Espere por favor!"
                :loading="loading"
                class="
                  gblue-grey
                  lighten-3--text
                  font-weight-light
                  text-capitalize
                  pointer
                "
                @click:row="selectRowPendiente"
              >
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
                  <span class="font-weight-bold black--text">{{
                    item.id
                  }}</span>
                </template>

                <template #[`item.updatedAt`]="{ item }"
                  >{{ item.updatedAt }}
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
              </v-data-table>
            </template>
          </base-card>
        </v-col>
        <v-col cols="6">
          <base-card :dialog="false">
            <template #rightCardTitle>
              <span class="font-weight-light accent--text">
                Ordenes en
                <span class="primary--text text-uppercase font-weight-bold">
                  Preparacion</span
                >
              </span>
            </template>
            <template #body>
              <v-data-table
                v-model="selectedRowPreparando"
                single-select
                :headers="headers"
                :items="ordersPreparando"
                :footer-props="{
                  'items-per-page-options': [10, 20, 30],
                  'items-per-page-text': 'Filas por página',
                }"
                :options.sync="options"
                loading-text="Cargando...Espere por favor!"
                :loading="loading"
                class="
                  gblue-grey
                  lighten-3--text
                  font-weight-light
                  text-capitalize
                  pointer
                "
                @click:row="selectRowPreparando"
              >
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
                  <span class="font-weight-bold black--text">{{
                    item.id
                  }}</span>
                </template>

                <template #[`item.updatedAt`]="{ item }"
                  >{{ item.updatedAt }}
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
              </v-data-table>
            </template>
          </base-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12">
      <v-row>
        <v-col cols="6">
          <v-card class="mx-auto" :dialog="false" :section-actions="false">
            <v-toolbar color="primary">
              <v-toolbar-title class="accent--text"
                >Orden Nro # {{ orderDetailPendiente.id }}</v-toolbar-title
              >
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-list
              v-if="orderDetailPendiente.content.length > 0"
              flat
              subheader
              two-line
              class="pt-5"
            >
              <v-list-item
                v-for="lista in orderDetailPendiente.content"
                :key="lista.id"
              >
                <v-list-item-content>
                  <v-list-item-title
                    class="d-flex flex-row text-capitalize font-weight-black"
                    >{{ lista.name
                    }}<strong class="primary--text mx-1"> x </strong
                    >{{ lista.quantity }}<v-spacer></v-spacer> ${{
                      lista.total_price
                    }}
                  </v-list-item-title>
                  <v-list-item-subtitle>{{
                    lista.description
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <div class="text-center py-5">
                <v-btn
                  color="info"
                  @click="updateStatePendiente(orderDetailPendiente.id)"
                  >Preparar</v-btn
                >
              </div>
            </v-list>
            <v-list v-else class="mx-6">
              <v-list-item-content>
                <v-alert type="info" outlined
                  >Seleccione una orden PENDIENTE de la tabla
                </v-alert>
              </v-list-item-content>
            </v-list>
          </v-card>
        </v-col>
        <v-col cols="6">
          <v-card class="mx-auto" :dialog="false" :section-actions="false">
            <v-toolbar color="success">
              <v-toolbar-title class="white--text"
                >Revisión de Orden Nro #
                {{ orderDetailPreparando.id }}</v-toolbar-title
              >
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-list
              v-if="orderDetailPreparando.content.length > 0"
              flat
              subheader
              two-line
              class="pt-5"
            >
              <v-list-item
                v-for="lista in orderDetailPreparando.content"
                :key="lista.id"
              >
                <v-list-item-content>
                  <v-list-item-title
                    class="d-flex flex-row text-capitalize font-weight-black"
                    >{{ lista.name
                    }}<strong class="primary--text mx-1"> x </strong
                    >{{ lista.quantity }}<v-spacer></v-spacer> ${{
                      lista.total_price
                    }}
                  </v-list-item-title>
                  <v-list-item-subtitle>{{
                    lista.description
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <div class="text-center py-5">
                <v-btn
                  color="success"
                  @click="updateStatePreparando(orderDetailPreparando.id)"
                  >Entregar</v-btn
                >
              </div>
            </v-list>
            <v-list v-else class="mx-6">
              <v-list-item-content>
                <v-alert type="info" outlined
                  >Seleccione una orden de la tabla en PREPARACIÓN</v-alert
                >
              </v-list-item-content>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { deserialize } from 'jsonapi-fractal'
import BaseCard from '~/components/ui/BaseCard.vue'
export default {
  name: 'AdministracionComanda',
  components: {
    BaseCard,
  },
  layout: 'admin',
  middleware: ['permission-kitchen'],
  data: () => ({
    selectedRowPendiente: [],
    ordersPendiente: [],
    updatePendiente: {
      state: '',
    },
    orderDetailPendiente: {
      id: '',
      content: '',
      create: '',
    },
    selectedRowPreparando: [],
    ordersPreparando: [],
    updatePreparando: {
      state: '',
    },
    orderDetailPreparando: {
      id: '',
      content: '',
      create: '',
    },
    defaultDetail: {
      id: '',
      content: '',
      create: '',
    },
    headers: [
      {
        text: 'Nro Orden',
        sortable: true,
        value: 'id',
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
    ],
    loading: false,
    showMode: false,
    options: { id: '', sortBy: ['updatedAt'], sortDesc: [true] },
  }),
  head: {
    title: 'Comanda',
  },
  mounted() {
    this.getOrdersPendiente()
    this.getOrdersPreparando()
    this.refreshData()
  },
  methods: {
    refreshData() {
      setInterval(() => {
        this.getOrdersPendiente()
        this.getOrdersPreparando()
      }, 30000)
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
    setTakeAway(value) {
      if (value) {
        return 'si'
      } else {
        return 'no'
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

    async getOrdersPendiente() {
      try {
        const branch = this.$auth.user.branch.id
        const res = await this.$axios.get(
          `branches/${branch}/orders?filter[state]=pendiente`
        )
        this.ordersPendiente = deserialize(res.data, {
          changeCase: 'camelCase',
        })
      } catch (error) {}
    },
    async getOrdersPreparando() {
      try {
        const branch = this.$auth.user.branch.id
        const res = await this.$axios.get(
          `branches/${branch}/orders?filter[state]=preparando`
        )
        this.ordersPreparando = deserialize(res.data, {
          changeCase: 'camelCase',
        })
      } catch (error) {}
    },
    selectRowPreparando(value) {
      this.orderDetailPreparando.id = value.id
      this.orderDetailPreparando.content = value.content
      this.orderDetailPreparando.create = value.ceatedAt
      this.selectedRowPreparando = [value]
      this.updatePreparando.state = 'entregado'
    },
    selectRowPendiente(value) {
      this.orderDetailPendiente.id = value.id
      this.orderDetailPendiente.content = value.content
      this.orderDetailPendiente.create = value.ceatedAt
      this.selectedRowPendiente = [value]
      this.updatePendiente.state = 'preparando'
    },
    async updateStatePendiente(id) {
      try {
        await this.$axios.patch(`orders/state/${id}`, this.updatePendiente)
        this.updatePendiente.state = ''
        this.orderDetailPendiente = Object.assign({}, this.defaultDetail)
        this.$toast.success(`La Mesa fue actualizada con éxito!`, {
          icon: 'mdi-checkbox-marked-circle-outline',
        })

        await this.getOrdersPendiente()
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
  },
}
</script>

<style>
.theme--light.v-data-table tbody tr.v-data-table__selected {
  background: #ffecb3;
  cursor: pointer;
}
.theme--light.v-data-table
  > .v-data-table__wrapper
  > table
  > tbody
  > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  background: #ffe082;
  cursor: pointer;
}
</style>