<template>
  <v-navigation-drawer app fixed v-bind="$attrs" dark v-on="$listeners">
    <v-list class="pa-0" dense>
      <v-list-item class="" two-line style="height: 64px !important">
        <v-list-item-avatar tile size="58">
          <!-- <img :src="userFoto" /> -->
          <img :src="logoBranch" :alt="altLogoBranch" />
        </v-list-item-avatar>

        <v-list-item-content class="pb-1">
          <v-list-item-title
            class="font-weight-medium text-uppercase"
            v-text="$auth.user.username"
          />
          <v-list-item-subtitle v-text="'Panel de Control'" />
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mb-4" />
      <v-list-item
        v-for="m in menu"
        v-show="$auth.hasScope(m.permission)"
        :key="m.slug"
        :to="m.slug"
        exact
        exact-active-class="link"
      >
        <v-list-item-icon>
          <v-icon v-text="'mdi-' + m.icon" />
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ m.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'BaseDrawer',
  props: {
    menu: {
      type: Array,
      default: () => [],
      require: true,
    },
  },
  data: () => ({
    mini: false,
    expand: true,
  }),
  computed: {
    ...mapGetters(['isAuthenticated', 'user']),
    miniMode: {
      get() {
        return this.mini
      },
      set(value) {
        return value
      },
    },
    logoBranch() {
      if (this.isAuthenticated && this.user.branch !== null) {
        return this.user.branch.logo
      } else {
        return '/images/logo-degubar.png'
      }
    },
    altLogoBranch() {
      if (this.isAuthenticated && this.user.branch !== null) {
        return this.user.branch.name
      } else {
        return 'Logo Degubar'
      }
    },
  },
  watch: {
    miniMode(newValue) {
      localStorage.setItem('mini_mode', newValue)
    },
    $route(to, from) {
      this.expand_locations = to.path.includes('/location/')
    },
  },
  mounted() {
    const mini = localStorage.getItem('mini_mode')
    if (mini) {
      if (mini === 'true') {
        this.mini = true
      } else {
        this.mini = false
      }
    }
  },
  methods: {
    quitarTilde(cadena) {
      const acentos = {
        á: 'a',
        é: 'e',
        í: 'i',
        ó: 'o',
        ú: 'u',
        Á: 'A',
        É: 'E',
        Í: 'I',
        Ó: 'O',
        Ú: 'U',
      }
      return cadena
        .split('')
        .map((letra) => acentos[letra] || letra)
        .join('')
        .toString()
    },
  },
}
</script>
<style>
.link {
  border-left: solid 4px #ffab00 !important;
  color: #e0e0e0 !important;
}
.v-list-item {
  border-left: solid 4px #363636;
}
</style>