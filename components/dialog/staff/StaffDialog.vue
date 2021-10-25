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
        <v-form class="my-5">
          <v-container fluid class="mt-0 pt-0">
            <v-tabs vertical>
              <v-tab>
                <v-icon left> mdi-account </v-icon>
                Usuario
              </v-tab>
              <v-tab>
                <v-icon left> mdi-face-man-profile </v-icon>
                Perfil
              </v-tab>
              <v-tab>
                <v-icon left> mdi-map-marker-account </v-icon>
                Dirección
              </v-tab>
              <v-tab-item>
                <!-- informacion de Usuario -->
                <v-card flat>
                  <v-card-text class="py-0">
                    <v-list two-line subheader flat>
                      <base-list-item-content
                        title="Nombre de usuario"
                        :subtitle="form.username"
                      />
                      <base-list-item-content
                        title="Rol"
                        :subtitle="
                          form.roles && form.roles.length
                            ? form.roles[0]
                            : 'sin asignar'
                        "
                      />
                      <base-list-item-content
                        title="Estado"
                        :subtitle="form.state"
                      />
                      <base-list-item-content
                        title="Fecha de alta"
                        :subtitle="form.createdAt"
                      />
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <!-- perfil de usuario -->
                <v-card flat>
                  <v-card-text class="py-0">
                    <v-list>
                      <base-list-item-content
                        :avatar="true"
                        :avatar-link="
                          form.profile && form.profile.avatar
                            ? form.profile.avatar
                            : ''
                        "
                        title="Nombres"
                        :subtitle="
                          form.profile && form.profile.name
                            ? form.profile.name
                            : 'sin completar'
                        "
                      />
                      <base-list-item-content
                        title="Apellido"
                        :subtitle="
                          form.profile && form.profile.lastName
                            ? form.profile.lastName
                            : 'sin completar'
                        "
                      />
                      <base-list-item-content
                        title="Teléfono"
                        :subtitle="
                          form.profile && form.profile.phone
                            ? form.profile.phone
                            : 'sin completar'
                        "
                      />
                      <base-list-item-content
                        title="Fecha de nacimiento"
                        :subtitle="
                          form.profile && form.profile.dateOfBirth
                            ? form.profile.dateOfBirth
                            : 'sin completar'
                        "
                      />
                      <base-list-item-content
                        title="Ultima Actualización"
                        :subtitle="
                          form.profile && form.profile.updatedAt
                            ? form.profile.updatedAt
                            : 'sin completar'
                        "
                      />
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <!-- direccion del usuario -->
                <v-card flat>
                  <v-card-text class="py-0">
                    <v-list>
                      <v-row>
                        <v-col cols="8">
                          <base-list-item-content
                            title="Calle"
                            :subtitle="
                              form.profile && form.profile.address.street
                                ? form.profile.address.street
                                : 'sin completar'
                            "
                          />
                        </v-col>
                        <v-col cols="4">
                          <base-list-item-content
                            title="Nº"
                            :subtitle="
                              form.profile && form.profile.address.number
                                ? form.profile.address.number
                                : 'sin completar'
                            "
                          />
                        </v-col>
                        <v-col cols="4">
                          <base-list-item-content
                            title="Piso"
                            :subtitle="
                              form.profile && form.profile.address.piso
                                ? form.profile.address.piso
                                : 's/n'
                            "
                          />
                        </v-col>
                        <v-col cols="4">
                          <base-list-item-content
                            title="Dpto"
                            :subtitle="
                              form.profile && form.profile.address.dpto
                                ? form.profile.address.dpto
                                : 's/n'
                            "
                          />
                        </v-col>
                        <v-col cols="4">
                          <base-list-item-content
                            title="CP"
                            :subtitle="
                              form.profile && form.profile.address.cp
                                ? form.profile.address.cp
                                : 's/n'
                            "
                          />
                        </v-col>
                      </v-row>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs>
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
                  v-model="formu.username"
                  outlined
                  label="Nombre de Usuario"
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
        {{ form }}
      </base-card>
    </v-form>
  </v-dialog>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseListItemContent from '~/components/ui/BaseListItemContent.vue'
export default {
  name: 'StaffDialog',
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
    loading: false,
    options: {
      page: 1,
      itemsPerPage: 10,
    },
  }),
  validations: {
    data: {
      username: {
        required,
      },
      password: {
        required,
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
      return this.editedIndex === -1
        ? 'Empleado Nuevo'
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
      try {
        this.loading = true
        await this.$store.dispatch(
          'administracion/staff/createResource',
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
          'administracion/staff/updateResource',
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

<style scope>
.v-tab {
  justify-content: left !important;
}
</style>