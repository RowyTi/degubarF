<template>
  <v-row justify="center" align="center" class="mt-5">
    <v-col cols="12" md="11">
      <base-card :dialog="false">
        <template #rightCardTitle>
          <span class="font-weight-light accent--text">
            Administración de
            <span class="primary--text text-uppercase font-weight-bold">
              Productos</span
            >
          </span>
        </template>
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
            <v-alert
              slot="no-data"
              type="info"
              outlined
              dense
              max-width="400"
              class="mx-auto mt-4"
            >
              No hay productos asociados a este local
            </v-alert>
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
                save-text="Guardar"
                cancel-text="Cancelar"
                large
                persistent
                @save="save(props.item)"
              >
                <div>{{ props.item.quantity }}</div>
                <template #input>
                  <div class="mt-4 text-h6">Actualizar Stock</div>
                  <v-text-field
                    :value="props.item.quantity"
                    type="number"
                    label="Stock"
                    single-line
                    counter="6"
                    :rules="rules"
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
import { mapState } from 'vuex'
import BaseCard from '~/components/ui/BaseCard.vue'
import ProductDialog from '~/components/dialog/product/ProductDialog.vue'
export default {
  name: 'AdministracionProduct',
  components: { BaseCard, ProductDialog },
  layout: 'admin',
  middleware: ['permission-product'],
  data: () => ({
    rules: [
      (v) => !!v || 'El stock es requerido',
      (v) => (v && v.length <= 6) || 'Máximo 6 caracteres',
      (v) => (v && v.length > 0) || 'Mínimo 1 caracteres',
    ],
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
      slug: '',
      description: '',
      price: '',
      quantity: '',
      state: 'inactivo',
      image: '',
    },
    defaultForm: {
      name: '',
      slug: '',
      description: '',
      price: '',
      quantity: '',
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
    async save(item) {
      try {
        if (this.update.quantity.length > 6)
          return this.$toast.error('El stock supera el valor permitido')
        const data = Object.assign({ item }, this.update)
        if (this.update.quantity.length > 0) {
          await this.$store.dispatch(
            'administracion/product/updateQuantityResource',
            data
          )
          this.update.quantity = ''
          this.$toast.success(
            `El stock del producto ${item.name} fue actualizado con éxito!`,
            {
              icon: 'mdi-checkbox-marked-circle-outline',
            }
          )
        }
      } catch (error) {
        if (error.response) {
          // if (error.response.status === 500) return this.$toast.global.e500()
          if (error.response.status === 403) return this.$toast.global.e403()
        } else {
          this.$toast.error('Ocurrió un problema al actualizar el stock')
        }
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
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
        } else if (error.request) {
          this.$toast.error('Ocurrió un problema al cargar tu negocio')
        }
        console.log(error.toJSON())
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
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
        } else if (error.request) {
          this.$toast.error('Ocurrió un problema al cargar tu negocio')
        }
        console.log(error.toJSON())
      }
    },
    async editItem(item) {
      try {
        await this.$store.dispatch(
          'administracion/product/getResource',
          item.id
        )
        this.editedIndex = this.products.indexOf(item)
        this.form = Object.assign({}, this.product)
        this.dialog = true
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
        } else if (error.request) {
          this.$toast.error('Ocurrió un problema al cargar tu negocio')
        }
        console.log(error.toJSON())
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
          this.$toast.success(
            `El producto ${item.name} fue eliminado con éxito!`,
            {
              icon: 'mdi-checkbox-marked-circle-outline',
            }
          )
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
        } else if (error.request) {
          this.$toast.error('Ocurrió un problema al cargar tu negocio')
        }
        console.log(error.toJSON())
      }
    },
  },
}
</script>