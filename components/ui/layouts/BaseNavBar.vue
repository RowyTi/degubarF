<template>
  <div>
    <v-app-bar app color="amber accent-4">
      <v-app-bar-nav-icon @click.stop="openDrawer">
        <v-icon v-text="'mdi-dots-vertical'" />
      </v-app-bar-nav-icon>
      <v-toolbar-title class="text-body-1" v-text="nameBranch" />
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
        permission: 'index:dashboard',
      },
      {
        name: 'Categorias',
        slug: '/db-admin/administracion/categorias',
        icon: 'shape',
        permission: 'index:category',
      },
      {
        name: 'Mi Negocio',
        slug: '/db-admin/administracion/mi-negocio',
        icon: 'store',
        permission: 'index:branch',
      },
      {
        name: 'Clientes',
        slug: '/db-admin/administracion/clientes',
        icon: 'store',
        permission: 'index:customer',
      },
      {
        name: 'Staff',
        slug: '/db-admin/administracion/staff',
        icon: 'account',
        permission: 'index:staff',
      },
      {
        name: 'Usuario',
        slug: '/db-admin/administracion/usuarios',
        icon: 'account',
        permission: 'index:user',
      },
      {
        name: 'Permisos',
        slug: '/db-admin/administracion/permisos',
        icon: 'account-lock',
        permission: 'index:permission',
      },
      {
        name: 'Mesas',
        slug: '/db-admin/administracion/mesas',
        icon: 'table-chair',
        permission: 'index:table',
      },
      {
        name: 'Productos',
        slug: '/db-admin/administracion/productos',
        icon: 'silverware',
        permission: 'index:product',
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

<style>
</style>