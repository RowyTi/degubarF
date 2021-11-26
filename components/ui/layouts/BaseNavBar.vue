<template>
  <div>
    <v-app-bar
      app
      :dark="$vuetify.theme.dark"
      :color="!$vuetify.theme.dark ? 'white' : ''"
      flat
      height="64"
    >
      <v-app-bar-nav-icon class="primary--text" @click.stop="openDrawer" />
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
        nombre: 'administración',
        permission: 'administracion',
        subMenu: [
          {
            id: 1,
            nombre: 'Usuario',
            slug: 'db-admin/administracion/usuarios',
            icon: 'account',
            permission: 'index:user',
          },
          {
            id: 2,
            nombre: 'Staff',
            slug: 'db-admin/administracion/staff',
            icon: 'account',
            permission: 'index:staff',
          },
          // {
          //   id: 3,
          //   nombre: 'Roles',
          //   slug: 'db-admin/administracion/roles-y-permisos',
          //   icon: 'account-lock',
          //   permission: 'index:role',
          // },
          {
            id: 4,
            nombre: 'Clientes',
            slug: 'db-admin/administracion/clientes',
            icon: 'store',
            permission: 'index:customer',
          },
          {
            id: 5,
            nombre: 'Categorias',
            slug: 'db-admin/administracion/categorias',
            icon: 'shape',
            permission: 'index:category',
          },
          {
            id: 6,
            nombre: 'Mesas',
            slug: 'db-admin/administracion/mesas',
            icon: 'table-chair',
            permission: 'index:category',
          },
        ],
      },
      /* {
                nombre: 'gestión',
                permission: 'gestion',
                subMenu:[
                    { id: 4, nombre: 'Productos', slug: 'gestion/productos', icon: 'swap-horizontal-bold', permission: 'index:product' },
                    { id: 5, nombre: 'Sucursales' , slug: 'administracion/3', icon: 'format-list-text'},
                ],
            },
            {
                nombre: 'subtitulo 2',
                permission: 'subtitulo',
                subMenu:[
                { id: 7, nombre: 'Item 4', slug: 'administracion/1', icon: 'account' },
                ],
            }, */
    ],
  }),
  computed: {
    ...mapGetters(['isAuthenticated', 'user']),
    nameBranch() {
      return this.user.branch === null
        ? 'Administrador Degubar'
        : this.user.branch.name
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
      await this.$auth.logout()
    },
  },
}
</script>

<style>
</style>