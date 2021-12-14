<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <div class="d-flex">
        <v-icon color="primary" class="mr-2">mdi-bank</v-icon>
        <h2 class="text-overline">mercado pago</h2>
      </div>

      <template #actions>
        <v-icon color="primary"> $expand </v-icon>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-form
        ref="formulario"
        lazy-validation
        @submit.prevent="
          paymentKey === null ? createResource() : updatePaymentKey()
        "
      >
        <v-container>
          <v-row>
            <v-col
              v-if="addKey"
              cols="12"
              sm="10"
              md="8"
              lg="6"
              class="mx-auto mt-10"
            >
              <v-alert type="info" outlined prominent>
                <v-row align="center">
                  <v-col class="grow">
                    No tienes credenciales registradas.
                  </v-col>
                  <v-col class="shrink">
                    <v-btn color="accent" small @click="addKey = false"
                      >agregar</v-btn
                    >
                  </v-col>
                </v-row>
              </v-alert>
            </v-col>
            <v-expand-transition>
              <v-col v-if="!addKey" cols="12" class="ma-0 pa-0">
                <v-col
                  v-show="!loading"
                  cols="12"
                  sm="10"
                  md="8"
                  lg="6"
                  class="mx-auto mt-10"
                >
                  <v-text-field
                    v-model="form.access_token"
                    label="Access Token"
                    outlined
                  ></v-text-field>
                  <v-text-field
                    v-model="form.public_token"
                    label="Public Token"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col v-if="loading" cols="12">
                  <v-sheet
                    height="200"
                    class="d-flex align-center justify-center"
                  >
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
                    >{{ titleBtn }}</v-btn
                  >
                </v-col>
              </v-col>
            </v-expand-transition>
          </v-row>
        </v-container>
      </v-form>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'MyStorePayment',
  props: {
    data: {
      type: Object,
      require: true,
      default: () => {},
    },
  },
  data: () => ({
    addKey: false,
    form: {
      access_token: '',
      public_token: '',
    },
    loading: false,
  }),

  computed: {
    ...mapState('administracion/paymentkey', ['paymentKey']),

    titleBtn() {
      return this.paymentKey === null ? 'guardar' : 'actualizar'
    },
  },
  mounted() {
    this.getPaymentKey(this.$auth.user.branch.id)
  },
  methods: {
    async getPaymentKey(id) {
      try {
        await this.$store.dispatch(
          'administracion/paymentkey/getPaymentKey',
          id
        )
        this.form = Object.assign({}, this.paymentKey)
        if (this.paymentKey === null) {
          this.addKey = true
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) return this.$toast.global.e500()
          if (error.response.status === 403) return this.$toast.global.e403()
        } else if (error.request) {
          this.$toast.error('Ocurrio un problema al cargar las claves de pago')
        } else {
          this.$toast.error('Ocurrio un problema al cargar las claves de pago')
        }
      }
    },
    async createResource() {
      try {
        // this.$v.$touch()
        // if (!this.$v.$invalid) {
        this.loading = true
        await this.$store.dispatch(
          'administracion/paymentkey/createResource',
          this.form
        )
        await this.$toast.success(`Las claves fueron guardadas con éxito!`, {
          icon: 'mdi-checkbox-marked-circle-outline',
        })
        // }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) return this.$toast.global.e500()
          if (error.response.status === 403) return this.$toast.global.e403()
        } else if (error.request) {
          this.$toast.error('Ocurrio un problema al crear las claves de pago')
        } else {
          this.$toast.error('Ocurrio un problema al crear las claves de pago')
        }
      } finally {
        this.loading = false
      }
    },
    async updatePaymentKey() {
      try {
        this.loading = true
        await this.$store.dispatch(
          'administracion/paymentkey/updateResource',
          this.form
        )
        await this.$toast.success(`Las claves fueron actualizadas con éxito!`, {
          icon: 'mdi-checkbox-marked-circle-outline',
        })
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) return this.$toast.global.e500()
          if (error.response.status === 403) return this.$toast.global.e403()
        } else if (error.request) {
          this.$toast.error(
            'Ocurrio un problema al actualizar las claves de pago'
          )
        } else {
          this.$toast.error(
            'Ocurrio un problema al actualizar las claves de pago'
          )
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