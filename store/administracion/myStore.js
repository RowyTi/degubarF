import { deserialize } from 'jsonapi-fractal'
export const state = () => ({
  address: {},
  branch: {},
  paymentKey: {},
  categories: [],
});

export const mutations = {
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
  }
};

export const actions = {
  // BRANCH
  async getBranch({ commit }, id) {
    const response = await this.$axios.$get(`branches/${id}`, {
      params: {
        // 'include': 'address',
        // 'fields[paymentkeys]': 'id',
        // 'fields[address]': 'id'
      }
    })
    const serializedData = (deserialize(response, { changeCase: 'camelCase' }))
    commit("SET_BRANCH", serializedData)
  },

  // BRANCH RELATION ADDRESS
  async getAddress({ commit }, id) {
    const response = await this.$axios.$get(`branches/${id}/addresses`)
    if (response.data !== null) {
      const serializedData = (deserialize(response, { changeCase: 'camelCase' }))
      commit("SET_ADDRESS", serializedData)
    }
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

};
