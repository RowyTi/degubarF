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
            ></v-text-field>
            <v-text-field
              v-model="street_number"
              label="Número"
              outlined
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
            ></v-text-field>
            <v-text-field
              v-model="longitude"
              label="Longitud"
              disabled
              outlined
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
            <v-btn
              color="success"
              type="submit"
              :disabled="loading"
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
export default {
  name: 'MyStoreLocation',
  props: {
    address: {
      type: Object,
      require: true,
      default: () => {},
    },
  },
  data: () => ({
    location: {},
    gmaps: null,
    loading: false,
  }),

  computed: {
    formData() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.location = Object.assign({}, this.address)
      return this.location
    },
    street: {
      get() {
        const street =
          this.gmaps !== null
            ? // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              (this.formData.street = this.gmaps.route)
            : this.formData.street

        return street
      },
      set(value) {
        this.formData.street = value
      },
    },
    street_number: {
      get() {
        const number =
          this.gmaps !== null
            ? // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              (this.formData.number = this.gmaps.street_number)
            : this.formData.number

        return number
      },
      set(value) {
        this.formData.number = value
      },
    },
    postal_code: {
      get() {
        const postalCode =
          this.gmaps !== null
            ? // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              (this.formData.cp = this.gmaps.postal_code)
            : this.formData.cp

        return postalCode
      },
      set(value) {
        this.formData.cp = value
      },
    },
    latitude: {
      get() {
        const latitude =
          this.gmaps !== null
            ? // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              (this.formData.latitude = this.gmaps.latitude.toString())
            : this.formData.latitude

        return latitude
      },
      set(value) {
        this.formData.latitude = value
      },
    },
    longitude: {
      get() {
        const longitude =
          this.gmaps !== null
            ? // eslint-disable-next-line vue/no-side-effects-in-computed-properties
              (this.location.longitude = this.gmaps.longitude.toString())
            : this.location.longitude

        return longitude
      },
      set(value) {
        this.location.longitude = value
      },
    },
  },
  mounted() {},
  methods: {
    getAddressData(addressData, placeResultData, id) {
      this.gmaps = addressData
    },
    async updateAddress() {
      try {
        this.loading = true
        await this.$store.dispatch(
          'administracion/address/updateResource',
          this.formData
        )
        await this.$toast.success(`La dirección fue actualizada con éxito!`, {
          icon: 'mdi-checkbox-marked-circle-outline',
        })
        this.$refs.gmaps.clear()
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
        this.loading = false
      }
    },
  },
}
</script>

<style>
</style>