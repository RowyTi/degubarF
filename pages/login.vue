<template>
  <v-row align="center" justify="center" class="bg">
    <v-col cols="12" class="d-flex justify-center">
      <v-card
        class="elevation-5 px-10 py-10"
        rounded="xl"
        light
        color="white"
        width="100%"
        max-width="500"
        min-width="360"
      >
        <div class="text-center">
          <h1 class="text-h3 text-md-h4 pl-3 font-weight-light">
            Bienvenido a
            <span class="mx-auto primary--text font-weight-black"> Degubar</span
            >!
          </h1>
          <v-card-subtitle
            class="mt-0 pt-0"
            v-text="'Administrá tu negocio de forma rápida e intuitiva'"
          />
        </div>

        <v-form lazy-validation @submit.prevent="login()">
          <v-card-text class="">
            <v-text-field
              v-model="form.username"
              label="Usuario"
              class="font-weight-light"
              :error-messages="usernameErrors"
              @input="$v.form.username.$touch()"
              @blur="$v.form.username.$touch()"
            />
            <v-text-field
              v-model="form.password"
              class="font-weight-light"
              :type="showPassword ? 'text' : 'password'"
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
              type="submit"
              :loading="loading"
              color="primary"
              :disabled="loading || $v.$anyError"
              >Iniciar Sesión</v-btn
            >
          </v-card-actions>
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
        errors.push('No puedes iniciar sesión sin un usuario!')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.form.password.$dirty) return errors
      !this.$v.form.password.required &&
        errors.push('La contraseña es obligatoria.')
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
          if (this.$auth.hasScope('dashboard:kitchen')) {
            await this.$router.push({
              path: '/db-admin/administracion/comanda',
            })
          } else {
            await this.$router.push({ path: '/db-admin/dashboard' })
          }
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 422) {
            this.errors = error.response.data.errors.username[0]
          }
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
        } else if (error.request) {
          this.$toast.error(
            `Ocurrió un problema al cargar sus datos de usuario`
          )
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.bg {
  min-height: 100vh;
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(
    to right bottom,
    #f4511e,
    #f76820,
    #f97c26,
    #fb8f2e,
    #fda13a,
    #fda83c,
    #feaf3e,
    #feb641,
    #fdb537,
    #fcb42b,
    #fbb41c,
    #fab300
  );
}
.glass {
  /* From https://css.glass */
  background: rgba(255, 255, 255, 0.87);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8.9px);
  -webkit-backdrop-filter: blur(8.9px);
}
</style>
