<template>
  <v-row justify="center" align="center">
    <v-col cols="12" md="11">
      <base-card :dialog="false">
        <template #rightCardTitle> Administración de Categorias </template>
        <template #leftCardTitle>
          <v-btn color="primary" small @click.stop="dialog = !dialog">
            Nuevo Categoría<v-icon right dark>mdi-shape-plus</v-icon>
          </v-btn>
        </template>
        <template #body>
          <v-data-table
            :headers="headers"
            :items="categories"
            :footer-props="{
              'items-per-page-options': [10, 20, 30],
              'items-per-page-text': 'Filas por página',
            }"
            :options.sync="options"
            :server-items-length="totalData"
            loading-text="Cargando...Espere por favor!"
            :loading="loading"
          >
            <v-alert slot="no-result"> no hay resultados </v-alert>
            <template #[`item.branches`]="{ item }">
              <v-chip
                v-if="item.branches.length < 1"
                color="info"
                small
                label
                outlined
              >
                <v-icon size="small" left> mdi-information </v-icon>
                No hay locales asociados a esta categoría.
              </v-chip>
              <v-chip
                v-for="branch in item.branches"
                v-else
                :key="branch.id"
                label
                x-small
                class="ma-1"
                :color="branch.state === 'inactivo' ? 'error' : 'success'"
              >
                {{ branch.name }}
              </v-chip>
            </template>
            <template #[`item.acciones`]="{ item }">
              <v-btn color="primary" icon x-small @click="showItem(item)">
                <v-icon> mdi-eye </v-icon>
              </v-btn>
              <v-btn color="success" icon x-small @click="editItem(item)">
                <v-icon> mdi-pencil </v-icon>
              </v-btn>
              <v-btn color="error" icon x-small @click="deleteItem(item)">
                <v-icon> mdi-delete </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </template>
        <!-- {{ categories }} -->
      </base-card>
    </v-col>
    <category-dialog
      v-model="dialog"
      :form="form"
      :edited-index="editedIndex"
      :show-mode="showMode"
      @closeDialog="closeDialog"
    />
  </v-row>
</template>

<script>
import { deserialize } from 'jsonapi-fractal'
import { mapState } from 'vuex'
import BaseCard from '~/components/ui/BaseCard.vue'
import CategoryDialog from '~/components/dialog/category/CategoryDialog.vue'
export default {
  name: 'AdministracionDeCategorias',
  components: { BaseCard, CategoryDialog },
  layout: 'admin',
  data: () => ({
    headers: [
      {
        text: 'Categoría',
        sortable: true,
        value: 'name',
      },
      {
        text: 'Locales adheridos',
        sortable: true,
        value: 'branches',
      },
      // {
      //   text: 'Rating',
      //   sortable: false,
      //   value: 'rating',
      // },
      {
        text: 'Ult. Actualización',
        sortable: true,
        value: 'updatedAt',
        width: '11rem',
      },
      {
        text: 'Acciones',
        value: 'acciones',
        sortable: false,
        width: '8rem',
      },
    ],
    form: {
      name: '',
      slug: '',
      branch_id: '',
    },
    defaultForm: {
      name: '',
      slug: '',
      branch_id: '',
    },
    loading: false,
    dialog: false,
    editedIndex: -1,
    showMode: false,
    options: {
      page: 1,
      itemsPerPage: 10,
      sortBy: ['updatedAt'],
      sortDesc: [true],
    },
  }),
  head: {
    title: 'Categorías',
  },
  computed: {
    ...mapState('administracion/category', [
      'categories',
      'category',
      'totalData',
    ]),
  },
  watch: {
    options: {
      handler() {
        this.getData()
      },
    },
    deep: true,
  },
  methods: {
    closeDialog() {
      this.dialog = false
      setTimeout(() => {
        this.$nextTick(() => {
          this.form = Object.assign({}, this.defaultForm)
          this.editedIndex = -1
          this.showMode = false
        })
      }, 500)
    },
    async getData() {
      try {
        this.loading = true
        await this.$store.dispatch(
          'administracion/category/getList',
          this.options
        )
      } catch (error) {
        if (error.response.status === 403)
          alert('Usted no esta Autorizado para realizar esta acción')
      } finally {
        this.loading = false
      }
    },
    async showItem(item) {
      try {
        await this.$store.dispatch(
          'administracion/category/getResource',
          item.id
        )
        this.showMode = true
        this.$nextTick(() => {
          this.form = Object.assign({}, this.category)
        })
        this.dialog = true
      } catch (error) {
        if (error.response.status === 403) {
          await this.$notify({
            group: 'error',
            title: 'No Autorizado',
            text: 'Usted no está autorizado a realizar esta acción',
          })
        } else {
          await this.$notify({
            group: 'error',
            title: error.response.status,
            text: 'Usted no está autorizado a realizar esta acción',
          })
        }
      }
    },
    async editItem(item) {
      try {
        const res = await this.$axios.$get(`categories/${item.id}`, {
          params: {
            // include: 'address',
          },
        })
        const deserializeData = deserialize(res, {
          changeCase: 'camelCase',
        })

        this.editedIndex = this.categories.indexOf(item)
        this.form = Object.assign({}, deserializeData)
        this.dialog = true
      } catch (error) {
        if (error.response.status === 403)
          await this.$notify({
            group: 'error',
            title: 'No Autorizado',
            text: 'Usted no está autorizado a realizar esta acción',
          })
      }
    },
    async deleteItem(item) {
      try {
        await this.$store.dispatch(
          'administracion/category/deleteResource',
          item.id
        )
        await this.$notify({
          group: 'success',
          title: 'Categoría Eliminada',
          text: `La categiría ${item.name} fue elimianda con éxito!`,
        })
      } catch (error) {
        if (error.response.status === 403)
          await this.$notify({
            group: 'error',
            title: 'No Autorizado',
            text: 'Usted no está autorizado a realizar esta acción',
          })
      }
    },
  },
}
</script>

<style>
</style>