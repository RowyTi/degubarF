<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <div class="d-flex">
        <v-icon color="primary" class="mr-2">mdi-tag</v-icon>
        <h2 class="text-overline">Categorías</h2>
      </div>
      <template #actions>
        <v-icon color="primary"> $expand </v-icon>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-container>
        <v-sheet max-width="800" class="mx-auto">
          <v-row align="start" justify="center" class="mx-auto">
            <v-col cols="12" sm="6" class="mt-10">
              <h3>Categorías asignadas</h3>
              <v-divider class="mb-2"></v-divider>
              <v-sheet
                v-if="loading"
                class="d-flex align-center justify-center"
                height="200"
              >
                <v-progress-circular
                  v-show="loading"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </v-sheet>

              <v-sheet
                v-show="!loading"
                v-if="selectedCategories.length > 0"
                height="200"
              >
                <v-slide-x-transition group>
                  <v-chip
                    v-for="(category, i) in selectedCategories"
                    :key="category.id"
                    label
                    color="primary"
                    class="ma-1"
                    @click="addCategory(i)"
                  >
                    {{ category.name }}
                  </v-chip>
                </v-slide-x-transition>
              </v-sheet>
              <v-alert v-else type="info" outlined dense
                >No hay categorías asignadas</v-alert
              >
            </v-col>
            <v-divider vertical></v-divider>
            <v-col cols="12" sm="6" class="mt-10">
              <h3>Todas las categorías</h3>
              <v-divider class="mb-2"></v-divider>
              <v-sheet
                v-if="loading"
                class="d-flex align-center justify-center"
                height="200"
              >
                <v-progress-circular
                  v-show="loading"
                  indeterminate
                  color="primary"
                ></v-progress-circular>
              </v-sheet>

              <v-sheet v-if="categories.length > 0">
                <v-slide-x-transition group>
                  <v-chip
                    v-for="(category, i) in categories"
                    v-show="!loading"
                    :key="category.id"
                    label
                    color="accent"
                    class="ma-1"
                    @click="removeCategory(i)"
                  >
                    {{ category.name }}
                  </v-chip>
                </v-slide-x-transition>
              </v-sheet>
              <v-alert v-else type="success" outlined dense
                >Tenés todas las categorías disponibles asignadas</v-alert
              >
            </v-col>
            <v-divider></v-divider>
            <v-col cols="12" class="d-flex justify-end">
              <v-btn
                :disabled="loading"
                :loading="loading"
                color="success"
                @click="updateCategories($auth.user.branch.id)"
                >actualizar</v-btn
              >
            </v-col>
          </v-row>
        </v-sheet>
      </v-container>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { serialize, deserialize } from 'jsonapi-fractal'
export default {
  name: 'MyStoreCategory',
  props: {
    data: {
      type: Array,
      require: true,
      default: () => [],
    },
  },
  data: () => ({
    loading: false,
    categories: [],
    selectedCategories: [],
  }),
  mounted() {
    this.getSelectedCategories(this.$auth.user.branch.id)
  },
  methods: {
    async getSelectedCategories(id) {
      this.loading = true
      const response = await this.$axios.$get(
        `branches/${id}/categories?fields[categories]=name,slug`
      )
      if (response.data !== null) {
        const serializedData = deserialize(response, {
          changeCase: 'camelCase',
        })
        this.selectedCategories = serializedData
      }
      await this.getAllCategories()
      this.loading = false
    },
    async getAllCategories(value) {
      this.loading = true
      const assigned = this.pluck(this.selectedCategories, 'slug').toString()
      const res = await this.$axios.get('categories', {
        params: {
          'fields[categories]': 'name,slug',
          'filter[assigned]': assigned,
        },
      })

      this.categories = deserialize(res.data, { changeCase: 'camelCase' })
      this.loading = false
    },
    async updateCategories(id) {
      try {
        this.loading = true
        const selected = []
        this.selectedCategories.forEach((e) => {
          selected.push({ id: e.id })
        })
        const serialized = serialize(selected, 'categories', {
          changeCase: 'kebabCase',
        })
        await this.$axios.patch(
          `/branches/${id}/relationships/categories`,
          serialized
        )
        await this.$toast.success(
          `Las categorias fueron asignadas con éxito!`,
          {
            icon: 'mdi-checkbox-marked-circle-outline',
          }
        )
      } catch (error) {
        if (error.response) {
          if (error.response.status === 500) this.$toast.global.e500()
          if (error.response.status === 403) this.$toast.global.e403()
        } else if (error.request) {
          this.$toast.error('Ocurrio un problema al asignar las categorias')
        } else {
          this.$toast.error('Ocurrio un problema al asignar las categorias')
        }
      } finally {
        setTimeout(() => {
          this.loading = false
        }, 1000)
      }
    },
    pluck(array, key) {
      return array.map((a) => a[key])
    },
    addCategory(i) {
      const deselected = this.selectedCategories[i]
      this.selectedCategories.splice(i, 1)
      this.categories.push(deselected)
    },
    removeCategory(i) {
      const selected = this.categories[i]
      this.categories.splice(i, 1)
      this.selectedCategories.push(selected)
    },
  },
}
</script>

<style>
</style>