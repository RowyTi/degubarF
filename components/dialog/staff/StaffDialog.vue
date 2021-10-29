<template>
  <v-dialog
    v-bind="$attrs"
    max-width="525"
    persistent
    scrollable
    v-on="$listeners"
  >
    <!-- show data -->
    <base-card
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
        <v-form class="my-5">
          <v-container fluid class="mt-0 pt-0">
            <v-tabs vertical>
              <v-tab>
                <v-icon left> mdi-account </v-icon>
                Usuario
              </v-tab>
              <v-tab>
                <v-icon left> mdi-face-man-profile </v-icon>
                Perfil
              </v-tab>
              <v-tab>
                <v-icon left> mdi-map-marker-account </v-icon>
                Dirección
              </v-tab>
              <v-tab-item>
                <!-- informacion de Usuario -->
                <v-card flat>
                  <v-card-text class="py-0">
                    <v-list two-line subheader flat>
                      <base-list-item-content
                        title="Nombre de usuario"
                        :subtitle="form.username"
                      />
                      <base-list-item-content
                        title="Rol"
                        :subtitle="
                          form.roles && form.roles.length
                            ? form.roles[0]
                            : 'sin asignar'
                        "
                      />
                      <base-list-item-content
                        title="Estado"
                        :subtitle="form.state"
                      />
                      <base-list-item-content
                        title="Fecha de alta"
                        :subtitle="form.createdAt"
                      />
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <!-- perfil de usuario -->
                <v-card flat>
                  <v-card-text class="py-0">
                    <v-list>
                      <base-list-item-content
                        :avatar="true"
                        :avatar-link="
                          form.profile && form.profile.avatar
                            ? form.profile.avatar
                            : ''
                        "
                        title="Nombres"
                        :subtitle="
                          form.profile && form.profile.name
                            ? form.profile.name
                            : 'sin completar'
                        "
                      />
                      <base-list-item-content
                        title="Apellido"
                        :subtitle="
                          form.profile && form.profile.lastName
                            ? form.profile.lastName
                            : 'sin completar'
                        "
                      />
                      <base-list-item-content
                        title="Teléfono"
                        :subtitle="
                          form.profile && form.profile.phone
                            ? form.profile.phone
                            : 'sin completar'
                        "
                      />
                      <base-list-item-content
                        title="Fecha de nacimiento"
                        :subtitle="
                          form.profile && form.profile.dateOfBirth
                            ? form.profile.dateOfBirth
                            : 'sin completar'
                        "
                      />
                      <base-list-item-content
                        title="Ultima Actualización"
                        :subtitle="
                          form.profile && form.profile.updatedAt
                            ? form.profile.updatedAt
                            : 'sin completar'
                        "
                      />
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <!-- direccion del usuario -->
                <v-card flat>
                  <v-card-text class="py-0">
                    <v-list>
                      <v-row>
                        <v-col cols="8">
                          <base-list-item-content
                            title="Calle"
                            :subtitle="
                              form.profile && form.profile.address.street
                                ? form.profile.address.street
                                : 'sin completar'
                            "
                          />
                        </v-col>
                        <v-col cols="4">
                          <base-list-item-content
                            title="Nº"
                            :subtitle="
                              form.profile && form.profile.address.number
                                ? form.profile.address.number
                                : 'sin completar'
                            "
                          />
                        </v-col>
                        <v-col cols="4">
                          <base-list-item-content
                            title="Piso"
                            :subtitle="
                              form.profile && form.profile.address.piso
                                ? form.profile.address.piso
                                : 's/n'
                            "
                          />
                        </v-col>
                        <v-col cols="4">
                          <base-list-item-content
                            title="Dpto"
                            :subtitle="
                              form.profile && form.profile.address.dpto
                                ? form.profile.address.dpto
                                : 's/n'
                            "
                          />
                        </v-col>
                        <v-col cols="4">
                          <base-list-item-content
                            title="CP"
                            :subtitle="
                              form.profile && form.profile.address.cp
                                ? form.profile.address.cp
                                : 's/n'
                            "
                          />
                        </v-col>
                      </v-row>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-container>
        </v-form>
      </template>
    </base-card>
    <!-- create & edit -->
    <v-form
      v-else
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
                        v-model="formu.username"
                        outlined
                        label="Nombre de Usuario"
                        :error-messages="usernameErrors"
                        @input="$v.formu.username.$touch()"
                        @blur="$v.formu.username.$touch()"
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
                    <v-col cols="12" class="pb-0">
                      <v-select
                        label="Estado"
                        :items="itemState"
                        value="activo"
                        outlined
                      >
                      </v-select>
                    </v-col>
                  </v-row>
                </v-container>

                <div class="d-flex justify-end">
                  <v-btn color="error" text :disabled="loading" @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="primary" right @click="nextStep">
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
                      <v-text-field
                        v-model="formu.profile.dateOfBirth"
                        outlined
                        label="Fecha de nacimiento"
                        :error-messages="dateofbirthErrors"
                        @input="$v.formu.profile.dateOfBirth.$touch()"
                        @blur="$v.formu.profile.dateOfBirth.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="formu.profile.phone"
                        outlined
                        label="Teléfono"
                        :error-messages="phoneErrors"
                        @input="$v.formu.profile.phone.$touch()"
                        @blur="$v.formu.profile.phone.$touch()"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
                <div class="d-flex justify-end">
                  <v-btn color="error" text :disabled="loading" @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="primary" @click="stepper = 3">
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
                  <v-btn color="error" text :disabled="loading" @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn
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
    </v-form>
  </v-dialog>
</template>

<script>
import { required, maxLength, numeric } from 'vuelidate/lib/validators'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseListItemContent from '~/components/ui/BaseListItemContent.vue'
export default {
  name: 'StaffDialog',
  components: { BaseCard, BaseListItemContent },
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
  },
  data: () => ({
    stepper: 1,
    itemState: ['inactivo', 'activo'],
    loading: false,
    showPassword: '',
    rules: {
      required: [(value) => !!value || 'Este campo es obligatorio.'],
    },
    options: {
      page: 1,
      itemsPerPage: 10,
    },
  }),
  validations: {
    formu: {
      username: {
        required,
      },
      password: {
        required,
      },
      profile: {
        name: {
          required,
        },
        lastName: {
          required,
        },
        dateOfBirth: {
          required,
        },
        phone: {
          required,
        },
        address: {
          street: {
            required,
          },
          number: {
            required,
            numeric,
          },
          cp: {
            required,
            maxLength: maxLength(5),
          },
          piso: {
            maxLength: maxLength(3),
          },
          dpto: {
            maxLength: maxLength(3),
          },
        },
      },
    },
  },
  computed: {
    formu: {
      get() {
        return this.form
      },
      // set(value) {
      //   this.formu = value
      //   return this.formu
      // },
    },
    formTitle() {
      return this.editedIndex === -1
        ? 'Empleado Nuevo'
        : 'Editar  ' + this.form.username
    },
    btnForm() {
      return this.editedIndex === -1 ? 'guardar' : 'Actualizar '
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.formu.password.$dirty) return errors
      !this.$v.formu.password.required &&
        errors.push('Este campo es obligatiorio.')
      return errors
    },
    usernameErrors() {
      const errors = []
      if (!this.$v.formu.username.$dirty) return errors
      !this.$v.formu.username.required &&
        errors.push('Este campo es obligatiorio.')
      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.formu.profile.name.$dirty) return errors
      !this.$v.formu.profile.name.required &&
        errors.push('Este campo es obligatiorio.')
      return errors
    },
    lastnameErrors() {
      const errors = []
      if (!this.$v.formu.profile.lastName.$dirty) return errors
      !this.$v.formu.profile.lastName.required &&
        errors.push('Este campo es obligatiorio.')
      return errors
    },
    dateofbirthErrors() {
      const errors = []
      if (!this.$v.formu.profile.dateOfBirth.$dirty) return errors
      !this.$v.formu.profile.dateOfBirth.required &&
        errors.push('Este campo es obligatiorio.')
      return errors
    },
    phoneErrors() {
      const errors = []
      if (!this.$v.formu.profile.phone.$dirty) return errors
      !this.$v.formu.profile.phone.required &&
        errors.push('Este campo es obligatiorio.')
      return errors
    },
    streetErrors() {
      const errors = []
      if (!this.$v.formu.profile.address.street.$dirty) return errors
      !this.$v.formu.profile.address.street.required &&
        errors.push('Este campo es obligatiorio.')
      return errors
    },
    numberErrors() {
      const errors = []
      if (!this.$v.formu.profile.address.number.$dirty) return errors
      !this.$v.formu.profile.address.number.required &&
        errors.push('Este campo es obligatiorio.')
      !this.$v.formu.profile.address.number.numeric &&
        errors.push('Este campo solo admite números.')
      return errors
    },
    cpErrors() {
      const errors = []
      if (!this.$v.formu.profile.address.cp.$dirty) return errors
      !this.$v.formu.profile.address.piso.maxLength &&
        errors.push('El campo Piso, no puede tener mas de 5 caracteres.')
      !this.$v.formu.profile.address.cp.required &&
        errors.push('Este campo es obligatiorio.')
      return errors
    },
    pisoErrors() {
      const errors = []
      if (!this.$v.formu.profile.address.piso.$dirty) return errors
      !this.$v.formu.profile.address.piso.maxLength &&
        errors.push('El campo Piso, no puede tener mas de 3 caracteres.')
      return errors
    },
    dptoErrors() {
      const errors = []
      if (!this.$v.formu.profile.address.dpto.$dirty) return errors
      !this.$v.formu.profile.address.dpto.maxLength &&
        errors.push('El campo Dpto, no puede tener mas de 3 caracteres.')
      return errors
    },
  },
  methods: {
    nextStep() {
      return this.stepper++
    },
    close() {
      this.$v.$reset()
      this.stepper = 1
      this.$emit('closeDialog')
    },
    async createResource() {
      try {
        this.loading = true
        this.formu.branch_id = this.$store.$auth.user.branch_id
        await this.$store.dispatch(
          'administracion/staff/createResource',
          this.formu
        )
        this.close()
      } catch (error) {
        if (error.response.status === 403)
          alert('Usted no esta Autorizado para realizar esta acción')
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
      } catch (error) {
        if (error.response.status === 403)
          alert('Usted no esta Autorizado para realizar esta acción')
      } finally {
        this.loading = false
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