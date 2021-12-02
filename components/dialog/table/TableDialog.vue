<template>
  <v-dialog
    v-bind="$attrs"
    max-width="525"
    persistent
    scrollable
    v-on="$listeners"
  >
    <!-- show data -->
    <base-card
      v-if="showMode"
      :dialog="false"
      :color="$vuetify.theme.dark ? 'black' : 'blue-grey lighten-5'"
      :section-actions="false"
    >
      <template #leftCardTitle>
        <v-btn icon x-small color="primary" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
      <template #body class="pa-0">
        <v-container fluid class="mt-0 pt-0">
          <v-card flat>
            <v-card-text class="py-0">
              <v-row>
                <v-col cols="6">
                  <v-list>
                    <base-list-item-content
                      title="Categoría"
                      :subtitle="formu.name"
                    />
                    <base-list-item-content
                      title="Estado"
                      :subtitle="formu.state"
                      class="text-capitalize"
                    />
                    <base-list-item-content
                      title="Actualizada"
                      :subtitle="formu.updatedAt"
                    />
                  </v-list>
                </v-col>
                <v-col cols="6">
                  <v-img
                    :src="'http://bdegubar.test/storage/' + formu.qr"
                  ></v-img>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-container>
      </template>
    </base-card>
    <!-- create & edit -->
    <v-form
      v-else
      ref="formulario"
      lazy-validation
      @submit.prevent="editedIndex === -1 ? createResource() : updateResource()"
    >
      <base-card
        :dialog="true"
        :section-actions="true"
        :title-toolbar="formTitle"
        color-toolbar="success"
      >
        <template #leftToolbar>
          <v-btn icon color="white" @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template #body>
          <v-container fluid class="mt-5 pt-0">
            <v-row>
              <v-col cols="6">
                <v-col cols="12" class="pb-0">
                  <v-text-field
                    v-model="clientName"
                    outlined
                    label="Número de Mesa"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-text-field
                    v-model="formu.slug"
                    hidden
                    disabled
                    outlined
                    class="d-none"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-select
                    v-model="formu.state"
                    label="Estado"
                    :items="itemState"
                    :item-text="itemState.text"
                    :item-value="itemState.value"
                    value="inactivo"
                    outlined
                  >
                  </v-select>
                </v-col>
              </v-col>
              <!-- codigo qr -->
              <v-col cols="6">
                <v-subheader v-text="'Código QR'" />
                <v-sheet
                  v-if="formu.name.length < 1"
                  height="200"
                  width="200"
                  color="blue-grey lighten-5 d-flex align-center"
                  rounded
                  elevation="5"
                >
                  <p class="mx-2">
                    El código se generará automaticamente al ingresar el nombre
                    de la mesa
                  </p>
                </v-sheet>

                <vue-qr
                  v-else
                  :text="formu.slug"
                  :size="200"
                  :callback="qrImage"
                ></vue-qr>
              </v-col>
            </v-row>
          </v-container>
        </template>
        <template #actions>
          <v-btn color="error" text :disabled="loading" @click="close">
            Cancelar
          </v-btn>
          <v-btn
            color="success"
            type="submit"
            :disabled="loading"
            :loading="loading"
          >
            {{ btnForm }}
          </v-btn>
        </template>
      </base-card>
    </v-form>
  </v-dialog>
</template>

<script>
import slugify from 'slugify'
import VueQr from 'vue-qr'
import { required } from 'vuelidate/lib/validators'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseListItemContent from '~/components/ui/BaseListItemContent.vue'
export default {
  name: 'TableDialog',
  components: { BaseCard, BaseListItemContent, VueQr },
  props: {
    form: {
      type: Object,
      default: () => {},
      required: true,
    },
    editedIndex: {
      type: Number,
      default: -1,
      required: false,
    },
    showMode: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data: () => ({
    stepper: 1,
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
    loading: false,
    options: {
      page: 1,
      itemsPerPage: 10,
    },
    // name: '',
    // slug: '',
    // state: '',
    // qr: '',
    // branhc_id: '',
  }),
  validations: {
    formu: {
      name: {
        required,
      },
      slug: {
        required,
      },
    },
  },
  computed: {
    formu() {
      return this.form
    },
    formTitle() {
      return this.editedIndex === -1
        ? 'Mesa Nueva'
        : 'Editar  ' + this.form.name
    },
    btnForm() {
      return this.editedIndex === -1 ? 'Guardar' : 'Actualizar '
    },
    clientName: {
      get() {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.formu.slug = slugify(
          this.$auth.user.branch.id + '-' + this.formu.name,
          {
            lower: true,
            strict: true,
          }
        )
        return this.formu.name
      },
      set(value) {
        this.formu.name = value
      },
    },
  },

  methods: {
    qrImage(dataUrl) {
      this.formu.qr = dataUrl
    },
    nextStep() {
      return this.stepper++
    },
    close() {
      this.$v.$reset()
      this.stepper = 1
      this.$emit('closeDialog')
    },
    async createResource() {
      try {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          this.loading = true
          await this.$store.dispatch(
            'administracion/table/createResource',
            this.formu
          )
          this.close()
          await this.$notify({
            group: 'success',
            title: 'Mesa creada!',
            text: `La Mesa <b>${this.formu.name}</b> fue creado con éxito!`,
          })
        }
      } catch (error) {
        if (error.response.status === 403) {
          await this.$notify({
            group: 'error',
            title: 'No Autorizado',
            text: 'Usted no esta Autorizado para realizar esta acción',
          })
        } else {
          await this.$notify({
            group: 'error',
            title: 'Error',
            text: 'Ocurrió un error en el servidor, intentelo de nuevo mas tarde..',
          })
        }
      } finally {
        this.loading = false
      }
    },
    async updateResource() {
      try {
        this.loading = true
        await this.$store.dispatch(
          'administracion/table/updateResource',
          this.formu
        )
        this.close()
        await this.$notify({
          group: 'success',
          title: 'Mesa Actualizada!',
          text: `La Mesa <b>${this.formu.name}</b> fue actualizada con éxito!`,
        })
      } catch (error) {
        if (error.response.status === 403) {
          await this.$notify({
            group: 'error',
            title: 'No Autorizado',
            text: 'Usted no esta Autorizado para realizar esta acción',
          })
        } else {
          await this.$notify({
            group: 'error',
            title: 'Error',
            text: 'Ocurrió un error en el servidor, intentelo de nuevo mas tarde..',
          })
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style scope>
.v-tab {
  justify-content: left !important;
}
</style>