<template>
  <v-row justify="center" align="center">
    <v-col cols="12" md="11">
      <base-card :dialog="false">
        <template #rightCardTitle> Administración de Usuarios </template>
        <template #leftCardTitle>
          <v-btn color="primary" small @click.stop="dialog = !dialog">
            Agregar Usuario<v-icon right dark>mdi-account-plus</v-icon>
          </v-btn>
        </template>
        <template #body>
          <v-data-table
            :headers="headers"
            :items="items"
            :footer-props="{
              'items-per-page-options': [10, 20, 30],
              'items-per-page-text': 'Filas por página',
            }"
            loading-text="Cargando...Espere por favor!"
            :loading="loading"
          >
            <v-alert slot="no-result"> no hay resultados </v-alert>
            <template v-slot:[`item.acciones`]="{ item }">
              <v-btn color="primary" icon small @click="showItem(item)">
                <v-icon> mdi-eye </v-icon>
              </v-btn>
              <v-btn color="success" icon small @click="editItem(item)">
                <v-icon> mdi-pencil </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </template>
      </base-card>
    </v-col>
  </v-row>
</template>

<script>
import { deserialize } from 'jsonapi-fractal'
import BaseCard from '~/components/ui/BaseCard.vue'
export default {
  name: 'AdministracionUsuarios',
  components: { BaseCard },
  layout: 'admin',
  middleware: 'permission-user',
  data: () => ({
    headers: [
      {
        text: 'Nombre',
        sortable: false,
        value: 'name',
      },
      {
        text: 'Email',
        sortable: false,
        value: 'email',
      },
      {
        text: 'Acciones',
        value: 'acciones',
        sortable: false,
        width: '8rem',
      },
    ],
    items: [],
    item: {},
    form: {
      name: '',
      email: '',
    },
    loading: false,
  }),
  head: {
    title: 'Usuarios',
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      try {
        this.loading = true
        const response = await this.$axios.get('/users')
        this.items = deserialize(response.data, { changeCase: 'camelCase' })
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    async showItem(item) {
      const response = await this.$axios.get('/users/'+item.id)
      this.item = deserialize(response.data, { changeCase: 'camelCase' })
    },
  },
}
</script>

<style>
</style>