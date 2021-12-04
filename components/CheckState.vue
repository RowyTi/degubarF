<template>
  <v-overlay
    v-show="state || $nuxt.isOffline"
    :absolute="false"
    :z-index="99999"
    ><v-alert v-if="state" prominent type="info" rounded elevation="10">
      <v-row align="center">
        <v-col class="grow text-overline font-weight-bold">
          Tu sesión expiró, por favor vuelva a ingresar.
        </v-col>
        <v-col class="shrink">
          <v-btn @click="clear">Login</v-btn>
        </v-col>
      </v-row>
    </v-alert>
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
    state: false,
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
        console.info('sesión expirada')
      }
    },
  },
  mounted() {
    this.checkState()
  },
  methods: {
    clear() {
      this.$router.push({ path: '/login' })
    },
    checkState() {
      this.stateId = setInterval(() => {
        this.expiredToken = this.$auth.strategy.token.status().expired()
        console.log(this.expiredToken)
      }, 1500)
    },
  },
}
</script>

<style></style>
