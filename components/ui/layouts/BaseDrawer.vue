<template>
  <v-navigation-drawer app fixed v-bind="$attrs" v-on="$listeners">
    <v-list class="pt-0" nav dense>
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
      <!-- <v-list-item
        v-if="$auth.hasScope('index:dashboard')"
        to="/db-admin/dashboard"
        exact
        exact-active-class="link"
      >
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>

        <v-list-item-title class="text-overline">Dashboard</v-list-item-title>
      </v-list-item>

      <v-list-item
        v-if="$auth.hasScope('index:dashboard')"
        to="/db-admin/dashboard"
        exact
        exact-active-class="link"
      >
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>

        <v-list-item-title class="text-overline">Dashboard</v-list-item-title>
      </v-list-item> -->

      <!-- <template v-for="(m, index) in menu">
        <template v-if="$auth.hasScope(m.permission)">
          <v-subheader :key="index" class="text-overline">{{
            m.nombre
          }}</v-subheader>
          <template v-for="sm in m.subMenu">
            <v-list-item
              v-if="$auth.hasScope(sm.permission)"
              :key="sm.i"
              :to="'/' + sm.slug"
              exact
              exact-active-class="link"
              class="mx-auto"
            >
              <v-list-item-icon>
                <v-icon v-text="'mdi-' + sm.icon" />
              </v-list-item-icon>
              <v-list-item-title v-text="sm.nombre" />
            </v-list-item>
          </template>

          <v-divider
            v-if="index < menu.length - 1"
            :key="index"
            class="my-2"
          ></v-divider>
        </template>-->
      <!-- </template>  -->
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