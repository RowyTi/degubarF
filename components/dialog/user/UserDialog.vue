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
        <v-form class="my-10">
          <v-container fluid class="mt-0 pt-0">
            <v-row>
              <v-col cols="12" class="pb-0">
                <v-text-field
                  v-model="formu.name"
                  outlined
                  label="Nombre"
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-text-field
                  v-model="formu.email"
                  outlined
                  label="Email"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </template>
    </base-card>
    <!-- create & edit -->
    <v-form
      v-else
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
import { required, email } from 'vuelidate/lib/validators'
import BaseCard from '~/components/ui/BaseCard.vue'
const touchMap = new WeakMap()
export default {
  name: 'UserDialog',
  components: { BaseCard },
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
          const res = await this.$axios.$get(`/user-validate/${value}`)
          return !res.valido
        },
      },
      password: {
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
      return this.editedIndex === -1
        ? 'Usuario Nuevo'
        : 'Editar  ' + this.formu.name
    },
    btnForm() {
      return this.editedIndex === -1 ? 'guardar' : 'Actualizar '
    },

    // FORM VALIDATION
    emailErrors() {
      const errors = []
      if (!this.$v.formu.email.$dirty) return errors
      !this.$v.formu.email.required && errors.push('El email es requerido.')
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
        this.loading = true
        await this.$store.dispatch(
          'administracion/users/createResource',
          this.formu
        )
        this.close()
      } catch (error) {
        if (error.response.status === 403)
          alert('Usted no esta Autorizado para realizar esta acción')
      } finally {
        this.loading = false
      }
    },
    async updateResource() {
      try {
        this.loading = true
        await this.$store.dispatch(
          'administracion/users/updateResource',
          this.formu
        )
        this.close()
      } catch (error) {
        if (error.response.status === 403)
          alert('Usted no esta Autorizado para realizar esta acción')
      } finally {
        this.loading = false
      }
    },
  },
}
</script>

<style>
</style>