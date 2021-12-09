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
                      title="Producto"
                      :subtitle="formu.name"
                    />
                    <base-list-item-content
                      title="Stock"
                      :subtitle="formu.quantity.toString()"
                    />
                    <base-list-item-content
                      title="Precio"
                      :subtitle="'$' + formu.price"
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
                  <div class="elevation-5 rounded-lg">
                    <v-img
                      aspect-ratio="1"
                      :src="imgUrl + formu.image"
                      class="grey lighten-2 rounded-lg"
                    >
                      <template #placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-progress-circular
                            indeterminate
                            color="primary"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </div>

                  <div class="py-0 my-0">
                    <v-subheader class="primary--text text-overline"
                      >Descripción</v-subheader
                    >
                    <p
                      class="font-weith-light text-caption"
                      v-text="formu.description"
                    />
                  </div>
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
                    v-model="formu.name"
                    outlined
                    label="Producto"
                    :error-messages="nameErrors"
                    @input="$v.formu.name.$touch()"
                    @blur="$v.formu.name.$touch()"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-text-field
                    v-model="formu.description"
                    outlined
                    label="Descripción"
                    :error-messages="descriptionErrors"
                    @input="$v.formu.description.$touch()"
                    @blur="$v.formu.description.$touch()"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="6" class="pb-0">
                      <v-text-field
                        v-model="formu.quantity"
                        v-mask="'#####'"
                        outlined
                        label="Stock"
                        :error-messages="quantityErrors"
                        @input="$v.formu.quantity.$touch()"
                        @blur="$v.formu.quantity.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" class="pb-0">
                      <v-text-field
                        v-model="formu.price"
                        outlined
                        prefix="$"
                        label="Precio"
                        :error-messages="priceErrors"
                        @input="$v.formu.price.$touch()"
                        @blur="$v.formu.price.$touch()"
                      ></v-text-field>
                    </v-col>
                  </v-row>
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
                    :error-messages="stateErrors"
                    @input="$v.formu.state.$touch()"
                    @blur="$v.formu.state.$touch()"
                  >
                  </v-select>
                </v-col>
              </v-col>
              <!-- IMAGEN DE PRODUCTO -->
              <v-col cols="6">
                <v-col cols="12">
                  <v-file-input
                    v-model="file"
                    accept="image/jpeg, image/png"
                    label="Imagen"
                    clearable
                    prepend-icon=""
                    prepend-inner-icon=""
                    outlined
                    counter
                    show-size
                    small-chips
                    @change="uploadImage"
                  />
                </v-col>

                <v-col cols="12">
                  <v-sheet
                    v-if="formu.image.length < 1"
                    height="200"
                    width="200"
                    color="blue-grey lighten-5 d-flex align-center rounded-lg"
                    rounded-lg
                    elevation="5"
                  >
                    <v-icon class="mx-auto accent--text" size="72">
                      mdi-image
                    </v-icon>
                  </v-sheet>
                  <v-img
                    v-if="
                      formu.image.includes('data:image/jpeg;base64,') ||
                      formu.image.includes('data:image/png;base64,')
                    "
                    :src="formu.image"
                    class="rounded-lg"
                  >
                    <template #placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="primary"
                        ></v-progress-circular>
                      </v-row> </template
                  ></v-img>
                  <v-img
                    v-else-if="formu.image.length > 1"
                    :src="imgUrl + formu.image"
                    class="rounded-lg"
                  >
                    <template #placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="primary"
                        ></v-progress-circular>
                      </v-row> </template
                  ></v-img>
                </v-col>
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
import { required, numeric } from 'vuelidate/lib/validators'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseListItemContent from '~/components/ui/BaseListItemContent.vue'
export default {
  name: 'ProductDialog',
  components: { BaseCard, BaseListItemContent },
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
    image: '',
    file: [],
    itemState: [
      {
        text: 'Inactivo',
        value: 'inactivo',
      },
      {
        text: 'Activo',
        value: 'activo',
      },
    ],
    loading: false,
    options: {
      page: 1,
      itemsPerPage: 10,
    },
  }),
  validations: {
    formu: {
      name: {
        required,
      },
      description: {
        required,
      },
      price: {
        required,
      },
      quantity: {
        required,
        numeric,
      },
      state: {
        required,
      },
      image: {
        required,
      },
    },
  },
  computed: {
    imgUrl() {
      return process.env.BASE_IMG_URL
    },
    formu() {
      return this.form
    },
    formTitle() {
      return this.editedIndex === -1
        ? 'Producto nuevo'
        : 'Editar  ' + this.form.name
    },
    btnForm() {
      return this.editedIndex === -1 ? 'Guardar' : 'Actualizar '
    },
    nameErrors() {
      const errors = []
      if (!this.$v.formu.name.$dirty) return errors
      !this.$v.formu.name.required && errors.push('Este campo es obligatiorio.')
      return errors
    },
    descriptionErrors() {
      const errors = []
      if (!this.$v.formu.description.$dirty) return errors
      !this.$v.formu.description.required &&
        errors.push('Este campo es obligatiorio.')
      return errors
    },
    quantityErrors() {
      const errors = []
      if (!this.$v.formu.quantity.$dirty) return errors
      !this.$v.formu.quantity.required &&
        errors.push('Este campo es obligatiorio.')
      !this.$v.formu.quantity.numeric &&
        errors.push('Este campo solo admite números.')
      return errors
    },
    priceErrors() {
      const errors = []
      if (!this.$v.formu.price.$dirty) return errors
      !this.$v.formu.price.required &&
        errors.push('Este campo es obligatiorio.')
      return errors
    },
    stateErrors() {
      const errors = []
      if (!this.$v.formu.state.$dirty) return errors
      !this.$v.formu.state.required &&
        errors.push('Este campo es obligatiorio.')
      return errors
    },
  },

  methods: {
    uploadImage(imagen) {
      this.createImage(imagen)
    },
    createImage(file) {
      if (file !== null) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.formu.image = e.target.result
        }
        reader.readAsDataURL(file)
      } else {
        this.formu.image = ''
      }
    },
    close() {
      this.$v.$reset()
      this.stepper = 1
      this.$emit('closeDialog')
    },
    async createResource() {
      try {
        // this.$v.$touch()
        // if (!this.$v.$invalid) {
        this.loading = true
        await this.$store.dispatch(
          'administracion/product/createResource',
          this.formu
        )
        this.close()
        await this.$notify({
          group: 'success',
          title: 'Mesa creada!',
          text: `La Mesa <b>${this.formu.name}</b> fue creado con éxito!`,
        })
        // }
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
          'administracion/product/updateResource',
          this.formu
        )
        this.close()
        await this.$notify({
          group: 'success',
          title: 'Producto Actualizado!',
          text: `El producto <b>${this.formu.name}</b> fue actualizado con éxito!`,
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