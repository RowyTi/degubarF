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
      <v-container :branch="branch">
        <v-sheet max-width="800" class="mx-auto">
          <v-sheet></v-sheet>
          <v-row v-show="!loading" justify="center" class="mx-auto">
            <v-col cols="12" md="6" class="mt-10">
              <v-text-field
                v-model="form.name"
                label="Nombre de tu negocio"
                outlined
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
            <v-divider></v-divider>
            <v-col cols="12" class="d-flex justify-end">
              <v-btn color="success">actualizar</v-btn>
            </v-col>
          </v-row>
        </v-sheet>
        <!-- {{ branch }} -->
      </v-container>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'MyStoreBranch',
  data: () => ({
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

  computed: {
    ...mapState('administracion/branch', ['branch']),
    imgUrl() {
      return process.env.BASE_IMG_URL
    },
  },
  mounted() {
    this.getBranch()
  },
  methods: {
    async getBranch() {
      try {
        await this.$store.dispatch('administracion/branch/getResource', {
          id: this.$auth.user.branch.id,
        })
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
  },
}
</script>

<style>
</style>