import { deserialize, serialize } from 'jsonapi-fractal'
export const state = () => ({
  branches: [],
  branch: {},
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
  SET_BRANCHES(state, data) {
    state.branches = data;
  },
  SET_BRANCH(state, data) {
    state.branch = data;
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
    const response = await this.$axios.$get(`branches`, {
      params: {
        'page[number]': params.page,
        'page[size]': params.itemsPerPage,
        sort: params.sortDesc[0] ? '-' + params.sortBy[0] : params.sortBy[0]
      },
    })
    commit("SET_TOTAL_DATA", response.meta.page.total)
    const data = deserialize(response, { changeCase: 'camelCase' })
    commit("SET_BRANCHES", data)
  },

  // VER RECURSO {id}
  async getResource({ commit }, id) {
    const response = await this.$axios.$get(`branches/${id}`, {
      params: {
        'include': 'address'
      }
    })
    const serializedData = (deserialize(response, { changeCase: 'camelCase' }))
    // console.log(serializedData)
    commit("SET_BRANCH", serializedData)
  },

  // CREAR RECURSO
  async createResource({ context, dispatch, state }, form) {
    const resource = {
      name: form.name,
      slug: form.slug,
      latitud: form.latitud.toString(),
      longitud: form.longitud.toString(),
      state: form.state,
      addresses: {
        cp: form.address.cp,
        dpto: form.address.dpto,
        number: form.address.number,
        piso: form.address.piso,
        street: form.address.street
      }
    }
    const serialized = serialize(resource, 'branches', { changeCase: 'kebabCase' })
    await this.$axios.$post("branches", serialized);
    await dispatch('getList', state.defaultOptions);
  },

  // ACTUALIZAR RECURSO
  async updateResource({ context, dispatch, state }, form) {
    const resource = {
      id: form.id,
      name: form.name,
      slug: form.slug,
      latitud: form.latitud,
      longitud: form.longitud,
      state: form.state,
      addresses: {
        id: form.address.id,
        cp: form.address.cp,
        dpto: form.address.dpto,
        number: form.address.number,
        piso: form.address.piso,
        street: form.address.street
      }
    }
    const serialized = serialize(resource, 'branches', { changeCase: 'kebabCase' })
    // console.log(form)
    // console.log(resource);
    // console.log(serialized)
    await this.$axios.$patch(`branches/${form.id}`, serialized);
    await dispatch('getList', state.defaultOptions);
  },

  // ELIMINAR RECURSO SOFT
  async deleteResource({ context, dispatch, state }, id) {
    const serialized = serialize(id, 'branches', { changeCase: 'kebabCase' })
    await this.$axios.$delete(`branches/${id}`, serialized);
    await dispatch('getList', state.defaultOptions);
  }
};
