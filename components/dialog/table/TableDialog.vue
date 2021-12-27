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
                  <v-img :src="imgUrl + formu.qr"></v-img>
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
      ref="form"
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
              <v-col cols="12" sm="6">
                <v-col cols="12" class="pb-0">
                  <v-text-field
                    v-model="tableName"
                    outlined
                    placeholder="mesa 1"
                    hint="Ej mesa 1"
                    label="Nombre de Mesa"
                    :error-messages="nameErrors"
                    required
                    @input="delayTouch($v.formu.slug)"
                  >
                    ></v-text-field
                  >
                </v-col>
                <v-col cols="12" class="pb-0">
                  <v-text-field
                    v-model="formu.slug"
                    disabled
                    outlined
                    hidden
                    class="d-none"
                    @input="delayTouch($v.formu.slug)"
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
              <v-col cols="12" sm="6">
                <v-subheader v-text="'Código QR'" />
                <v-sheet
                  v-if="formu.name.length < 1"
                  height="200"
                  width="200"
                  color="blue-grey lighten-5 d-flex align-center"
                  rounded
                  elevation="5"
                  class="mx-auto"
                >
                  <p class="mx-2">
                    El código se generará automaticamente al ingresar el nombre
                    de la mesa
                  </p>
                </v-sheet>
                <div v-else class="text-center">
                  <vue-qr
                    :text="formu.slug"
                    :size="200"
                    :callback="qrImage"
                  ></vue-qr>
                </div>
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
            :disabled="loading || $v.$anyError"
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
import { mapGetters } from 'vuex'
import slugify from 'slugify'
import VueQr from 'vue-qr'
import { required } from 'vuelidate/lib/validators'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseListItemContent from '~/components/ui/BaseListItemContent.vue'
const touchMap = new WeakMap()
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
    name: {
      type: String,
      default: '',
      required: false,
    },
  },
  data: () => ({
    valid: true,
    errors: [],
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
  }),
  computed: {
    ...mapGetters(['user']),
    imgUrl() {
      return process.env.BASE_IMG_URL
    },
    formu() {
      return this.form
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Mesa Nueva' : 'Editar  ' + this.name
    },
    btnForm() {
      return this.editedIndex === -1 ? 'Guardar' : 'Actualizar '
    },
    tableName: {
      get() {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.formu.slug = slugify(this.user.branch.id + '-' + this.formu.name, {
          lower: true,
          strict: true,
        })
        return this.formu.name
      },
      set(value) {
        this.formu.name = value
      },
    },

    // FORM VALIDATION
    nameErrors() {
      const errors = []
      if (!this.$v.formu.slug.$dirty) return errors
      !this.$v.formu.name.required &&
        errors.push('El nombre de la mesa es requerido.')
      !this.$v.formu.slug.isUnique &&
        errors.push('La mesa ingresada ya existe!')
      return errors
    },
  },
  validations: {
    formu: {
      name: {
        required,
      },
      slug: {
        required,
        async isUnique(value) {
          if (value === '') return true
          if (value === this.formu.id) return true
          const res = await this.$axios.$get(`table-validate/${value}`)
          return !res.valido
        },
      },
    },
  },
  methods: {
    qrImage(dataUrl) {
      this.formu.qr = dataUrl
    },
    close() {
      this.$v.$reset()
      this.$emit('closeDialog')
    },
    delayTouch($v) {
      $v.$reset()
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v))
      }
      touchMap.set($v, setTimeout($v.$touch, 1000))
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
          this.$toast.success(`La Mesa fue creada con éxito!`, {
            icon: 'mdi-checkbox-marked-circle-outline',
          })
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
          if (error.response.status === 422) this.$toast.global.e422()
        } else if (error.request) {
          this.$toast.error('Ocurrió un problema al cargar las mesas')
        }
        // console.log(error)
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
        this.$toast.success(
          `La Mesa  ${this.formu.name} fue actualizada con éxito!`,
          {
            icon: 'mdi-checkbox-marked-circle-outline',
          }
        )
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
          if (error.response.status === 422) this.$toast.global.e422()
        } else if (error.request) {
          this.$toast.error('Ocurrió un problema al cargar las mesas')
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