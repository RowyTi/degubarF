<template>
  <v-row justify="center" align="center">
    <v-col cols="12" md="11">
      <base-card :dialog="false">
        <template #rightCardTitle> Administración de Clientes </template>
        <template #leftCardTitle>
          <v-btn color="primary" small @click.stop="dialog = !dialog">
            Nuevo Cliente<v-icon right dark>mdi-store-plus</v-icon>
          </v-btn>
        </template>
        <template #body>
          <v-data-table
            :headers="headers"
            :items="branches"
            :footer-props="{
              'items-per-page-options': [10, 20, 30],
              'items-per-page-text': 'Filas por página',
            }"
            :options.sync="options"
            :server-items-length="totalData"
            loading-text="Cargando...Espere por favor!"
            :loading="loading"
          >
            <v-alert slot="no-result"> no hay resultados </v-alert>
            <template #[`item.rating`]="{ item }">
              <v-rating
                v-model="item.rating"
                color="yellow darken-3"
                background-color="grey lighten-2"
                empty-icon="$ratingFull"
                half-increments
                readonly
                small
              ></v-rating>
            </template>
            <template #[`item.acciones`]="{ item }">
              <v-btn color="primary" icon x-small @click="showItem(item)">
                <v-icon> mdi-eye </v-icon>
              </v-btn>
              <v-btn color="success" icon x-small @click="editItem(item)">
                <v-icon> mdi-pencil </v-icon>
              </v-btn>
              <v-btn color="error" icon x-small @click="deleteItem(item)">
                <v-icon> mdi-delete </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </template>
      </base-card>
    </v-col>
    <branch-dialog
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
import BranchDialog from '~/components/dialog/branch/BranchDialog.vue'
export default {
  name: 'AdministracionDeMiNegocio',
  components: { BaseCard, BranchDialog },
  layout: 'admin',
  data: () => ({
    headers: [
      {
        text: 'Cliente',
        sortable: true,
        value: 'name',
      },
      {
        text: 'Estado',
        sortable: true,
        value: 'state',
      },
      {
        text: 'Rating',
        sortable: false,
        value: 'rating',
      },
      {
        text: 'Ult. Actualización',
        sortable: true,
        value: 'updatedAt',
      },
      {
        text: 'Acciones',
        value: 'acciones',
        sortable: false,
        width: '8rem',
      },
    ],
    form: {
      name: '',
      slug: '',
      state: 'inactivo',
      longitud: '',
      latitud: '',
      address: {
        street: '',
        number: '',
        cp: '',
        piso: '',
        dpto: '',
      },
    },
    defaultForm: {
      name: '',
      slug: '',
      state: 'inactivo',
      longitud: '',
      latitud: '',
      address: {
        street: '',
        number: '',
        cp: '',
        piso: '',
        dpto: '',
      },
    },
    loading: false,
    dialog: false,
    editedIndex: -1,
    showMode: false,
    options: {},
  }),
  head: {
    title: 'Clientes',
  },
  computed: {
    ...mapState('administracion/branch', ['branches', 'branch', 'totalData']),
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
        await this.$store.dispatch(
          'administracion/branch/getList',
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
        await this.$store.dispatch('administracion/branch/getResource', item.id)
        this.showMode = true
        this.$nextTick(() => {
          this.form = Object.assign({}, this.branch)
        })
        this.dialog = true
      } catch (error) {
        if (error.response.status === 403) {
          await this.$notify({
            group: 'error',
            title: 'No Autorizado',
            text: 'Usted no está autorizado a realizar esta acción',
          })
        } else {
          await this.$notify({
            group: 'error',
            title: error.response.status,
            text: 'Usted no está autorizado a realizar esta acción',
          })
        }
      }
    },
    async editItem(item) {
      try {
        const res = await this.$axios.$get(`branches/${item.id}`, {
          params: {
            // include: 'profile,profile.address',
          },
        })
        const deserializeData = deserialize(res, {
          changeCase: 'camelCase',
        })
        this.editedIndex = this.branches.indexOf(item)
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
        await this.$store.dispatch(
          'administracion/staff/deleteResource',
          item.id
        )
        await this.$notify({
          group: 'success',
          title: 'Usuario Eliminado',
          text: `${item.username} fue elimiando con éxito!`,
        })
      } catch (error) {
        if (error.response.status === 403)
          await this.$notify({
            group: 'error',
            title: 'No Autorizado',
            text: 'Usted no está autorizado a realizar esta acción',
          })
      }
    },
  },
}
</script>

<style>
</style>