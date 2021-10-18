<template>
    <div>
        <v-app-bar app :dark="$vuetify.theme.dark" :color="!$vuetify.theme.dark ? 'white':''" flat height="64">
        <v-app-bar-nav-icon class="primary--text" @click.stop="openDrawer"/>
        <v-toolbar-title class="text-body-1"> Cervelar Recoleta </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon x-large  class="mr-2">
            <v-avatar color="primary" size="48" elevation="10">
                <!-- consultar si tiene imagen de perfil -->
                <!-- <img :src="userFoto" alt="foto de usuario" />-->
                <!-- else => muestro iniciales del usuario -->
                <span class="white--text">
                    {{iniciales}}
                </span>
        </v-avatar>
      </v-btn>
    </v-app-bar>

    <base-drawer v-model="drawer" :menu="menu"/>
        
    </div>

</template>

<script>
import { mapGetters } from "vuex";
import BaseDrawer from './BaseDrawer.vue';
export default {
    name: "BaseNavBar",
    components: { BaseDrawer },
    data: () => ({
        iniciales: "RT",
        drawer: true,
        menu: [
            {
                nombre: 'administración',
                permission: 'super:admin',
                subMenu:[
                    { id: 1, nombre: 'Usuario', slug: 'administracion/usuarios', icon: 'account', permission: 'view-usuarios' },
                    { id: 2, nombre: 'Roles' , slug: 'administracion/roles-y-permisos', icon: 'account-lock', permission: 'view-roles'},
                    { id: 3, nombre: 'Efectos' , slug: 'administracion/efecto', icon: 'archive', permission: 'view-efectos'},
                    { id: 4, nombre: 'Inventario', slug: 'administracion/inventario', icon: 'clipboard-list', permission: 'view-inventarios' },
                ],
            },
            {
                nombre: 'gestión',
                permission: 'gestion',
                subMenu:[
                {
                    id: 5,
                    nombre: 'Movimiento de efectos',
                    slug: 'gestion/movimiento-de-efectos',
                    icon: 'swap-horizontal-bold',
                    permission: 'view-entrega-recepcion'
                },
                { id: 6, nombre: 'Item 3' , slug: 'administracion/3', icon: 'format-list-text'},
                ],
            },
            {
                nombre: 'subtitulo 2',
                permission: 'subtitulo',
                subMenu:[
                { id: 7, nombre: 'Item 4', slug: 'administracion/1', icon: 'account' },
                ],
            },
        ],
    }),
    computed: {
        ...mapGetters(["isAuthenticated", "user"]),
        // nombreCompleto() {
        //     return this.user.first_name + " " + this.user.last_name;
        // },
        // iniciales(){
        //     return this.inicial(this.nombreCompleto)
        // }
    },
    methods: {
        openDrawer(){
            this.drawer = !this.drawer
        }
    }
}
</script>

<style>

</style>