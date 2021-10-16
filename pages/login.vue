<template>
  <v-row align="center" justify="center">
<!--    IMAGEN -->
    <v-col
      cols="8"
      class="pa-0 ma-0"
    >
      <!-- <v-img
        src="/images/login.jpeg"
        height="100vh"
        cover
      /> -->
    </v-col>
<!--    LOGIN FORM-->
    <v-col
      cols="12"
      sm="8"
      md="4"
      class="d-flex align-center justify-center full-height">
      <v-card
        class=" elevation-0 pa-3"
        light
        height=""
        color="white"
        width="80%"
      >
<!--        <v-alert v-show="error.status" type="error">{{ error.texto }}</v-alert>-->
        <h1 class="text-h3 text-md-h4 pl-3">
          Bienvenido a Degubar!
<!--          <span class="primary&#45;&#45;text font-weight-light"> Audinet</span>!-->
        </h1>
        <v-card-subtitle class="mt-0 pt-0" v-text="'Inicie sesión para comenzar a trabajar'" />
        <v-form>
          <v-card-text>
            <v-text-field v-model="form.username" outlined label="Usuario" />
            <v-text-field
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              outlined
              label="Contraseña"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              @keyup.enter="login"
            />
            <div class="text-right mt-n5">
              <v-btn text color="primary" x-small right
              >Olvidaste la contraseña?</v-btn
              >
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              @click="login"
              class="mx-auto"
              color="primary"
              :loading="loading"
              :disabled="$nuxt.isOffline || loading"
            >Iniciar Sesión</v-btn>
          </v-card-actions>
          <v-divider class="mt-5"></v-divider>
        </v-form>
<!--        <v-list>-->
<!--          <v-list-item v-for="inf in info" :key="inf.i"-->
<!--          ><v-list-item-icon>-->
<!--            <v-icon :color="inf.iconColor" v-text="inf.icon"></v-icon>-->
<!--          </v-list-item-icon>-->
<!--            <v-list-item-content>-->
<!--              <v-list-item-title-->
<!--                class="font-weight-light"-->
<!--                v-text="inf.title"-->
<!--              ></v-list-item-title> </v-list-item-content-->
<!--            ></v-list-item>-->
<!--        </v-list>-->

        <div class="text-center">
          <span class="font-weight-light grey--text ">v1.0.0</span>
        </div>
      </v-card>

    </v-col>
  </v-row>
</template>

<script>
export default {
    name: 'Login',
    middleware: 'guest',
    head: {
      title: "Login"
    },

  data: () => ({
    form: {
      username: "",
      password: ""
    },
    loading: false,
    error: {
      status: false,
      type: "",
      texto: ""
    },
    showPassword: "",
  }),
  methods: {
    capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    async login() {
      try {
        this.loading = true;
        await this.$auth.loginWith("local", { data: this.form })
        await this.$auth.$storage.getUniversal("user");
        await this.$router.push({path: "/db-admin/dashboard"});
      } catch (err) {
          console.log(err);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.full-height {
  min-height: 100vh;
  height: 100vh;
  background-color: #fff;
}
</style>
