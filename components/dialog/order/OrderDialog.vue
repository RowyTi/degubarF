<template>
  <v-dialog v-bind="$attrs" max-width="400" scrollable v-on="$listeners">
    <v-card
      v-if="showMode"
      class="mx-auto"
      max-width="400"
      :dialog="false"
      :section-actions="false"
    >
      <v-toolbar color="primary">
        <v-toolbar-title class="accent--text"
          >Orden Nro # {{ formu.id }}</v-toolbar-title
        >
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-list flat subheader two-line class="pt-5">
        <!-- {{ formu }} -->
        <v-list-item v-for="lista in formu.content" :key="lista.id">
          <v-list-item-content>
            <v-list-item-title
              class="d-flex flex-row text-capitalize font-weight-black"
              >{{ lista.name }}<strong class="primary--text mx-1"> x </strong
              >{{ lista.quantity }}<v-spacer></v-spacer> ${{
                lista.total_price
              }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ lista.description }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
            class="d-flex flex-row text-capitalize font-weight-black"
            >Total <v-spacer></v-spacer>${{ formu.total }}</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-dialog>
</template>

<script>
import { deserialize } from 'jsonapi-fractal'
// import { required, maxLength, numeric } from 'vuelidate/lib/validators'
// import BaseCard from '~/components/ui/BaseCard.vue'
// import BaseListItemContent from '~/components/ui/BaseListItemContent.vue'
// const touchMap = new WeakMap()
export default {
  name: 'OrederDialog',
  components: {
    // BaseCard,
    //  BaseListItemContent
  },
  props: {
    form: {
      type: Object,
      default: () => {},
      required: true,
    },
    editedIndex: {
      type: Number,
      default: -1,
      required: false,
    },
    showMode: {
      type: Boolean,
      default: false,
      required: false,
    },
    name: {
      type: String,
      default: '',
      required: false,
    },
  },
  data: () => ({
    itemState: ['inactivo', 'activo'],
    loading: false,

    options: {
      page: 1,
      itemsPerPage: 10,
    },
    // autocomplete
    branches: [],
    roles: [],
    isLoading: false,
    activePicker: null,
    menu: false,
  }),
  computed: {
    formu: {
      get() {
        return this.form
      },
    },

    formTitle() {
      return this.editedIndex === -1 ? 'Empleado Nuevo' : 'Editar  ' + this.name
    },
    btnForm() {
      return this.editedIndex === -1 ? 'guardar' : 'Actualizar '
    },
  },

  methods: {
    close() {
      // this.$v.$reset()
      this.$emit('closeDialog')
    },

    async createResource() {
      try {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          this.loading = true
          this.formu.branch.id = !this.$auth.user.sa
            ? this.$auth.user.branch.id.toString()
            : this.formu.branch.id
          await this.$store.dispatch(
            'administracion/staff/createResource',
            this.formu
          )
          this.close()
          this.$toast.success(
            `El usuario ${this.formu.username} fue creado con éxito!`,
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
          this.$toast.error(
            `Ocurrió un problema al crear el usuario ${this.formu.username}`
          )
        }
      } finally {
        this.loading = false
      }
    },
    async updateResource() {
      try {
        this.loading = true
        await this.$store.dispatch(
          'administracion/staff/updateResource',
          this.formu
        )
        this.close()
        await this.$toast.success(
          `El usuario ${this.formu.username} fue actualizado con éxito`,
          {
            icon: 'mdi-checkbox-marked-circle-outline',
          }
        )
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
          if (error.response.status === 422) this.$toast.global.e422()
        } else if (error.request) {
          this.$toast.error(
            `Ocurrió un problema al actualizar el usuario ${this.formu.username}`
          )
        }
      } finally {
        this.loading = false
      }
    },
    async getBranches() {
      try {
        this.isLoading = true
        const res = await this.$axios.$get('branches', {
          params: {
            'fields[branches]': 'id,name',
          },
        })
        this.branches = deserialize(res, {
          changeCase: 'camelCase',
        })
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
          if (error.response.status === 422) this.$toast.global.e422()
        } else if (error.request) {
          this.$toast.error('Ocurrió un problema al cargar los locales')
        }
      } finally {
        this.isLoading = false
      }
    },
    async getRoles() {
      try {
        const res = await this.$axios.get('role')
        this.roles = res.data.roles
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
          if (error.response.status === 422) this.$toast.global.e422()
        } else if (error.request) {
          this.$toast.error('Ocurrió un problema al cargar los roles')
        }
      }
    },
  },
}
</script>

<style scope>
.v-tab {
  justify-content: left !important;
}
</style>