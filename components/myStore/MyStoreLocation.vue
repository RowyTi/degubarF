<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <div class="d-flex">
        <v-icon color="primary" class="mr-2">mdi-store-marker</v-icon>
        <h2 class="text-overline">Geolocalización</h2>
      </div>
      <template #actions>
        <v-icon color="primary"> $expand </v-icon>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-container>
        <v-row>
          <v-col
            v-show="!loading"
            cols="12"
            sm="10"
            md="8"
            lg="6"
            class="mx-auto mt-10"
          >
            <vuetify-google-autocomplete
              id="map"
              ref="gmaps"
              prepend-inner-icon="mdi-map-marker"
              outlined
              clearable
              label="Buscar Dirección"
              classname="form-control"
              hint="Seleccionar la dirección cuando aparezca"
              country="ar"
              @placechanged="getAddressData"
            >
              <template #prepend-inner>
                <v-icon>mdi-map-marker</v-icon>
              </template>
            </vuetify-google-autocomplete>
            <v-text-field
              v-model="street"
              label="Calle"
              outlined
              :error-messages="streetErrors"
              @input="$v.form.street.$touch()"
              @blur="$v.form.street.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="street_number"
              label="Número"
              outlined
              :error-messages="numberErrors"
              @input="$v.form.number.$touch()"
              @blur="$v.form.number.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="postal_code"
              label="Código Postal"
              outlined
            ></v-text-field>

            <v-text-field
              v-model="latitude"
              label="Latitud"
              disabled
              outlined
              :error-messages="latitudeErrors"
              @input="$v.form.latitude.$touch()"
              @blur="$v.form.latitude.$touch()"
            ></v-text-field>
            <v-text-field
              v-model="longitude"
              label="Longitud"
              disabled
              outlined
              :error-messages="longitudeErrors"
              @input="$v.form.longitude.$touch()"
              @blur="$v.form.longitude.$touch()"
            ></v-text-field>
          </v-col>
          <v-col v-if="loading" cols="12">
            <v-sheet height="500" class="d-flex align-center justify-center">
              <v-progress-circular
                v-show="loading"
                indeterminate
                color="primary"
              ></v-progress-circular>
            </v-sheet>
          </v-col>

          <v-col cols="12" class="d-flex justify-end">
            <!-- || $v.$anyError -->
            <v-btn
              color="success"
              type="submit"
              :disabled="loading || $v.$anyError"
              :loading="loading"
              @click="updateAddress"
              >actualizar</v-btn
            >
          </v-col>
        </v-row>
      </v-container>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapState } from 'vuex'
import { required, numeric } from 'vuelidate/lib/validators'
export default {
  name: 'MyStoreLocation',
  data: () => ({
    gmaps: null,
    loading: false,
    form: {
      street: '',
      number: '',
      cp: '',
      latitude: '',
      longitude: '',
    },
  }),
  computed: {
    ...mapState('administracion/branch', ['address']),
    street: {
      get() {
        const street =
          this.gmaps !== null
            ? // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              (this.form.street = this.gmaps.route)
            : this.form.street

        return street
      },
      set(value) {
        this.form.street = value
      },
    },
    street_number: {
      get() {
        const number =
          this.gmaps !== null
            ? // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              (this.form.number = this.gmaps.street_number)
            : this.form.number

        return number
      },
      set(value) {
        this.form.number = value
      },
    },
    postal_code: {
      get() {
        const postalCode =
          this.gmaps !== null
            ? // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              (this.form.cp = this.gmaps.postal_code)
            : this.form.cp

        return postalCode
      },
      set(value) {
        this.form.cp = value
      },
    },
    latitude: {
      get() {
        const latitude =
          this.gmaps !== null
            ? // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              (this.form.latitude = this.gmaps.latitude.toString())
            : this.form.latitude

        return latitude
      },
      set(value) {
        this.form.latitude = value
      },
    },
    longitude: {
      get() {
        const longitude =
          this.gmaps !== null
            ? // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              (this.form.longitude = this.gmaps.longitude.toString())
            : this.form.longitude

        return longitude
      },
      set(value) {
        this.form.longitude = value
      },
    },
    // FORM VALIDATION
    streetErrors() {
      const errors = []
      if (!this.$v.form.street.$dirty) return errors
      !this.$v.form.street.required && errors.push('Este campo es requerido.')
      return errors
    },
    numberErrors() {
      const errors = []
      if (!this.$v.form.number.$dirty) return errors
      !this.$v.form.number.required && errors.push('Este campo es requerido.')
      !this.$v.form.number.numeric &&
        errors.push('Este campo admite solo números.')
      return errors
    },
    latitudeErrors() {
      const errors = []
      if (!this.$v.form.latitude.$dirty) return errors
      !this.$v.form.latitude.required && errors.push('Este campo es requerido.')
      return errors
    },
    longitudeErrors() {
      const errors = []
      if (!this.$v.form.longitude.$dirty) return errors
      !this.$v.form.longitude.required &&
        errors.push('Este campo es requerido.')
      return errors
    },
  },
  validations: {
    form: {
      street: {
        required,
      },
      number: {
        required,
        numeric,
      },
      latitude: {
        required,
      },
      longitude: {
        required,
      },
    },
  },
  mounted() {
    this.getAddressBranch()
  },
  methods: {
    getAddressData(addressData, placeResultData, id) {
      this.gmaps = addressData
    },
    async getAddressBranch() {
      try {
        await this.$store.dispatch(
          'administracion/branch/getAddress',
          this.$auth.user.branch.id
        )
        this.form = Object.assign({}, this.address)
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
        } else if (error.request) {
          this.$toast.error('Ocurrio un problema al cargar la dirección')
        } else {
          this.$toast.error('Ocurrio un problema al cargar la dirección')
        }
      }
    },
    async updateAddress() {
      try {
        this.loading = true
        this.$v.$touch()
        if (!this.$v.$invalid) {
          await this.$store.dispatch(
            'administracion/address/updateResource',
            this.form
          )
          await this.$toast.success(`La dirección fue actualizada con éxito!`, {
            icon: 'mdi-checkbox-marked-circle-outline',
          })
          this.$refs.gmaps.clear()
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
        } else if (error.request) {
          this.$toast.error('Ocurrio un problema al actualizar la dirección')
        } else {
          this.$toast.error('Ocurrio un problema al actualizar la dirección')
        }
      } finally {
        setTimeout(() => {
          this.loading = false
        }, 1000)
      }
    },
  },
}
</script>

<style>
</style>