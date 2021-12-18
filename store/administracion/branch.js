import { deserialize, serialize } from 'jsonapi-fractal'
export const state = () => ({
  branches: [],
  branch: {},
  paymentKey: {},
  categories: {},
  address: {},
  orders: [],
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
  SET_PAYMENTKEY(state, data) {
    state.paymentKey = data;
  },
  SET_CATEGORIES(state, data) {
    state.categories = data;
  },
  SET_ADDRESS(state, data) {
    state.address = data;
  },
  SET_ORDERS(state, data) {
    state.orders = data;
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
  async getResource({ commit, }, params) {
    const response = await this.$axios.$get(`branches/${params.id}`, {
      params: {
        'include': params.include
      }
    })
    const serializedData = (deserialize(response, { changeCase: 'camelCase' }))
    commit("SET_BRANCH", serializedData)
  },

  // CREAR RECURSO
  async createResource({ context, dispatch, state }, form) {
    const resource = {
      name: form.name,
      slug: form.slug,
      state: form.state,
      addresses: {
        cp: form.address.cp,
        dpto: form.address.dpto,
        number: form.address.number,
        piso: form.address.piso,
        street: form.address.street,
        latitude: form.address.latitude.toString(),
        longitude: form.address.longitude.toString(),
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
      state: form.state,
      addresses: {
        id: form.address.id,
        cp: form.address.cp,
        dpto: form.address.dpto,
        number: form.address.number,
        piso: form.address.piso,
        street: form.address.street,
        latitude: form.address.latitude,
        longitude: form.address.longitude,
      }
    }
    const serialized = serialize(resource, 'branches', { changeCase: 'kebabCase' })
    // console.log(serialized);
    await this.$axios.$patch(`branches/${form.id}`, serialized);
    await dispatch('getList', state.defaultOptions);
  },

  async updateBranch({ context, dispatch, state }, form) {
    const resource = {
      id: form.id,
      name: form.name,
      slug: form.slug,
      state: form.state,
      logo: form.logo
    }
    const serialized = serialize(resource, 'branches', { changeCase: 'kebabCase' })
    // await console.log(serialized);
    await this.$axios.$patch(`branches/${form.id}`, serialized);
  },

  // ELIMINAR RECURSO SOFT
  async deleteResource({ context, dispatch, state }, id) {
    const serialized = serialize(id, 'branches', { changeCase: 'kebabCase' })
    await this.$axios.$delete(`branches/${id}`, serialized);
    await dispatch('getList', state.defaultOptions);
  },

  // BRANCH RELATION PAYMENTKEYS
  async getPaymentKeys({ commit }, id) {
    const response = await this.$axios.$get(`branches/${id}/paymentkey`)
    if (response.data !== null) {
      const serializedData = (deserialize(response, { changeCase: 'camelCase' }))
      commit("SET_PAYMENTKEY", serializedData)
    }
  },

  // BRANCH RELATION CATEGORIES
  async getCategories({ commit }, id) {
    const response = await this.$axios.$get(`branches/${id}/categories?fields[categories]=name,slug`)
    if (response.data !== null) {
      const serializedData = (deserialize(response, { changeCase: 'camelCase' }))
      commit("SET_CATEGORIES", serializedData)
    }
  },

  // BRANCH RELATION ADDRESS
  async getAddress({ commit }, id) {
    const response = await this.$axios.$get(`branches/${id}/addresses`)
    if (response.data !== null) {
      const serializedData = (deserialize(response, { changeCase: 'camelCase' }))
      commit("SET_ADDRESS", serializedData)
    }
  },

  // BRANCH RELATION ORDER
  async getOrders({ commit }, params) {
    const response = await this.$axios.$get(`branches/${params.id}/orders`, {
      params: {
        'page[number]': params.page,
        'page[size]': params.itemsPerPage,
        sort: params.sortDesc[0] ? '-' + params.sortBy[0] : params.sortBy[0]

      },
    })
    if (response.data !== null) {
      commit("SET_TOTAL_DATA", response.meta.page.total)
      const serializedData = (deserialize(response, { changeCase: 'camelCase' }))
      commit("SET_ORDERS", serializedData)
    }
  },



};
