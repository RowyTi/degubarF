<template>
  <v-navigation-drawer
    app
    fixed
    v-bind="$attrs"
    v-on="$listeners"
  >
    <v-list class="pt-0" nav dense>
      <v-list-item class="" two-line style="height: 64px !important">
        <v-list-item-avatar tile>
          <!-- <img :src="userFoto" /> -->
          <img src="/images/logo.png" alt="logo" />
        </v-list-item-avatar>

        <v-list-item-content class="pb-1">
          <v-list-item-title class="font-weight-medium text-uppercase">
           CERVELAR
          </v-list-item-title>
          <v-list-item-subtitle>Palermo Soho</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider class="mb-4"/>
      <v-list-item to="/dashboard" exact exact-active-class="link">
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>

        <v-list-item-title class="text-overline">Dashboard</v-list-item-title>
      </v-list-item>

      <template v-for="(m, index ) in menu" >
        <template v-if="$auth.hasScope(m.permission) || 'super-admin'">
          <v-subheader class="text-overline" :key="index">{{m.nombre}}</v-subheader>
          <template v-for="sm in m.subMenu" >
            <v-list-item
            v-if="$auth.hasScope( ''+sm.permission ) || 'super-admin'"
            :key="sm.i"
            :to="'/' + sm.slug" exact exact-active-class="link" class="mx-auto">
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
        </template>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "BaseDrawer",
  props: {
    menu: {
      type: Array,
      require: true
    }
  },
  data: () => ({
    mini: false,
    expand: true
  }),
  watch: {
    miniMode(newValue) {
      localStorage.setItem("mini_mode", newValue);
    },
    $route(to, from) {
      this.expand_locations = to.path.includes("/location/");
    }
  },
  computed: {
    miniMode: {
      get() {
        return this.mini;
      },
      set(value) {
        return value;
      }
    },
  },
  methods: {
    quitarTilde(cadena) {
      const acentos = {
        á: "a",
        é: "e",
        í: "i",
        ó: "o",
        ú: "u",
        Á: "A",
        É: "E",
        Í: "I",
        Ó: "O",
        Ú: "U"
      };
      return cadena
        .split("")
        .map(letra => acentos[letra] || letra)
        .join("")
        .toString();
    }
  },
  mounted() {
    const mini = localStorage.getItem("mini_mode");
    if (mini) {
      if (mini === "true") {
        this.mini = true;
      } else {
        this.mini = false;
      }
    }
  }
};
</script>