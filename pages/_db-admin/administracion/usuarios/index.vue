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
            :items="data"
            :footer-props="{
              'items-per-page-options': [10, 20, 30],
              'items-per-page-text': 'Filas por página',
            }"
            loading-text="Cargando...Espere por favor!"
            :loading="loading"
          >
            <v-alert slot="no-result"> no hay resultados </v-alert>
            <template #[`item.acciones`]="{ item }">
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
    <user-dialog 
      v-model="dialog"
      :form="form"
      :edited-index="editedIndex"
      :show-mode="showMode"
      @closeDialog="closeDialog"/>
  </v-row>
</template>

<script>
import { deserialize } from 'jsonapi-fractal'
import BaseCard from '~/components/ui/BaseCard.vue'
import UserDialog from '~/components/dialog/user/UserDialog.vue'
export default {
  name: 'AdministracionUsuarios',
  components: { BaseCard, UserDialog },
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
    data: [],
    form: {
      name: '',
      email: '',
      status: '',
    },
    defaultForm: {
      name: '',
      email: '',
      status: '',
    },
    loading: false,
    dialog: false,
    editedIndex: -1,
    showMode: false
  }),
  head: {
    title: 'Usuarios',
  },
  created() {
    this.getData()
  },
  methods: {
    closeDialog(){
      this.dialog = !this.dialog
      setTimeout(()=>{
        this.$nextTick(()=>{
          this.form = Object.assign({}, this.defaultForm);
          this.editedIndex = -1;
          this.showMode = false;
        })
      }, 500)
    },
    async getData() {
      try {
        this.loading = true
        const response = await this.$axios.get('/users')
        this.data = deserialize(response.data, { changeCase: 'camelCase' })
      } catch (error) {
        if (error.response.status === 403)
          alert('Usted no esta Autorizado para realizar esta acción')
      } finally {
        this.loading = false
      }
    },
    async showItem(item) {
      try {
        const response = await this.$axios.get('/users/'+item.id)
        const r = deserialize(response.data, { changeCase: 'camelCase' })
        this.form = Object.assign({}, r)
        this.editedIndex = this.data.indexOf(item)
        this.dialog = true
      } catch (error) {
        if (error.response.status === 403)
          alert('Usted no esta Autorizado para realizar esta acción')
      }
    },
  },
}
</script>

<style>
</style>