<template>
  <v-row justify="center" align="center" class="mt-5">
    <v-col cols="12" md="11">
      <base-card :dialog="false">
        <template #rightCardTitle>
          <span class="font-weight-light accent--text">
            Administración de
            <span class="primary--text text-uppercase font-weight-bold">
              Usuarios</span
            >
          </span>
        </template>
        <template #leftCardTitle>
          <v-btn
            color="primary accent--text"
            small
            @click.stop="dialog = !dialog"
          >
            Agregar Usuario<v-icon right dark>mdi-account-plus</v-icon>
          </v-btn>
        </template>
        <template #body>
          <v-data-table
            :headers="headers"
            :items="usuarios"
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
            <template #[`item.acciones`]="{ item }">
              <v-btn color="info" icon x-small @click="showItem(item)">
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
    <user-dialog
      v-model="dialog"
      :form="form"
      :edited-index="editedIndex"
      :show-mode="showMode"
      :name="original.name"
      @closeDialog="closeDialog"
    />
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
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
        sortable: true,
        value: 'name',
      },
      {
        text: 'Email',
        sortable: true,
        value: 'email',
      },
      {
        text: 'Estado',
        sortable: true,
        value: 'state',
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
    showMode: false,
    options: {},
    original: {
      name: '',
    },
  }),
  head: {
    title: 'Usuarios',
  },
  computed: {
    ...mapState('administracion/users', ['usuarios', 'usuario', 'totalData']),
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
          this.original.name = ''
          this.form = Object.assign({}, this.defaultForm)
          this.editedIndex = -1
          this.showMode = false
        })
      }, 500)
    },
    async getData() {
      try {
        this.loading = true
        await this.$store.dispatch('administracion/users/getList', this.options)
      } catch (error) {
        if (error.response.status === 403)
          alert('Usted no esta Autorizado para realizar esta acción')
      } finally {
        this.loading = false
      }
    },
    async showItem(item) {
      try {
        await this.$store.dispatch('administracion/users/getResource', item.id)
        this.showMode = true
        this.$nextTick(() => {
          this.form = Object.assign({}, this.usuario)
        })
        this.dialog = true
      } catch (error) {
        if (error.response.status === 403)
          alert('Usted no esta Autorizado para realizar esta acción')
      }
    },
    async editItem(item) {
      try {
        await this.$store.dispatch('administracion/users/getResource', item.id)
        this.original.name = item.email
        this.editedIndex = this.usuarios.indexOf(item)
        this.$nextTick(() => {
          this.form = Object.assign({}, this.usuario)
        })
        this.dialog = true
      } catch (error) {
        if (error.response.status === 403)
          alert('Usted no esta Autorizado para realizar esta acción')
      }
    },
    async deleteItem(item) {
      try {
        const res = await this.$confirm(
          `Está seguro que desea eliminar el usuario ${item.name} ?`,
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
            'administracion/users/deleteResource',
            item.id
          )
        }
      } catch (error) {
        alert(error)
      }
    },
  },
}
</script>

<style>
</style>