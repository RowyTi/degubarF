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
  }),
  validations: {
    data: {
      name: {
        required,
      },
      email: {
        required,
        email,
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
  },
  methods: {
    close() {
      this.$v.$reset()
      this.$emit('closeDialog')
    },
    async createResource() {
      await this.$store.dispatch(
        'administracion/users/createResource',
        this.formu
      )
    },
    async updateResource() {
      await this.$store.dispatch(
        'administracion/users/updateResource',
        this.formu
      )
    },
  },
}
</script>

<style>
</style>