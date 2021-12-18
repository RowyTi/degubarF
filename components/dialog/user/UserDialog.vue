<template>
  <v-dialog
    v-bind="$attrs"
    max-width="500"
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
      <template #body>
        <v-container fluid class="mt-0 pt-0">
          <v-card flat>
            <v-card-text class="py-0">
              <v-list>
                <base-list-item-content title="Nombre" :subtitle="formu.name" />
                <base-list-item-content title="Email" :subtitle="formu.email" />
                <base-list-item-content
                  title="Actualizado"
                  :subtitle="formu.updatedAt"
                />
                <base-list-item-content
                  title="Estado"
                  :subtitle="formu.state"
                />
              </v-list>
            </v-card-text>
          </v-card>
        </v-container>
      </template>
    </base-card>
    <!-- create & edit -->
    <v-form
      v-else
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
                  v-model="formu.name"
                  outlined
                  label="Nombre"
                  :error-messages="nameErrors"
                  @input="$v.formu.name.$touch()"
                  @blur="$v.formu.name.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-text-field
                  v-model="formu.email"
                  outlined
                  label="Email"
                  :error-messages="emailErrors"
                  @input="delayTouch($v.formu.email)"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-text-field
                  v-model="formu.password"
                  outlined
                  label="Contraseña"
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
                  :error-messages="stateErrors"
                  @input="$v.formu.state.$touch()"
                  @blur="$v.formu.state.$touch()"
                >
                </v-select>
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
import { required, email } from 'vuelidate/lib/validators'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseListItemContent from '~/components/ui/BaseListItemContent.vue'
const touchMap = new WeakMap()
export default {
  name: 'UserDialog',
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
      email: {
        required,
        email,
        async isUnique(value) {
          if (value === '') return true
          if (value === this.name) return true
          const res = await this.$axios.$get(`/user-validate/${value}`)
          return !res.valido
        },
      },
      state: {
        required,
      },
    },
  },
  computed: {
    formu: {
      get() {
        return this.form
      },
    },
    formTitle() {
      return this.editedIndex === -1 ? 'Usuario Nuevo' : 'Editar  ' + this.name
    },
    btnForm() {
      return this.editedIndex === -1 ? 'guardar' : 'Actualizar '
    },

    // FORM VALIDATION
    stateErrors() {
      const errors = []
      if (!this.$v.formu.state.$dirty) return errors
      !this.$v.formu.state.required && errors.push('El estado es requerido.')
      return errors
    },
    nameErrors() {
      const errors = []
      if (!this.$v.formu.name.$dirty) return errors
      !this.$v.formu.name.required && errors.push('El nombre es requerido.')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.$v.formu.email.$dirty) return errors
      !this.$v.formu.email.required && errors.push('El email es requerido.')
      !this.$v.formu.email.email && errors.push('El email no es valido.')
      !this.$v.formu.email.isUnique &&
        errors.push('Este Email ya esta registrado')
      return errors
    },
  },
  methods: {
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
            'administracion/users/createResource',
            this.formu
          )
          this.close()
          this.$toast.success(
            `El usuario ${this.formu.name} fue creado con éxito!`,
            {
              icon: 'mdi-checkbox-marked-circle-outline',
            }
          )
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
          if (error.response.status === 422) this.$toast.global.e422()
        } else if (error.request) {
          this.$toast.error(
            `Ocurrió un problema al actualizar el usuario ${this.formu.email}`
          )
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
            'administracion/users/updateResource',
            this.formu
          )
          this.close()
          this.$toast.success(
            `El usuario ${this.formu.name} fue actualizado con éxito!`,
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
          this.$toast.error(
            `Ocurrió un problema al actualizar el usuario ${this.formu.email}`
          )
        }
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style>
</style>