<template>
  <v-row justify="center" align="center" class="mt-5">
    <v-col cols="12" md="11">
      <base-card :dialog="false">
        <template #rightCardTitle>
          <span class="font-weight-light accent--text">
            Administración de
            <span class="primary--text text-uppercase font-weight-bold">
              Mesas</span
            >
          </span>
        </template>
        <template #leftCardTitle>
          <v-btn
            color="accent"
            small
            class="mr-2"
            :disabled="tables.length < 1"
            @click="print(tables)"
          >
            Imprimir QR <v-icon right dark v-text="'mdi-qrcode-scan'" />
          </v-btn>
          <v-btn
            color="primary accent--text"
            small
            @click.stop="dialog = !dialog"
          >
            Agregar Mesa<v-icon right dark>mdi-table-chair</v-icon>
          </v-btn>
        </template>
        <template #body>
          <v-data-table
            :headers="headers"
            :items="tables"
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
              type="info"
              outlined
              slot="no-data"
              dense
              max-width="400"
              class="mx-auto mt-4"
            >
              No hay mesas asociados a este local
            </v-alert>
            <template #[`item.state`]="{ item }">
              <v-edit-dialog
                :return-value.sync="item.state"
                large
                persistent
                @save="save(item.id)"
              >
                <v-chip
                  :color="
                    item.state === 'inactivo'
                      ? 'disabled'
                      : item.state === 'ocupado'
                      ? 'error'
                      : 'success'
                  "
                  label
                  x-small
                  class="text-caption text-uppercase"
                  v-text="item.state"
                />
                <template #input>
                  <div class="mt-4 mb-1 text-h6">Actualizar Estado</div>
                  <v-select
                    :value="item.state"
                    label="Estado"
                    :items="itemState"
                    :item-text="itemState.text"
                    :item-value="itemState.value"
                    @input="updateState"
                  >
                  </v-select>
                  <!-- <v-text-field
                    :value="item.state"
                    label="Stock"
                    single-line
                    counter
                    autofocus
                    @input="updateState"
                  ></v-text-field> -->
                </template>
              </v-edit-dialog>
            </template>
            <template #[`item.acciones`]="{ item }">
              <v-btn color="accent" icon x-small @click="print([item])">
                <v-icon> mdi-qrcode-scan </v-icon>
              </v-btn>
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
    <table-dialog
      v-model="dialog"
      :form="form"
      :edited-index="editedIndex"
      :show-mode="showMode"
      @closeDialog="closeDialog"
    />
    <base-print :qr="qrData" @print="print" />
  </v-row>
</template>

<script>
import { deserialize } from 'jsonapi-fractal'
import { mapState } from 'vuex'
import BaseCard from '~/components/ui/BaseCard.vue'
import TableDialog from '~/components/dialog/table/TableDialog.vue'
import BasePrint from '~/components/ui/layouts/BasePrint.vue'
export default {
  name: 'AdministracionTable',
  components: { BaseCard, TableDialog, BasePrint },
  layout: 'admin',
  middleware: ['permission-table', 'auth'],
  data: () => ({
    qrData: [],
    update: {
      state: '',
    },
    headers: [
      {
        text: 'Mesa',
        sortable: true,
        value: 'name',
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
    itemState: [
      {
        text: 'Inactivo',
        value: 'inactivo',
      },
      {
        text: 'Ocupado',
        value: 'ocupado',
      },
      {
        text: 'Libre',
        value: 'libre',
      },
    ],
    form: {
      name: '',
      slug: '',
      state: 'inactivo',
      qr: '',
    },
    defaultForm: {
      name: '',
      slug: '',
      state: 'inactivo',
      qr: '',
    },
    loading: false,
    dialog: false,
    editedIndex: -1,
    showMode: false,
    options: { sortBy: ['updatedAt'], sortDesc: [true] },
  }),
  head: {
    title: 'Mesas',
  },
  computed: {
    ...mapState('administracion/table', ['tables', 'table', 'totalData']),
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
    updateState(e) {
      this.update.state = e
    },
    async save(id) {
      if (this.update.state.length > 0) {
        await this.$axios.patch(`tables/state/${id}`, this.update)
        this.update.state = ''
        await this.getData()
      }
    },
    loadPrintData(value) {
      this.qrData = value
    },
    async print(data) {
      await this.loadPrintData(data)
      await this.$htmlToPaper('printMe')
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
        await this.$store.dispatch('administracion/table/getList', this.options)
      } catch (error) {
        if (error.response.status === 403)
          alert('Usted no esta Autorizado para realizar esta acción')
      } finally {
        this.loading = false
      }
    },
    async showItem(item) {
      try {
        await this.$store.dispatch('administracion/table/getResource', item.id)
        this.showMode = true
        this.$nextTick(() => {
          this.form = Object.assign({}, this.table)
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
        const res = await this.$axios.$get(`tables/${item.id}`, {
          params: {
            // include: 'branch',
          },
        })
        const deserializeData = deserialize(res, {
          changeCase: 'camelCase',
        })
        this.editedIndex = this.tables.indexOf(item)
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
          `Está seguro que desea eliminar la mesa ${item.name} ?`,
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
            'administracion/table/deleteResource',
            item.id
          )
          await this.$notify({
            group: 'success',
            title: 'Mesa Eliminada',
            text: `La mesa ${item.name} fue elimianda con éxito!`,
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