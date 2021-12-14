import { deserialize, serialize } from 'jsonapi-fractal'
export const state = () => ({
  products: [],
  product: {},
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
  SET_PRODUCTS(state, data) {
    state.products = data;
  },
  SET_PRODUCT(state, data) {
    state.product = data;
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
    const response = await this.$axios.$get(`products`, {
      params: {
        'filter[branch_id]': rootState.auth.user.branch ? rootState.auth.user.branch.id : null, // null para super admin
        'page[number]': params.page,
        'page[size]': params.itemsPerPage,
        sort: params.sortDesc[0] ? '-' + params.sortBy[0] : params.sortBy[0]
      },
    })
    commit("SET_TOTAL_DATA", response.meta.page.total)
    const data = deserialize(response, { changeCase: 'camelCase' })
    commit("SET_PRODUCTS", data)
  },

  // VER RECURSO {id}
  async getResource({ commit }, id) {
    const response = await this.$axios.$get(`products/${id}`, {
      params: {
        // 'include': 'branch'
      }
    })
    const serializedData = (deserialize(response, { changeCase: 'camelCase' }))
    commit("SET_PRODUCT", serializedData)
  },

  // CREAR RECURSO
  async createResource({ context, dispatch, state, rootState }, form) {
    const resource = {
      name: form.name,
      description: form.description,
      price: form.price,
      quantity: form.quantity,
      state: form.state,
      image: form.image,
      branch_id: rootState.auth.user.branch.id.toString()
    }
    const serialized = serialize(resource, 'products', { changeCase: 'snakeCase' })
    await console.log(serialized);
    await this.$axios.$post("products", serialized);
    await dispatch('getList', state.defaultOptions);
  },

  // ACTUALIZAR RECURSO
  async updateResource({ context, dispatch, state, rootState }, form) {
    const resource = {
      id: form.id,
      name: form.name,
      description: form.description,
      price: form.price,
      quantity: form.quantity,
      state: form.state,
      image: form.image,
      branch_id: rootState.auth.user.branch.id.toString()
    }
    const serialized = serialize(resource, 'products', { changeCase: 'snakeCase' })

    console.log(serialized);
    await this.$axios.$patch(`products/${form.id}`, serialized);
    await dispatch('getList', state.defaultOptions);
  },

  // ACTUALIZAR STOCK
  async updateQuantityResource({ context, dispatch, state, rootState }, form) {
    const resource = {
      id: form.item.id,
      name: form.item.name,
      description: form.item.description,
      price: form.item.price,
      quantity: form.quantity,
      state: form.item.state,
      image: form.item.image,
      branch_id: rootState.auth.user.branch.id.toString()
    }
    const serialized = serialize(resource, 'products', { changeCase: 'snakeCase' })
    console.log(serialized);
    await this.$axios.$patch(`products/${form.item.id}`, serialized);
    await dispatch('getList', state.defaultOptions);
  },

  // ELIMINAR RECURSO SOFT
  async deleteResource({ context, dispatch, state }, id) {
    const serialized = serialize(id, 'products', { changeCase: 'kebabCase' })
    await this.$axios.$delete(`products/${id}`, serialized);
    await dispatch('getList', state.defaultOptions);
  }
};
