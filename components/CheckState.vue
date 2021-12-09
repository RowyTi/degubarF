<template>
  <!-- v-show="state || $nuxt.isOffline" -->
  <v-overlay v-show="state" :absolute="false" :z-index="99999"
    ><v-sheet v-if="state" rounded elevation="10" class="pa-10">
      <v-row align="center">
        <v-col cols="12">
          <h6>Su sesión expiró, ingrese nuevamente</h6>
          <v-form>
            <v-row>
              <v-col cols="2">
                <v-avatar :src="$auth.user.avatar">
                  <v-icon v-if="$auth.user.avatar === null">
                    mdi-account
                  </v-icon>
                </v-avatar>
              </v-col>
              <v-col cols="10"
                ><span class="text-overline">{{
                  $auth.user.username
                }}</span></v-col
              >
              <v-col cols="2"></v-col>
              <v-col cols="10">
                <v-text-field
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  label="Contraseña"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  @keyup.enter="login"
                />
                <span
                  v-if="errors"
                  class="mx-auto error--text text-caption text-center"
                >
                  {{ errors }}
                </span>
              </v-col>
            </v-row>

            <!-- <v-text-field
              v-model="$auth.user.username"
              outlined
              label="Usuario"
              disabled
            /> -->

            <v-btn
              class="mx-auto"
              :loading="loading"
              color="primary"
              :disabled="loading"
              @click="login"
              >Iniciar Sesión</v-btn
            >

            <!-- :disabled="$nuxt.isOffline || loading" -->
          </v-form>
        </v-col>
        <!-- <v-col class="grow text-overline font-weight-bold">
          Tu sesión expiró, por favor vuelva a ingresar.
        </v-col>
        <v-col class="shrink">
          <v-btn @click="clear">Login</v-btn>
        </v-col> -->
      </v-row>
    </v-sheet>
    <v-alert v-else prominent type="warning" rounded elevation="10">
      <v-row align="center">
        <v-col class="grow text-overline font-weight-bold">
          No tienes Internet, revisa tu conexión
        </v-col>
      </v-row>
    </v-alert>
  </v-overlay>
</template>

<script>
export default {
  name: 'CheckState',
  data: () => ({
    stateId: null,
    state: true,
    password: '',
    loading: false,
    errors: '',
    showPassword: '',
  }),
  computed: {
    expiredToken: {
      get() {
        return this.state
      },
      set(value) {
        this.state = value
        return this.state
      },
    },
  },
  watch: {
    expiredToken(newValue) {
      if (newValue === true) {
        clearInterval(this.stateId)
        // console.info('sesión expirada')
      }
    },
  },
  mounted() {
    // this.checkState()
  },
  methods: {
    clear() {
      this.$router.push({ path: '/login' })
    },
    checkState() {
      this.stateId = setInterval(() => {
        this.expiredToken = this.$auth.strategy.token.status().expired()
        // console.log(this.expiredToken)
      }, 1500)
    },
  },
}
</script>

<style></style>
