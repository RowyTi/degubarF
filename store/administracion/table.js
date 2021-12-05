import { deserialize, serialize } from 'jsonapi-fractal'
export const state = () => ({
  tables: [],
  table: {},
  totalData: null,
  defaultOptions: {
    page: 1,
    itemsPerPage: 10,
    sortBy: ['updatedAt'],
    sortDesc: [true]
  },
  searchUrl: ""
});

export const mutations = {
  SET_TABLES(state, data) {
    state.tables = data;
  },
  SET_TABLE(state, data) {
    state.table = data;
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
  async getList({ commit, rootState }, params) {
    const response = await this.$axios.$get(`tables`, {
      params: {
        'filter[branch_id]': rootState.auth.user.branch ? rootState.auth.user.branch.id : null, // null para super admin
        'page[number]': params.page,
        'page[size]': params.itemsPerPage,
        sort: params.sortDesc[0] ? '-' + params.sortBy[0] : params.sortBy[0]
      },
    })
    commit("SET_TOTAL_DATA", response.meta.page.total)
    const data = deserialize(response, { changeCase: 'camelCase' })
    commit("SET_TABLES", data)
  },

  // VER RECURSO {id}
  async getResource({ commit }, id) {
    const response = await this.$axios.$get(`tables/${id}`, {
      params: {
        // 'include': 'branch'
      }
    })
    const serializedData = (deserialize(response, { changeCase: 'camelCase' }))
    commit("SET_TABLE", serializedData)
  },

  // CREAR RECURSO
  async createResource({ context, dispatch, state, rootState }, form) {
    const resource = {
      name: form.name,
      slug: form.slug,
      state: form.state,
      qr: form.qr,
      branch_id: rootState.auth.user.branch_id.toString()
    }
    const serialized = serialize(resource, 'tables', { changeCase: 'snakeCase' })
    // await console.log(serialized);
    await this.$axios.$post("/tables", serialized);
    await dispatch('getList', state.defaultOptions);
  },

  // ACTUALIZAR RECURSO
  async updateResource({ context, dispatch, state }, form) {
    const resource = {
      id: form.id,
      name: form.name,
      slug: form.slug,
      state: form.state,
      qr: form.qr,
      branch_id: form.branchId.toString()
    }
    const serialized = serialize(resource, 'tables', { changeCase: 'snakeCase' })
    console.log(serialized);
    await this.$axios.$patch(`tables/${form.id}`, serialized);
    await dispatch('getList', state.defaultOptions);
  },

  // ELIMINAR RECURSO SOFT
  async deleteResource({ context, dispatch, state }, id) {
    const serialized = serialize(id, 'tables', { changeCase: 'kebabCase' })
    await this.$axios.$delete(`tables/${id}`, serialized);
    await dispatch('getList', state.defaultOptions);
  }
};
