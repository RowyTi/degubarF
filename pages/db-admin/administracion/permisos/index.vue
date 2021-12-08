<template>
  <v-row justify="center" align="center" class="mt-5">
    <v-col cols="12" md="11">
      <base-card :dialog="false">
        <template #rightCardTitle>
          <span class="font-weight-light accent--text">
            Administración de
            <span class="primary--text text-uppercase font-weight-bold">
              Permisos</span
            >
          </span>
        </template>
        <template #leftCardTitle>
          <!-- <v-btn color="primary black--text" small @click.stop="dialog = !dialog">
            Asignar Empleado<v-icon right dark>mdi-account-plus</v-icon>
          </v-btn> -->
        </template>
        <template #body>
          <v-data-table
            :headers="headers"
            :items="staff"
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
            <template #[`item.roles`]="{ item }">
              <span v-if="item.lenght < 1">Sin Asignar</span>
            </template>
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
    <staff-dialog
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
import StaffDialog from '~/components/dialog/staff/StaffDialog.vue'
export default {
  name: 'AdministracionPermisos',
  components: { BaseCard, StaffDialog },
  layout: 'admin',
  middleware: 'permission-staff',
  data: () => ({
    headers: [
      {
        text: 'Usuario',
        sortable: true,
        value: 'username',
      },
      {
        text: 'Estado',
        sortable: true,
        value: 'state',
      },
      {
        text: 'Rol',
        sortable: false,
        value: 'roles[0]',
      },
      {
        text: 'Acciones',
        value: 'acciones',
        sortable: false,
        width: '8rem',
      },
    ],
    form: {
      username: '',
      state: '',
      branch_id: null,
      profile: {
        name: '',
        lastName: '',
        dateOfBirth: '',
        phone: '',
        address: {
          street: '',
          number: '',
          piso: '',
          dpto: '',
          cp: '',
        },
      },
    },
    defaultForm: {
      username: '',
      password: '',
      state: '',
      branch_id: null,
      profile: {
        name: '',
        lastName: '',
        dateOfBirth: '',
        phone: '',
        address: {
          street: '',
          number: '',
          piso: '',
          dpto: '',
          cp: '',
        },
      },
    },
    loading: false,
    dialog: false,
    editedIndex: -1,
    showMode: false,
    options: {},
  }),
  head: {
    title: 'Staff',
  },
  computed: {
    ...mapState('administracion/staff', ['staff', 'empleado', 'totalData']),
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
        await this.$store.dispatch('administracion/staff/getList', this.options)
      } catch (error) {
        if (error.response.status === 403)
          alert('Usted no esta Autorizado para realizar esta acción')
      } finally {
        this.loading = false
      }
    },
    async showItem(item) {
      try {
        await this.$store.dispatch('administracion/staff/getResource', item.id)
        this.showMode = true
        this.$nextTick(() => {
          this.form = Object.assign({}, this.empleado)
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
        const res = await this.$axios.$get(`staff/${item.id}`, {
          params: {
            include: 'profile,profile.address',
          },
        })
        const deserializeData = deserialize(res, {
          changeCase: 'camelCase',
        })
        this.editedIndex = this.staff.indexOf(item)
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