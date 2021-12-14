<template>
  <v-row align="center" justify="center">
    <!--    IMAGEN -->
    <v-col cols="12" md="8" class="pa-0 ma-0" style="background-color: black">
      <v-img
        src="/images/logo-degubar.png"
        height="100vh"
        contain
        class="pt-1"
      />
    </v-col>
    <!--    LOGIN FORM-->
    <v-col
      cols="12"
      md="4"
      class="d-flex align-center justify-center full-height"
    >
      <v-card class="elevation-0 pa-1" light height="" color="white">
        <!-- <v-alert v-show="error.status" type="error">{{ error.texto }}</v-alert> -->
        <h1 class="text-h3 text-md-h4 pl-3 font-weight-light">
          Bienvenido a
          <span class="mx-auto primary--text font-weight-black"> Degubar</span>!
        </h1>
        <v-card-subtitle
          class="mt-0 pt-0"
          v-text="'Inicie sesión para comenzar a trabajar'"
        />
        <v-form>
          <v-card-text>
            <v-text-field
              v-model="form.username"
              outlined
              label="Usuario"
              :error-messages="usernameErrors"
              @input="$v.form.username.$touch()"
              @blur="$v.form.username.$touch()"
            />
            <v-text-field
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              outlined
              label="Contraseña"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :error-messages="passwordErrors"
              @input="$v.form.password.$touch()"
              @blur="$v.form.password.$touch()"
              @click:append="showPassword = !showPassword"
              @keyup.enter="login"
            />
            <span
              v-if="errors"
              class="mx-auto error--text text-caption text-center"
            >
              {{ errors }}
            </span>
          </v-card-text>

          <v-card-actions>
            <v-btn
              class="mx-auto"
              :loading="loading"
              color="primary"
              :disabled="loading"
              @click="login"
              >Iniciar Sesión</v-btn
            >
          </v-card-actions>
          <!-- :disabled="$nuxt.isOffline || loading" -->
          <v-divider class="mt-5"></v-divider>
        </v-form>
        <div class="text-center">
          <span class="font-weight-light grey--text">v1.0.0</span>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  name: 'Login',
  middleware: 'guest',
  data: () => ({
    form: {
      username: '',
      password: '',
    },
    loading: false,
    errors: '',
    showPassword: '',
  }),
  validations: {
    form: {
      username: {
        required,
      },
      password: {
        required,
      },
    },
  },
  head: {
    title: 'Login',
  },
  computed: {
    usernameErrors() {
      const errors = []
      if (!this.$v.form.username.$dirty) return errors
      !this.$v.form.username.required &&
        errors.push('Este campo es obligatiorio.')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.form.password.$dirty) return errors
      !this.$v.form.password.required &&
        errors.push('Este campo es obligatiorio.')
      return errors
    },
  },
  methods: {
    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    async login() {
      try {
        this.loading = true
        this.$v.$touch()
        if (!this.$v.$invalid) {
          await this.$auth.loginWith('local', { data: this.form })

          await this.$auth.$storage.getUniversal('user')

          await this.$router.push({ path: '/db-admin/dashboard' })
        }
      } catch (err) {
        if (err.response.status === 422) {
          this.errors = err.response.data.errors.username[0]
          return
        }
        this.$toast.global.e500()
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.full-height {
  min-height: 100vh;
  height: 100vh;
  background-color: #fff;
}
</style>
