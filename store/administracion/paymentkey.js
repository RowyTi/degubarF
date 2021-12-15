import { deserialize, serialize } from 'jsonapi-fractal'
export const state = () => ({
  paymentKey: {},
});

export const mutations = {
  SET_PAYMENTKEY(state, data) {
    state.paymentKey = data;
  },
};

export const actions = {
  // CREAR RECURSO
  async createResource({ context, dispatch, rootState }, form) {
    const resource = {
      access_token: form.access_token,
      public_token: form.public_token,
      branch_id: rootState.auth.user.branch.id
    }
    const serialized = serialize(resource, 'paymentkeys', { changeCase: 'snakeCase' })
    // console.log(serialized);
    await this.$axios.$post("paymentkeys", serialized);
    await dispatch('getPaymentKey', rootState.auth.user.branch.id);
  },

  // ACTUALIZAR RECURSO
  async updateResource({ context, dispatch, rootState }, form) {
    const resource = {
      id: form.id,
      access_token: form.access_token,
      public_token: form.public_token,
      branch_id: rootState.auth.user.branch.id
    }
    const serialized = serialize(resource, 'paymentkeys', { changeCase: 'snakeCase' })
    // console.log(serialized);
    await this.$axios.$patch(`paymentkeys/${form.id}`, serialized);
    await dispatch('getPaymentKey', rootState.auth.user.branch.id);
  },

  // OBTENER PAYMENTKEYS MEDIANTE RELACION CON BRANCH
  async getPaymentKey({ commit }, id) {
    const response = await this.$axios.$get(`branches/${id}/paymentkey`)
    if (response.data !== null) {
      const serializedData = (deserialize(response, { changeCase: 'snakeCase' }))
      commit("SET_PAYMENTKEY", serializedData)
    } else {
      commit("SET_PAYMENTKEY", null)
    }

  },
};
