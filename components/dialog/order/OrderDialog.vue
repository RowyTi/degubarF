<template>
  <v-dialog v-bind="$attrs" max-width="400" scrollable v-on="$listeners">
    <v-card
      class="mx-auto"
      max-width="400"
      v-if="showMode"
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
    <!-- show data -->
    <!-- <base-card
      v-if="showMode"
      :dialog="false"
      :color="$vuetify.theme.dark ? 'black' : 'blue-grey lighten-5'"
      :section-actions="false"
    >
      <template #leftCardTitle>
        <v-btn icon x-small color="primary" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
      <template #body class="pa-0">
        <v-container fluid class="mt-0 pt-0">
          {{ formu }}
        </v-container>
      </template>
    </base-card> -->
    <!-- create & edit -->
    <!-- <v-form
      v-else
      ref="form"
      lazy-validation
      @submit.prevent="editedIndex === -1 ? createResource() : updateResource()"
    >
      <base-card
        :dialog="true"
        :section-actions="false"
        :title-toolbar="formTitle"
        color-toolbar="success"
      >
        <template #leftToolbar>
          <v-btn icon color="white" @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #body>
          <v-stepper v-model="stepper">
            <v-stepper-header>
              <v-stepper-step
                :complete="stepper > 1"
                step="1"
                editable
                :rules="[
                  () => !$v.formu.username.$error,
                  () => !$v.formu.password.$error,
                ]"
              >
                Usuario
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step
                :complete="stepper > 2"
                step="2"
                editable
                :rules="[
                  () => !$v.formu.profile.name.$error,
                  () => !$v.formu.profile.lastName.$error,
                  () => !$v.formu.profile.dateOfBirth.$error,
                  () => !$v.formu.profile.phone.$error,
                ]"
              >
                Personal
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step
                step="3"
                editable
                :rules="[
                  () => !$v.formu.profile.address.street.$error,
                  () => !$v.formu.profile.address.number.$error,
                  () => !$v.formu.profile.address.cp.$error,
                  () => !$v.formu.profile.address.piso.$error,
                  () => !$v.formu.profile.address.dpto.$error,
                ]"
              >
                Direccion
              </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-container fluid class="mt-2 pt-0">
                  <v-row align="center" justify="center">
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="username"
                        outlined
                        label="Nombre de Usuario"
                        :error-messages="usernameErrors"
                        @input="delayTouch($v.formu.username)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="formu.password"
                        outlined
                        label="Contraseña"
                        :error-messages="passwordErrors"
                        @input="$v.formu.password.$touch()"
                        @blur="$v.formu.password.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col v-if="$auth.user.sa" cols="12" class="pb-0">
                      <v-autocomplete
                        v-model="formu.branch.id"
                        :value="formu.branch.id"
                        :items="branches"
                        :loading="isLoading"
                        color="primary"
                        item-text="name"
                        item-value="id"
                        label="Clientes"
                        no-data-text="El cliente solicitado no existe."
                        outlined
                        placeholder="Buscar cliente"
                      />
                    </v-col>
                    <v-col v-else cols="12" class="pb-0">
                      <v-select
                        v-model="formu.roles"
                        :items="roles"
                        outlined
                        label="Rol"
                      />
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-select
                        v-model="formu.state"
                        label="Estado"
                        :items="itemState"
                        value="activo"
                        outlined
                        class="text-capitalize"
                      >
                      </v-select>
                    </v-col>
                  </v-row>
                </v-container>

                <div class="d-flex justify-end">
                  <v-btn color="error" text class="mr-3" @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="primary" right class="mr-3" @click="nextStep">
                    continuar
                  </v-btn>
                </div>
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-container>
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="formu.profile.name"
                        outlined
                        label="Nombre"
                        :error-messages="nameErrors"
                        @input="$v.formu.profile.name.$touch()"
                        @blur="$v.formu.profile.name.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="formu.profile.lastName"
                        outlined
                        label="Apellido"
                        :error-messages="lastnameErrors"
                        @input="$v.formu.profile.lastName.$touch()"
                        @blur="$v.formu.profile.lastName.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                      >
                        <template #activator="{ on, attrs }">
                          <v-text-field
                            v-model="formu.profile.dateOfBirth"
                            label="Fecha de nacimiento"
                            outlined
                            readonly
                            clearable
                            v-bind="attrs"
                            :error-messages="dateofbirthErrors"
                            @input="$v.formu.profile.dateOfBirth.$touch()"
                            @blur="$v.formu.profile.dateOfBirth.$touch()"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="formu.profile.dateOfBirth"
                          locale="es"
                          color="accent"
                          :active-picker.sync="activePicker"
                          max="2003-12-30"
                          min="1970-01-01"
                          @change="save"
                        ></v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="4" class="pb-0">
                      <v-text-field
                        v-model="formu.profile.codArea"
                        v-mask="'######'"
                        outlined
                        label="Cod"
                        hint="Código de área"
                        :error-messages="codareaErrors"
                        @input="$v.formu.profile.codArea.$touch()"
                        @blur="$v.formu.profile.codArea.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="8" class="pb-0">
                      <v-text-field
                        v-model="formu.profile.phone"
                        v-mask="'####-####'"
                        outlined
                        hint="Ingrese el número sin el 15"
                        label="Teléfono"
                        :error-messages="phoneErrors"
                        @input="$v.formu.profile.phone.$touch()"
                        @blur="$v.formu.profile.phone.$touch()"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
                <div class="d-flex justify-end">
                  <v-btn color="error" text class="mr-3" @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="primary" class="mr-3" @click="stepper = 3">
                    continuar
                  </v-btn>
                </div>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="formu.profile.address.street"
                        outlined
                        label="Calle"
                        :error-messages="streetErrors"
                        @input="$v.formu.profile.address.street.$touch()"
                        @blur="$v.formu.profile.address.street.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="formu.profile.address.number"
                        outlined
                        label="Numero"
                        type="number"
                        :error-messages="numberErrors"
                        @input="$v.formu.profile.address.number.$touch()"
                        @blur="$v.formu.profile.address.number.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="formu.profile.address.cp"
                        outlined
                        label="CP"
                        :error-messages="cpErrors"
                        @input="$v.formu.profile.address.cp.$touch()"
                        @blur="$v.formu.profile.address.cp.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="formu.profile.address.piso"
                        outlined
                        label="Piso"
                        type="number"
                        :error-messages="pisoErrors"
                        @input="$v.formu.profile.address.piso.$touch()"
                        @blur="$v.formu.profile.address.piso.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="formu.profile.address.dpto"
                        outlined
                        label="Dpto"
                        :error-messages="dptoErrors"
                        @input="$v.formu.profile.address.dpto.$touch()"
                        @blur="$v.formu.profile.address.dpto.$touch()"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
                <div class="d-flex justify-end">
                  <v-btn
                    color="error"
                    text
                    :disabled="loading"
                    class="mr-3"
                    @click="close"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    class="mr-3"
                    color="success"
                    type="submit"
                    :disabled="loading || $v.$anyError"
                    :loading="loading"
                  >
                    {{ btnForm }}
                  </v-btn>
                </div>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </template>
      </base-card>
    </v-form> -->
  </v-dialog>
</template>

<script>
import { deserialize } from 'jsonapi-fractal'
// import { required, maxLength, numeric } from 'vuelidate/lib/validators'
// import BaseCard from '~/components/ui/BaseCard.vue'
// import BaseListItemContent from '~/components/ui/BaseListItemContent.vue'
// const touchMap = new WeakMap()
export default {
  name: 'StaffDialog',
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