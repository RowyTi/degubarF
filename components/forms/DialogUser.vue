<template>
  <v-dialog
    v-bind="$attrs"
    max-width="800"
    persistent
    scrollable
    v-on="$listeners"
  >
    <v-form
      @submit.prevent="editedIndex === -1 ? createPerson() : updatePerson()"
    >
      <base-card
        :dialog="true"
        :color-toolbar="showMode ? 'info' : 'success'"
        :color="$vuetify.theme.dark ? 'black' : 'blue-grey lighten-5'"
        :title-toolbar="showMode ? 'edit' : formTitle"
        :section-actions="showMode ? false : true"
      >
        <template #rightToolbar />
        <template #leftToolbar>
          <v-btn icon color="white" @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
        <template v-if="showMode" #body>
          <v-row justify="center" class="ma-0 pa-0">
            <v-col cols="12" md="4" class="mt-10 pr-5 text-center">
              <v-avatar size="200" color="grey" class="elevation-5">
                <v-img
                  v-if="!formPerson.foto.includes('data:image/jpeg;base64,')"
                  :src="base64Image"
                />
              </v-avatar>
              <p class="text-h6 mt-5">{{ nombreCompleto }}</p>
              <v-chip
                label
                class="white--text"
                :color="
                  personaEstado === 'Inactivo'
                    ? 'red'
                    : personaEstado === 'Activo'
                    ? 'green'
                    : personaEstado === 'Licencia'
                    ? 'orange'
                    : 'black'
                "
                >{{ personaEstado }}</v-chip
              >
            </v-col>
            <v-col cols="12" sm="8" class="px-5">
              <v-sheet class="mt-5 " elevation="3">
                <div class="overline pa-4">
                  <span>
                    <v-icon right color="primary" class="mr-2"
                      >mdi-card-account-details</v-icon
                    >
                    Información</span
                  >
                  <v-divider />
                </div>
                <v-list two-line class="py-0">
                  <v-row>
                    <v-col cols="12" class="pb-0">
                      <v-row>
                        <col-list-item
                          title="nombre"
                          :subtitle="formPerson.nombre"
                        />
                        <col-list-item
                          v-show="formPerson.onombre"
                          title="Otros nombres"
                          :subtitle="formPerson.onombre"
                        />
                        <col-list-item
                          title="apellido"
                          :subtitle="formPerson.apellido"
                        />
                        <col-list-item
                          v-show="formPerson.oapellido"
                          title="email"
                          :subtitle="formPerson.oapellido"
                        />
                      </v-row>
                    </v-col>
                    <v-col cols="12" class="pt-0">
                      <v-row>
                        <col-list-item
                          title="Fecha de Nacimiento"
                          :subtitle="formPerson.f_nacimiento"
                        />
                        <col-list-item
                          title="Género"
                          :subtitle="personaGenero"
                        />
                        <col-list-item
                          title="tipo y nro documento"
                          :subtitle="personaTipoDoc"
                        />
                        <col-list-item
                          title="cuit"
                          :subtitle="formPerson.cuit"
                        />
                      </v-row>
                    </v-col>
                  </v-row>
                </v-list>
              </v-sheet>
              <v-sheet class="mt-5" elevation="3">
                <div class="overline pa-4">
                  <span>
                    <v-icon right color="primary" class="mr-2"
                      >mdi-card-account-phone</v-icon
                    >
                    Información de contacto
                  </span>
                  <v-divider />
                </div>
                <v-list two-line class="py-0">
                  <v-row>
                    <col-list-item title="email" :subtitle="formPerson.email" />
                    <col-list-item
                      title="celular"
                      :subtitle="formPerson.celular"
                    />
                  </v-row>
                </v-list>
              </v-sheet>
            </v-col>
          </v-row>
        </template>
<!--         <template v-else #body>
          <v-container fluid class="mt-0 pt-0">
            <v-row>
              <v-col cols="12" class="text-center">
                <v-subheader> Información </v-subheader>

                <v-divider></v-divider>
              </v-col>
              <v-col cols="12" class="pb-0">
                <v-row justify="center" align="end">
                  <v-col cols="12" md="6" class="pb-0">
                    <v-row>
                      <v-col cols="12" sm="6" md="12" class="pb-0">
                        <v-text-field
                          v-model="form.namembre"
                          outlined
                          label="Nombre"
                          :error-messages="nombreErrors"
                          @input="$v.formPerson.nombre.$touch()"
                          @blur="$v.formPerson.nombre.$touch()"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-subheader> Información de contacto </v-subheader>
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12" sm="6" class="pb-0">
                <v-text-field
                  v-model="form.email"
                  outlined
                  label="Email"
                  :error-messages="emailErrors"
                  @input="$v.formPerson.email.$touch()"
                  @blur="$v.formPerson.email.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </template> -->
        <template #actions>
          <v-btn color="error" text :disabled="loading" @click="close">
            Cancelar
          </v-btn>
          <v-btn
            color="success"
            type="submit"
            :disabled="isValid"
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
import { required, email } from "vuelidate/lib/validators";
import BaseCard from "~/components/ui/BaseCard.vue";
export default {
  name: "CreateEditPersonForm",
  components: { BaseCard },
  props: {
    form: {
      type: Object,
      default: () => {},
      required: true
    },
    editedIndex: {
      type: Number,
      default: -1,
      required: true
    },
    showMode: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data: () => ({
    loading: false,
    panel: 0
  }),
  validations: {
    form: {
      name: {
        required
      },
      email: {
        required,
        email
      },
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nueva Persona"
        : "Editar  " + this.nombreCompleto;
    },
    btnForm() {
      return this.editedIndex === -1 ? "guardar" : "Actualizar ";
    },
    // ERRORES VALIDACIONES
    nameErrors() {
      const errors = [];
      if (!this.$v.form.name.$dirty) return errors;
      !this.$v.form.name.required &&
        errors.push("Este campo es obligatiorio.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.form.email.$dirty) return errors;
      !this.$v.form.email.email && errors.push("Ingrese un email válido");
      !this.$v.form.email.required &&
        errors.push("Este campo es obligatiorio.");
      return errors;
    },
  },
  methods: {
    close() {
      this.$v.$reset();
      this.$emit("closeDialog");
    },
    createPerson() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.loading = true;
        this.formPerson.foto = this.imagen;
        this.$store
          .dispatch("administracion/persona/nuevaPersona", this.formPerson)
          .then(res => {
            this.$store.dispatch("administracion/persona/reload");
            this.imagen = "";
            this.file = null;
            this.close();
            this.loading = false;
            this.$awn.success("Se creó correctmente");
          })
          .catch(err => {
            this.loading = false;
            // console.log(r.response);
            if (err.response.status === 500) {
              this.$awn.alert(
                "No es posible realizar esta acción en este momento (cod " +
                  err.response.status +
                  " )"
              );
            } else {
              this.$awn.alert(err.response.status);
            }
          });
      }
    },
    updatePerson() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.loading = true;
        if (this.imagen.length) {
          this.formPerson.foto = this.imagen;
        } else {
          this.formPerson.foto = this.base64Image;
        }
        this.$store
          .dispatch("administracion/persona/actualizarPersona", this.formPerson)
          .then(r => {
            this.$store.dispatch("administracion/persona/reload");
            this.imagen = "";
            this.file = null;
            this.close();
            this.loading = false;
            this.$awn.success("Se actualizo correctmente");
          })
          .catch(err => {
            this.loading = false;
            // console.log(r.response);
            if (err.response.status === 500) {
              this.$awn.alert(
                "No es posible realizar esta acción en este momento (cod " +
                  err.response.status +
                  " )"
              );
            } else {
              this.$awn.alert(err.response.status);
            }
          });
      }
    }
  }
};
</script>
