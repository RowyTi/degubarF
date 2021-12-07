<template>
  <v-row justify="center" align="center" class="mt-5">
    <v-col cols="12" md="11">
      <base-card :dialog="false">
        <template #rightCardTitle> Administración de Productos </template>
        <template #leftCardTitle>
          <v-btn
            color="primary accent--text"
            small
            @click.stop="dialog = !dialog"
          >
            Agregar Producto<v-icon right dark>mdi-silverware</v-icon>
          </v-btn>
        </template>
        <template #body>
          <v-data-table
            :headers="headers"
            :items="products"
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
            <template #[`item.state`]="{ item }">
              <v-chip
                :color="item.state === 'inactivo' ? 'error' : 'success'"
                label
                x-small
                class="text-caption text-uppercase"
                v-text="item.state"
              />
            </template>
            <template #[`item.quantity`]="props">
              <v-edit-dialog
                :return-value.sync="props.item.quantity"
                large
                persistent
                @save="save(props.item.id)"
              >
                <div>{{ props.item.quantity }}</div>
                <template #input>
                  <div class="mt-4 text-h6">Actualizar Stock</div>
                  <v-text-field
                    :value="props.item.quantity"
                    label="Stock"
                    single-line
                    counter
                    autofocus
                    @input="updateQuantity"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </template>
            <template #[`item.acciones`]="{ item }">
              <v-btn color="info" icon x-small @click="showItem(item)">
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
        {{ products }}
      </base-card>
    </v-col>
    <product-dialog
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
import ProductDialog from '~/components/dialog/product/ProductDialog.vue'
export default {
  name: 'AdministracionProduct',
  components: { BaseCard, ProductDialog },
  layout: 'admin',
  middleware: ['permission-product'],
  data: () => ({
    headers: [
      {
        text: 'Producto',
        sortable: true,
        value: 'name',
      },
      {
        text: 'Stock',
        sortable: true,
        value: 'quantity',
      },
      {
        text: 'Precio',
        sortable: false,
        value: 'price',
      },
      {
        text: 'Estado',
        sortable: true,
        value: 'state',
      },
      {
        text: 'Actualizado',
        sortable: true,
        value: 'updatedAt',
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
      description: '',
      price: '0',
      quantity: '0',
      state: 'inactivo',
      image: '',
    },
    defaultForm: {
      name: '',
      description: '',
      price: '0',
      quantity: '0',
      state: 'inactivo',
      image: '',
    },
    update: {
      quantity: '',
    },
    loading: false,
    dialog: false,
    editedIndex: -1,
    showMode: false,
    options: { sortBy: ['updatedAt'], sortDesc: [true] },
  }),
  head: {
    title: 'Productos',
  },
  computed: {
    ...mapState('administracion/product', ['products', 'product', 'totalData']),
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
    updateQuantity(e) {
      this.update.quantity = e
    },
    async save(id) {
      const data = Object.assign({ id }, this.update)
      if (this.update.quantity.length > 0) {
        await this.$store.dispatch(
          'administracion/product/updateQuantityResource',
          data
        )
        this.update.quantity = ''
      }
    },
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
          'administracion/product/getList',
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
          'administracion/product/getResource',
          item.id
        )
        this.showMode = true
        this.$nextTick(() => {
          this.form = Object.assign({}, this.product)
        })
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
    async editItem(item) {
      try {
        const res = await this.$axios.$get(`products/${item.id}`, {
          params: {
            // include: 'branch',
          },
        })
        const deserializeData = deserialize(res, {
          changeCase: 'camelCase',
        })
        this.editedIndex = this.products.indexOf(item)
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
        const res = await this.$confirm(
          `Está seguro que desea eliminar el producto ${item.name} ?`,
          {
            title: `Eliminar ${item.name}`,
            icon: 'mdi-delete',
            color: 'error',
            with: 'auto',
            buttonTrueText: 'Eliminar',
          }
        )
        if (res) {
          await this.$store.dispatch(
            'administracion/product/deleteResource',
            item.id
          )
          await this.$notify({
            group: 'success',
            title: 'Producto Eliminado',
            text: `El producto ${item.name} fue elimiando con éxito!`,
          })
        }
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
/* .test {
  border-style: dotted !important;
  border-color: black !important;
  border-width: 1px !important;
} */
</style>