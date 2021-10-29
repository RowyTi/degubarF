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
                :rules="[() => !$v.$anyError]"
              >
                Usuario
                <small v-if="$v.$anyError">Revisa los datos</small>
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step
                :complete="stepper > 2"
                step="2"
                :editable="!$v.$anyError"
              >
                Personal
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step step="3"> Direccion </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-container fluid class="mt-2 pt-0">
                  <v-row align="center" justify="center">
                    <v-col cols="12" class="pb-0">
                      {{ $v.$anyError }}
                      {{ $v.$invalid }}
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
                      <base-password-generator
                        v-model="formu.password"
                        :autoGenerate="true"
                        type="text"
                        size="8"
                        characters="a-z,A-Z,0-9,#"
                        :rules="rules.required"
                        :error-messages="passwordErrors"
                        @input="$v.formu.password.$touch()"
                        @blur="$v.formu.password.$touch()"
                      />
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-select
                        label="Estado"
                        :items="items"
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
                  <v-btn
                    color="primary"
                    :disabled="$v.$anyError"
                    right
                    @click="nextStep"
                  >
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
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="formu.profile.lastName"
                        outlined
                        label="Apellido"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="formu.profile.dateOfBirth"
                        outlined
                        label="Fecha de nacimiento"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="formu.profile.phone"
                        outlined
                        label="Teléfono"
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
                <div class="d-flex justify-end">
                  <v-btn color="error" text :disabled="loading" @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="success"
                    type="submit"
                    :disabled="loading"
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
import { required } from 'vuelidate/lib/validators'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseListItemContent from '~/components/ui/BaseListItemContent.vue'
import BasePasswordGenerator from '~/components/ui/BasePasswordGenerator.vue'
export default {
  name: 'StaffDialog',
  components: { BaseCard, BaseListItemContent, BasePasswordGenerator },
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
    items: ['inactivo', 'activo'],
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
    },
  },
  computed: {
    formu: {
      get() {
        return this.form
      },
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
  },
  methods: {
    nextStep() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.stepper++
      }
    },
    close() {
      this.stepper = 1
      this.$v.$reset()
      this.$emit('closeDialog')
    },
    async createResource() {
      try {
        this.loading = true
        this.formu.profile.avatar = this.image
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