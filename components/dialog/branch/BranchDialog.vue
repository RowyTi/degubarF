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
          <v-stepper v-model="stepper" alt-labels>
            <v-stepper-header>
              <v-stepper-step
                :complete="stepper > 1"
                step="1"
                editable
                :rules="[() => !$v.formu.name.$error]"
              >
                Cliente
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepper > 2" step="2" editable>
                <!-- :rules="[
                  () => !$v.formu.profile.name.$error,
                  () => !$v.formu.profile.lastName.$error,
                  () => !$v.formu.profile.dateOfBirth.$error,
                  () => !$v.formu.profile.phone.$error,
                ]" -->
                Dirección
              </v-stepper-step>
              <!-- 
              <v-divider></v-divider>

              <v-stepper-step step="3">
                 :rules="[
                  () => !$v.formu.profile.address.street.$error,
                  () => !$v.formu.profile.address.number.$error,
                  () => !$v.formu.profile.address.cp.$error,
                  () => !$v.formu.profile.address.piso.$error,
                  () => !$v.formu.profile.address.dpto.$error,
                ]" 
                Administrador
              </v-stepper-step> -->
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <v-container fluid class="mt-2 pt-0">
                  <v-row align="center" justify="center">
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="clientName"
                        outlined
                        label="Nombre del cliente"
                        :error-messages="nameErrors"
                        hint="Ej: Degubar Palermo"
                        @input="$v.formu.name.$touch()"
                        @blur="$v.formu.name.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="formu.slug"
                        disabled
                        outlined
                        label="URL amigable"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-select
                        v-model="formu.state"
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
                      <vuetify-google-autocomplete
                        id="map"
                        ref="address"
                        prepend-inner-icon="mdi-map-marker"
                        outlined
                        clearable
                        label="Dirección"
                        classname="form-control"
                        hint="Seleccionar la dirección cuando aparezca"
                        country="ar"
                        @placechanged="getAddressData"
                      >
                        <template #prepend-inner>
                          <v-icon>mdi-map-marker</v-icon>
                        </template>
                      </vuetify-google-autocomplete>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="street"
                        outlined
                        label="Calle"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="street_number"
                        outlined
                        label="Numero"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="postal_code"
                        outlined
                        label="cp"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="formu.address.piso"
                        outlined
                        label="Piso"
                        :error-messages="pisoErrors"
                        @input="$v.formu.address.piso.$touch()"
                        @blur="$v.formu.address.piso.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field
                        v-model="formu.address.dpto"
                        outlined
                        label="Dpto"
                        :error-messages="dptoErrors"
                        @input="$v.formu.address.dpto.$touch()"
                        @blur="$v.formu.address.dpto.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="latitude"
                        outlined
                        disabled
                        label="Latitud"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        v-model="longitude"
                        outlined
                        disabled
                        label="Longitud"
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

                {{ formu }}
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </template>
      </base-card>
    </v-form>
  </v-dialog>
</template>

<script>
import slugify from 'slugify'
import { required, numeric, maxLength } from 'vuelidate/lib/validators'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseListItemContent from '~/components/ui/BaseListItemContent.vue'
export default {
  name: 'BranchDialog',
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
    address: '',
    stepper: 1,
    itemState: ['inactivo', 'activo'],
    loading: false,
    loadingSearch: false,
    options: {
      page: 1,
      itemsPerPage: 10,
    },
  }),
  validations: {
    formu: {
      name: {
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
  computed: {
    formu: {
      get() {
        return this.form
      },
    },
    formTitle() {
      return this.editedIndex === -1
        ? 'Cliente Nuevo'
        : 'Editar  ' + this.form.name
    },
    btnForm() {
      return this.editedIndex === -1 ? 'Guardar' : 'Actualizar '
    },
    clientName: {
      get() {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.formu.slug = slugify(this.formu.name, {
          lower: true,
          strict: true,
        })
        return this.formu.name
      },
      set(value) {
        this.formu.name = value
      },
    },
    street: {
      get() {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.formu.address.street = this.address.route

        return this.formu.address.street
      },
      set(value) {
        this.formu.address.street = value
      },
    },
    street_number: {
      get() {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.formu.address.number = this.address.street_number

        return this.formu.address.number
      },
      set(value) {
        this.formu.address.number = value
      },
    },
    postal_code: {
      get() {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.formu.address.cp = this.address.postal_code

        return this.formu.address.cp
      },
      set(value) {
        this.formu.address.cp = value
      },
    },
    latitude: {
      get() {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.formu.latitud = this.address.latitude

        return this.formu.latitud
      },
      set(value) {
        this.formu.latitud = value
      },
    },
    longitude: {
      get() {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.formu.longitud = this.address.longitude

        return this.formu.longitud
      },
      set(value) {
        this.formu.longitud = value
      },
    },
    nameErrors() {
      const errors = []
      if (!this.$v.formu.name.$dirty) return errors
      !this.$v.formu.name.required && errors.push('Este campo es obligatiorio.')
      return errors
    },
    pisoErrors() {
      const errors = []
      if (!this.$v.formu.address.piso.$dirty) return errors
      !this.$v.formu.address.piso.maxLength &&
        errors.push('El campo Piso, no puede tener mas de 3 caracteres.')
      return errors
    },
    dptoErrors() {
      const errors = []
      if (!this.$v.formu.address.dpto.$dirty) return errors
      !this.$v.formu.address.dpto.maxLength &&
        errors.push('El campo Dpto, no puede tener mas de 3 caracteres.')
      return errors
    },
  },
  methods: {
    getAddressData(addressData, placeResultData, id) {
      try {
        this.address = addressData
      } catch (error) {
        alert(error)
      }
    },
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
        this.$v.$touch()
        if (!this.$v.$invalid) {
          this.loading = true
          await this.$store.dispatch(
            'administracion/branch/createResource',
            this.formu
          )
          this.close()
          await this.$notify({
            group: 'success',
            title: 'Usuario creado!',
            text: `<b>${this.formu.name}</b> fue creado con éxito!`,
          })
        }
      } catch (error) {
        if (error.response.status === 403) {
          await this.$notify({
            group: 'error',
            title: 'No Autorizado',
            text: 'Usted no esta Autorizado para realizar esta acción',
          })
        } else {
          await this.$notify({
            group: 'error',
            title: 'Error',
            text: 'Ocurrió un error en el servidor, intentelo de nuevo mas tarde..',
          })
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
        await this.$notify({
          group: 'success',
          title: 'Usuario Actualiado!',
          text: `<b>${this.formu.username}</b> fue actualizado con éxito!`,
        })
      } catch (error) {
        if (error.response.status === 403) {
          await this.$notify({
            group: 'error',
            title: 'No Autorizado',
            text: 'Usted no esta Autorizado para realizar esta acción',
          })
        } else {
          await this.$notify({
            group: 'error',
            title: 'Error',
            text: 'Ocurrió un error en el servidor, intentelo de nuevo mas tarde..',
          })
        }
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