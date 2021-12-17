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
              <v-list>
                <base-list-item-content
                  title="Categoría"
                  :subtitle="formu.name"
                />
                <base-list-item-content
                  title="URL Amigable"
                  :subtitle="formu.slug"
                />
                <base-list-item-content
                  title="Actualizada"
                  :subtitle="formu.updatedAt"
                />
                <v-chip
                  v-for="branch in formu.branches"
                  :key="branch.id"
                  label
                  class="ma-1"
                  :color="branch.state === 'inactivo' ? 'error' : 'success'"
                >
                  {{ branch.name }}
                </v-chip>
              </v-list>
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
              <v-col cols="12" class="pb-0">
                <v-text-field
                  v-model="categoryName"
                  outlined
                  label="Nombre de Categorīa"
                  :error-messages="nameError"
                  @input="delayTouch($v.formu.slug)"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-text-field
                  v-model="formu.slug"
                  disabled
                  outlined
                  label="Url amigable"
                  @input="delayTouch($v.formu.slug)"
                ></v-text-field>
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
import slugify from 'slugify'
import { required } from 'vuelidate/lib/validators'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseListItemContent from '~/components/ui/BaseListItemContent.vue'
const touchMap = new WeakMap()
export default {
  name: 'CategoryDialog',
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
    name: {
      type: String,
      default: '',
      required: false,
    },
  },
  data: () => ({
    address: null,
    stepper: 1,
    itemState: ['inactivo', 'activo'],
    loading: false,
    loadingSearch: false,
    options: {
      page: 1,
      itemsPerPage: 10,
    },
  }),
  computed: {
    formu() {
      return this.form
    },
    formTitle() {
      return this.editedIndex === -1
        ? 'Categoría Nueva'
        : 'Editar  ' + this.name
    },
    btnForm() {
      return this.editedIndex === -1 ? 'Guardar' : 'Actualizar '
    },
    categoryName: {
      get() {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.formu.slug = slugify(this.formu.name, {
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
    nameError() {
      const errors = []
      if (!this.$v.formu.slug.$dirty) return errors
      !this.$v.formu.name.required &&
        errors.push('El nombre de la categoría es requerido')
      !this.$v.formu.slug.isUnique &&
        errors.push('La categoria ingresada ya existe')
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
          const res = await this.$axios.$get(`category-validate/${value}`)
          return !res.valido
        },
      },
    },
  },
  methods: {
    delayTouch($v) {
      $v.$reset()
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v))
      }
      touchMap.set($v, setTimeout($v.$touch, 1000))
    },
    close() {
      this.$v.$reset()
      this.$emit('closeDialog')
    },
    async createResource() {
      try {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          this.loading = true
          await this.$store.dispatch(
            'administracion/category/createResource',
            this.formu
          )
          this.close()
          await this.$notify({
            group: 'success',
            title: 'Categoría creada!',
            text: `La categoría <b>${this.formu.name}</b> fue creado con éxito!`,
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
        this.$v.$touch()
        if (!this.$v.$invalid) {
          this.loading = true
          await this.$store.dispatch(
            'administracion/category/updateResource',
            this.formu
          )
          this.close()
          await this.$notify({
            group: 'success',
            title: 'Categoría Actualizado!',
            text: `La categoría <b>${this.formu.name}</b> fue actualizada con éxito!`,
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
  },
}
</script>

<style scope>
.v-tab {
  justify-content: left !important;
}
</style>