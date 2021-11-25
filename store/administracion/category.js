import { deserialize, serialize } from 'jsonapi-fractal'
export const state = () => ({
  categories: [],
  category: {},
  totalData: null,
  defaultOptions: {
    page: 1,
    itemsPerPage: 10,
    sortBy: ['updatedAt'],
    sortDesc: [true],
  },
  searchUrl: ""
});

export const mutations = {
  SET_CATEGORIES(state, data) {
    state.categories = data;
  },
  SET_CATEGORY(state, data) {
    state.category = data;
  },
  SET_TOTAL_DATA(state, data) {
    state.totalData = data;
  },
  SET_SEARCH_URL(state, data) {
    state.searchUrl = data;
  }
};

export const actions = {
  // LISTAR RECURSOS 10/pag default
  async getList({ commit }, params) {
    // console.log(params)
    const response = await this.$axios.$get(`categories`, {
      params: {
        // 'filter[branch_id]': rootState.auth.user.branch_id, // null para super admin
        'include': 'branches',
        'page[number]': params.page,
        'page[size]': params.itemsPerPage,
        sort: params.sortDesc[0] ? '-' + params.sortBy[0] : params.sortBy[0]
      },
    })
    commit("SET_TOTAL_DATA", response.meta.page.total)
    const data = deserialize(response, { changeCase: 'camelCase' })
    commit("SET_CATEGORIES", data)
  },

  // VER RECURSO {id}
  async getResource({ commit }, id) {
    const response = await this.$axios.$get(`categories/${id}`, {
      params: {
        'include': 'branches',
      }
    })
    const serializedData = (deserialize(response, { changeCase: 'camelCase' }))
    // console.log(serializedData)
    commit("SET_CATEGORY", serializedData)
  },

  // CREAR RECURSO
  async createResource({ context, dispatch, state }, form) {
    const resource = {
      name: form.name,
      slug: form.slug
    }
    const serialized = serialize(resource, 'categories', { changeCase: 'kebabCase' })
    await this.$axios.$post("categories", serialized);
    await dispatch('getList', state.defaultOptions);
  },

  // ACTUALIZAR RECURSO
  async updateResource({ context, dispatch, state }, form) {
    const resource = {
      id: form.id,
      name: form.name,
      slug: form.slug,
    }
    const serialized = serialize(resource, 'categories', { changeCase: 'kebabCase' })
    await this.$axios.$patch(`categories/${form.id}`, serialized);
    await dispatch('getList', state.defaultOptions);
  },

  // ELIMINAR RECURSO SOFT
  async deleteResource({ context, dispatch, state }, id) {
    const serialized = serialize(id, 'categories', { changeCase: 'kebabCase' })
    await this.$axios.$delete(`categories/${id}`, serialized);
    await dispatch('getList', state.defaultOptions);
  }
};
