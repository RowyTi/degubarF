<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <div class="d-flex">
        <v-icon color="primary" class="mr-2">mdi-store</v-icon>
        <h2 class="text-overline">Perfil de Mi Negocio</h2>
      </div>

      <template #actions>
        <v-icon color="primary"> $expand </v-icon>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-form ref="form" lazy-validation @submit.prevent="updateResource()">
        <v-container>
          <v-sheet max-width="800" class="mx-auto">
            <v-row justify="center" class="mx-auto">
              <v-col v-if="loading" cols="12">
                <v-sheet
                  height="300"
                  class="d-flex justify-center align-center"
                >
                  <v-progress-circular
                    v-show="loading"
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-sheet>
              </v-col>
              <v-col v-show="!loading" cols="12" class="pa-0 ma-0">
                <v-row>
                  <v-col cols="12" md="6" class="mt-10">
                    <v-text-field
                      v-model="clientName"
                      label="Nombre de tu negocio"
                      outlined
                      hint="Ej: Degubar Palermo"
                      class="text-capitalize"
                      :error-messages="nameErrors"
                      @input="delayTouch($v.form.slug)"
                    ></v-text-field>
                    <v-text-field
                      v-model="form.slug"
                      label="Url"
                      disabled
                      outlined
                      hidden
                      class="d-none"
                      hint="Se genera automaticamente"
                      @input="delayTouch($v.form.slug)"
                    ></v-text-field>
                    <v-checkbox
                      v-model="changeLogo"
                      label="Cambiar logo"
                    ></v-checkbox>
                    <v-expand-transition>
                      <v-file-input
                        v-show="changeLogo"
                        v-model="file"
                        accept="image/jpeg, image/png"
                        label="Logo"
                        clearable
                        prepend-icon=""
                        prepend-inner-icon=""
                        outlined
                        counter
                        show-size
                        small-chips
                        @change="uploadImage"
                      />
                    </v-expand-transition>
                  </v-col>
                  <v-col cols="12" md="6" class="mt-10 d-flex justify-center">
                    <v-img
                      v-if="
                        image.includes('data:image/jpeg;base64,') ||
                        image.includes('data:image/png;base64,')
                      "
                      :src="image"
                      class="rounded-lg elevation-3 justify-center"
                      contain
                      max-width="200"
                      max-height="200"
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
                      v-else-if="form.logo.length > 1"
                      :src="imgUrl + form.logo"
                      class="rounded-lg elevation-3 justify-center"
                      contain
                      max-width="200"
                      max-height="200"
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
                </v-row>
              </v-col>
              <v-divider></v-divider>
              <!-- BUTTON -->
              <v-col cols="12" class="d-flex justify-center">
                <v-btn
                  color="success"
                  type="submit"
                  :disabled="loading || $v.$anyError"
                  :loading="loading"
                  >actualizar</v-btn
                >
              </v-col>
            </v-row>
          </v-sheet>
          <!-- {{ branch }} -->
        </v-container>
      </v-form>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapState } from 'vuex'
import slugify from 'slugify'
import { required } from 'vuelidate/lib/validators'
const touchMap = new WeakMap()
export default {
  name: 'MyStoreBranch',
  data: () => ({
    original: {
      slug: '',
    },
    image: '',
    file: null,
    changeLogo: false,
    loading: false,
    form: {
      name: '',
      slug: '',
      logo: '',
    },
  }),
  validations: {
    form: {
      name: {
        required,
      },
      slug: {
        required,
        async isUnique(value) {
          if (value === '') return true
          if (value === this.original.slug) return true
          const res = await this.$axios.$get(`branch-validate/${value}`)
          return !res.valido
        },
      },
    },
  },
  computed: {
    ...mapState('administracion/branch', ['branch']),
    clientName: {
      get() {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.form.slug = slugify(this.form.name, {
          lower: true,
          strict: true,
        })
        return this.form.name
      },
      set(value) {
        this.form.name = value
      },
    },
    imgUrl() {
      return process.env.BASE_IMG_URL
    },
    // FORM VALIDATION
    nameErrors() {
      const errors = []
      if (!this.$v.form.slug.$dirty) return errors
      !this.$v.form.name.required &&
        errors.push('El nombre de tu negocio es requerido.')
      !this.$v.form.slug.isUnique &&
        errors.push('El nombre ingresado ya existe!')
      return errors
    },
  },
  mounted() {
    this.getBranch()
  },
  methods: {
    delayTouch($v) {
      $v.$reset()
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v))
      }
      touchMap.set($v, setTimeout($v.$touch, 1000))
    },
    async getBranch() {
      try {
        await this.$store.dispatch('administracion/branch/getResource', {
          id: this.$auth.user.branch.id,
        })
        this.original.slug = this.branch.slug
        this.form = Object.assign({}, this.branch)
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
        } else if (error.request) {
          this.$toast.error('Ocurrió un problema al cargar tu negocio')
        }
        console.log(error.toJSON())
      }
    },

    uploadImage(imagen) {
      this.createImage(imagen)
    },
    createImage(file) {
      if (file !== null) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.image = e.target.result
        }
        reader.readAsDataURL(file)
      } else {
        this.image = ''
      }
    },
    async updateResource() {
      try {
        this.loading = true
        this.$v.$touch()
        if (!this.$v.$invalid) {
          if (this.image.length > 0) {
            this.form.logo = this.image
          }
          await this.$store.dispatch(
            'administracion/branch/updateBranch',
            this.form
          )
          await this.getBranch()
          const user = await this.$axios.get('user')
          this.$auth.setUser(user.data)
          this.file = null
          this.$toast.success(`Tu negocio fue actualizado con éxito!`, {
            icon: 'mdi-checkbox-marked-circle-outline',
          })
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
        } else if (error.request) {
          this.$toast.error('Ocurrió un problema al cargar tu negocio')
        }
        console.log(error)
      } finally {
        setTimeout(() => {
          this.loading = false
        }, 1000)
      }
    },
  },
}
</script>

<style>
</style>