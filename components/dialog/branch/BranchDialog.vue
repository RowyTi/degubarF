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
        <v-btn icon x-small color="primary" @click="closeShow">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
      <template #body class="pa-0">
        <v-container fluid class="mt-0 pt-0">
          <v-tabs vertical>
            <v-tab>
              <v-icon left> mdi-store </v-icon>
              Mi negocio
            </v-tab>
            <v-tab>
              <v-icon left> mdi-map-marker-account </v-icon>
              Dirección
            </v-tab>
            <v-tab-item>
              <!-- perfil de local -->
              <v-card flat>
                <v-card-text class="py-0">
                  <v-list>
                    <base-list-item-content
                      :avatar="true"
                      :avatar-link="imgUrl + form.logo"
                      :logo="form.logo !== null"
                      title="Nombre"
                      :subtitle="form.name"
                    />
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title
                          class="text-overline"
                          v-text="ratingTitle"
                        />
                        <v-rating
                          v-model="formu.rating"
                          color="yellow darken-3"
                          background-color="grey lighten-2"
                          empty-icon="$ratingFull"
                          half-increments
                          readonly
                        />
                      </v-list-item-content>
                    </v-list-item>
                    <base-list-item-content
                      title="Estado"
                      :subtitle="form.state"
                    />
                    <base-list-item-content
                      title="Fecha de Alta"
                      :subtitle="form.createdAt"
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
                      <v-col cols="6">
                        <base-list-item-content
                          title="Calle"
                          :subtitle="
                            form.address && form.address.street
                              ? form.address.street
                              : 'sin completar'
                          "
                        />
                      </v-col>
                      <v-col cols="6">
                        <base-list-item-content
                          title="Número"
                          :subtitle="
                            form.address && form.address.number
                              ? form.address.number
                              : 'sin completar'
                          "
                        />
                      </v-col>
                      <v-col cols="6">
                        <base-list-item-content
                          title="Piso"
                          :subtitle="
                            form.address && form.address.piso
                              ? form.address.piso
                              : 's/n'
                          "
                        />
                      </v-col>
                      <v-col cols="6">
                        <base-list-item-content
                          title="Dpto"
                          :subtitle="
                            form.address && form.address.dpto
                              ? form.address.dpto
                              : 's/n'
                          "
                        />
                      </v-col>
                      <v-col cols="6">
                        <base-list-item-content
                          title="CP"
                          :subtitle="
                            form.address && form.address.cp
                              ? form.address.cp
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
      </template>
    </base-card>
    <!-- create & edit -->
    <v-form
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
                        @input="delayTouch($v.formu.slug)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-text-field
                        v-model="formu.slug"
                        hidden
                        disabled
                        class="d-none"
                        @input="delayTouch($v.formu.slug)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="pb-0">
                      <v-select
                        v-model="formu.state"
                        label="Estado"
                        :items="itemState"
                        :item-text="itemState.text"
                        :item-value="itemState.value"
                        :item-color="itemState.color"
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
const touchMap = new WeakMap()
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
    name: {
      type: String,
      default: '',
      required: false,
    },
    slug: {
      type: String,
      default: '',
      required: false,
    },
  },
  data: () => ({
    address: null,
    stepper: 1,
    itemState: [
      {
        text: 'Inactivo',
        value: 'inactivo',
      },
      {
        text: 'Activo',
        value: 'activo',
      },
    ],
    loading: false,
    loadingSearch: false,
    options: {
      page: 1,
      itemsPerPage: 10,
    },
    defaultForm: {
      name: '',
      slug: '',
      state: 'inactivo',
      address: {
        street: 'test',
        street_number: 'test',
        cp: 'test',
        piso: '',
        dpto: '',
        longitude: '',
        latitude: '',
      },
    },
  }),
  validations: {
    formu: {
      name: {
        required,
      },
      slug: {
        required,
        async isUnique(value) {
          if (value === '') return true
          if (value === this.slug) return true
          const res = await this.$axios.$get(`branch-validate/${value}`)
          return !res.valido
        },
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
    imgUrl() {
      return process.env.BASE_IMG_URL
    },
    formu() {
      return this.form
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Cliente Nuevo' : 'Editar  ' + this.name
    },
    btnForm() {
      return this.editedIndex === -1 ? 'Guardar' : 'Actualizar '
    },
    ratingTitle() {
      const title = 'Rating (' + this.formu.rating + ')'
      return title
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
        const street =
          this.address !== null
            ? // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              (this.formu.address.street = this.address.route)
            : this.formu.address.street

        return street
      },
      set(value) {
        this.formu.address.street = value
      },
    },
    street_number: {
      get() {
        const number =
          this.address !== null
            ? // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              (this.formu.address.number = this.address.street_number)
            : this.formu.address.number

        return number
      },
      set(value) {
        this.formu.address.number = value
      },
    },
    postal_code: {
      get() {
        const postalCode =
          this.address !== null
            ? // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              (this.formu.address.cp = this.address.postal_code)
            : this.formu.address.cp

        return postalCode
      },
      set(value) {
        this.formu.address.cp = value
      },
    },
    latitude: {
      get() {
        const latitude =
          this.address !== null
            ? // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              (this.formu.address.latitude = this.address.latitude.toString())
            : this.formu.address.latitude

        return latitude
      },
      set(value) {
        this.formu.address.latitude = value
      },
    },
    longitude: {
      get() {
        const longitude =
          this.address !== null
            ? // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              (this.formu.address.longitude = this.address.longitude.toString())
            : this.formu.address.longitude

        return longitude
      },
      set(value) {
        this.formu.address.longitude = value
      },
    },
    nameErrors() {
      const errors = []
      if (!this.$v.formu.slug.$dirty) return errors
      !this.$v.formu.name.required && errors.push('Este campo es obligatiorio.')
      !this.$v.formu.slug.isUnique &&
        errors.push('El nombre ingresado ya existe!')
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
    closeShow() {
      this.$emit('closeDialog')
    },
    close() {
      this.address = null
      this.$refs.address.clear()
      this.$v.$reset()
      this.stepper = 1
      this.$emit('closeDialog')
    },
    delayTouch($v) {
      $v.$reset()
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v))
      }
      touchMap.set($v, setTimeout($v.$touch, 1000))
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
          this.$toast.success(
            `El cliente ${this.formu.name} fue registrado con éxito!`,
            {
              icon: 'mdi-checkbox-marked-circle-outline',
            }
          )
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
        } else if (error.request) {
          this.$toast.error(
            `Ocurrió un problema al crear el cliente ${this.formu.name}`
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
          'administracion/branch/updateResource',
          this.formu
        )
        this.close()
        this.$toast.success(
          `El cliente ${this.formu.name} fue actualizado con éxito!`,
          {
            icon: 'mdi-checkbox-marked-circle-outline',
          }
        )
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
        } else if (error.request) {
          this.$toast.error(
            `Ocurrió un problema al actualizar el cliente ${this.formu.name}`
          )
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