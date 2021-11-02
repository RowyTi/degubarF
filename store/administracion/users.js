import { deserialize, serialize } from 'jsonapi-fractal'
export const state = () => ({
  usuarios: [],
  usuario: {},
  totalData: null,
  defaultOptions:{
    page: 1,
    itemsPerPage: 10,
    sortBy:[],
    sortDesc:[]
  },
  searchUrl: ""
});

export const mutations = {
  SET_USERS(state, data) {
    state.usuarios = data;
  },
  SET_USER(state, data) {
    state.usuario = data;
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
    const response = await this.$axios.$get('users', {
      params: {
        'page[number]': params.page,
        'page[size]': params.itemsPerPage,
        sort: params.sortDesc[0] ? '-' + params.sortBy[0] : params.sortBy[0]
      },
    })
    commit("SET_TOTAL_DATA", response.meta.page.total)
    const data = deserialize(response, { changeCase: 'camelCase' })
    commit("SET_USERS", data)
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
  async deleteResource( {context, dispatch, state}, id ){
    const serialized = serialize(id, 'users', { changeCase: 'kebabCase' })
    await this.$axios.$delete(`users/${id}`, serialized);
    await dispatch('getList', state.defaultOptions);

  }
};
