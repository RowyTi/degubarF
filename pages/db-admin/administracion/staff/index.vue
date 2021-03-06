<template>
  <v-row justify="center" align="center" class="mt-5">
    <v-col cols="12" md="11">
      <base-card :dialog="false">
        <template #rightCardTitle>
          <span class="font-weight-light accent--text">
            Administración de
            <span class="primary--text text-uppercase font-weight-bold">
              Staff</span
            >
          </span>
        </template>
        <template #leftCardTitle>
          <v-btn
            color="primary accent--text"
            small
            @click.stop="dialog = !dialog"
          >
            Agregar Empleado<v-icon right dark>mdi-account-plus</v-icon>
          </v-btn>
        </template>
        <template #body>
          <v-data-table
            :headers="headers"
            :items.sync="staff"
            :footer-props="{
              'items-per-page-options': [10, 20, 30],
              'items-per-page-text': 'Filas por página',
            }"
            :options.sync="options"
            :server-items-length="totalData"
            loading-text="Cargando...Espere por favor!"
            :loading="loading"
          >
            <v-alert
              slot="no-data"
              type="info"
              outlined
              dense
              max-width="400"
              class="mx-auto mt-4"
            >
              No hay personal de staff asociados a este local
            </v-alert>

            <template #[`item.roles`]="{ item }">
              <span v-if="item.roles.length < 1">Sin Asignar</span>
              <span v-else v-text="item.roles[0]"></span>
            </template>
            <template #[`item.state`]="{ item }">
              <v-chip
                :color="item.state === 'inactivo' ? 'error' : 'success'"
                label
                x-small
                class="text-caption text-uppercase"
                v-text="item.state"
              />
            </template>
            <template #[`item.acciones`]="{ item }">
              <v-btn color="accent" icon x-small @click="showItem(item)">
                <v-icon> mdi-account-lock </v-icon>
              </v-btn>
              <v-btn color="info" icon x-small @click="showItem(item)">
                <v-icon> mdi-eye </v-icon>
              </v-btn>
              <div v-if="item.roles[0] !== 'Super Admin'" class="d-inline">
                <v-btn color="success" icon x-small @click="editItem(item)">
                  <v-icon> mdi-pencil </v-icon>
                </v-btn>
                <v-btn color="error" icon x-small @click="deleteItem(item)">
                  <v-icon> mdi-delete </v-icon>
                </v-btn>
              </div>
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
      :name="original.name"
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
  name: 'AdministracionStaff',
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
        value: 'roles',
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
      state: 'inactivo',
      roles: 'Mozo',
      branch: {
        id: '0',
      },
      profile: {
        name: '',
        lastName: '',
        dateOfBirth: '',
        codArea: '',
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
      state: 'inactivo',
      roles: 'Mozo',
      branch: {
        id: '0',
      },
      profile: {
        name: '',
        lastName: '',
        dateOfBirth: '',
        codArea: '',
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
    original: {
      name: '',
    },
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
  mounted() {
    if (this.$auth.user.sa) {
      this.headers.splice(3, 0, {
        text: 'Cliente',
        value: 'branch.name',
        sortable: false,
      })
    }
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
        await this.$store.dispatch('administracion/staff/getList', this.options)
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
          if (error.response.status === 422) this.$toast.global.e422()
        } else if (error.request) {
          this.$toast.error('Ocurrió un problema al cargar los usuarios')
        }
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
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
          if (error.response.status === 422) this.$toast.global.e422()
        } else if (error.request) {
          this.$toast.error('Ocurrió un problema al cargar los usuarios')
        }
      }
    },
    async editItem(item) {
      try {
        const res = await this.$axios.$get(`staff/${item.id}`, {
          params: {
            include: 'profile,profile.address,branch',
            'fields[branches]': 'id,name',
          },
        })

        const deserializeData = deserialize(res, {
          changeCase: 'camelCase',
        })

        this.original.name = item.username
        this.editedIndex = this.staff.indexOf(item)
        this.form = Object.assign({}, deserializeData)
        if (this.form.branch === null) {
          this.form.branch = Object.assign({ id: '' })
        }
        this.form.roles = deserializeData.roles[0]
        this.dialog = true
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
          if (error.response.status === 422) this.$toast.global.e422()
        } else {
          this.$toast.error('Ocurrió un problema al cargar los usuarios')
        }
      }
    },
    async deleteItem(item) {
      try {
        const res = await this.$confirm(
          `Está seguro que desea eliminar el usuario ${item.username} ?`,
          {
            title: `Eliminar ${item.username}`,
            icon: 'mdi-delete',
            color: 'error',
            with: 'auto',
            buttonTrueText: 'Eliminar',
          }
        )
        if (res) {
          await this.$store.dispatch(
            'administracion/staff/deleteResource',
            item.id
          )
          this.$toast.success(
            `El usuario ${item.username} fue eliminado con éxito`,
            {
              icon: 'mdi-checkbox-marked-circle-outline',
            }
          )
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
          if (error.response.status === 422) this.$toast.global.e422()
        } else if (error.request) {
          this.$toast.error('Ocurrió un problema al cargar los usuarios')
        }
      }
    },
  },
}
</script>

<style>
</style>