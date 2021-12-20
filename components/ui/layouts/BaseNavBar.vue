<template>
  <div>
    <v-app-bar app color="amber accent-4" flat>
      <v-app-bar-nav-icon @click.stop="openDrawer">
        <v-icon v-if="drawer" v-text="'mdi-backburger'" />
        <v-icon v-else v-text="'mdi-backburger'" class="rotate-180"></v-icon>
      </v-app-bar-nav-icon>
      <!-- <v-toolbar-title class="text-body-1" v-text="nameBranch" /> -->
      <v-spacer></v-spacer>
      <v-btn icon class="mr-2" @click="logout">
        <v-icon>mdi-logout-variant</v-icon>
        <!--  <v-avatar color="primary" size="48" elevation="10">
                 consultar si tiene imagen de perfil
                <img :src="userFoto" alt="foto de usuario" />
                 else => muestro iniciales del usuario
                <span class="white--text">
                    {{iniciales}}
                </span>
            </v-avatar>  -->
      </v-btn>
    </v-app-bar>

    <base-drawer v-model="drawer" :menu="menu" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BaseDrawer from './BaseDrawer.vue'
export default {
  name: 'BaseNavBar',
  components: { BaseDrawer },
  data: () => ({
    iniciales: 'RT',
    drawer: true,
    menu: [
      {
        name: 'Dashboard',
        slug: '/db-admin/dashboard',
        icon: 'view-dashboard',
        permission: 'dashboard',
      },
      {
        name: 'Categorias',
        slug: '/db-admin/administracion/categorias',
        icon: 'shape',
        permission: 'dashboard:category',
      },
      {
        name: 'Mi Negocio',
        slug: '/db-admin/administracion/mi-negocio',
        icon: 'store-cog',
        permission: 'dashboard:branch',
      },

      {
        name: 'Mis Ordenes',
        slug: '/db-admin/administracion/ordenes',
        icon: 'format-list-bulleted-square',
        permission: 'dashboard:order',
      },
      {
        name: 'Clientes',
        slug: '/db-admin/administracion/clientes',
        icon: 'store',
        permission: 'dashboard:customer',
      },
      {
        name: 'Staff',
        slug: '/db-admin/administracion/staff',
        icon: 'account',
        permission: 'dashboard:staff',
      },
      {
        name: 'Usuario',
        slug: '/db-admin/administracion/usuarios',
        icon: 'account',
        permission: 'dashboard:user',
      },
      {
        name: 'Permisos',
        slug: '/db-admin/administracion/permisos',
        icon: 'account-lock',
        permission: 'dashboard:permission',
      },
      {
        name: 'Mesas',
        slug: '/db-admin/administracion/mesas',
        icon: 'table-chair',
        permission: 'dashboard:table',
      },
      {
        name: 'Productos',
        slug: '/db-admin/administracion/productos',
        icon: 'silverware',
        permission: 'dashboard:product',
      },
      {
        name: 'Comanda',
        slug: '/db-admin/administracion/comanda',
        icon: 'order-bool-ascending-variant',
        permission: 'dashboard:product',
      },
    ],
  }),
  computed: {
    ...mapGetters(['isAuthenticated', 'user']),
    nameBranch() {
      if (this.isAuthenticated && this.user.branch !== null) {
        return this.user.branch.name
      } else {
        return 'Administrador Degubar'
      }
    },
    // nombreCompleto() {
    //     return this.user.first_name + " " + this.user.last_name;
    // },
    // iniciales(){
    //     return this.inicial(this.nombreCompleto)
    // }
  },
  methods: {
    openDrawer() {
      this.drawer = !this.drawer
    },
    async logout() {
      const res = await this.$confirm('Está seguro que desea salir?', {
        title: 'Cerrar Sesión',
        icon: 'mdi-logout',
        buttonTrueText: 'Salir',
      })
      if (res) {
        await this.$auth.logout()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.rotate-180 {
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
  transition: all 0.5s ease-in-out;
}
</style>