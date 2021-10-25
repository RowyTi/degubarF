import { deserialize, serialize } from 'jsonapi-fractal'
export const state = () => ({
  staff: [],
  empleado: {},
  totalData: null,
  defaultOptions: {
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
    sortDesc: []
  },
  searchUrl: ""
});

export const mutations = {
  SET_STAFF(state, data) {
    state.staff = data;
  },
  SET_EMPLEADO(state, data) {
    state.empleado = data;
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
    const response = await this.$axios.$get(`staff`, {
      params: {
        'filter[branch_id]': rootState.auth.user.branch_id, // null para super admin
        'page[number]': params.page,
        'page[size]': params.itemsPerPage,
        sort: params.sortDesc[0] ? '-' + params.sortBy[0] : params.sortBy[0]
      },
    })
    commit("SET_TOTAL_DATA", response.meta.page.total)
    const data = deserialize(response, { changeCase: 'camelCase' })
    commit("SET_STAFF", data)
  },

  // VER RECURSO {id}
  async getResource({ commit }, id) {
    const response = await this.$axios.$get(`users/${id}`)
    const serializedData = (deserialize(response, { changeCase: 'camelCase' }))
    commit("SET_USER", serializedData)
  },

  // CREAR RECURSO
  async createResource({ context, dispatch, state }, form) {
    const resource = {
      name: form.name,
      email: form.email,
      password: form.password
    }
    const serialized = serialize(resource, 'users', { changeCase: 'kebabCase' })
    await this.$axios.$post("/users", serialized);
    await dispatch('getList', state.defaultOptions);
  },

  // ACTUALIZAR RECURSO
  async updateResource({ context, dispatch, state }, form) {
    const resource = {
      id: form.id,
      name: form.name,
      email: form.email,
      password: form.password
    }
    const serialized = serialize(resource, 'users', { changeCase: 'kebabCase' })
    await this.$axios.$patch(`users/${form.id}`, serialized);
    await dispatch('getList', state.defaultOptions);
  },

  // ELIMINAR RECURSO SOFT
  async deleteResource({ context, dispatch, state }, id) {
    const serialized = serialize(id, 'users', { changeCase: 'kebabCase' })
    await this.$axios.$delete(`users/${id}`, serialized);
    await dispatch('getList', state.defaultOptions);

  }
};
