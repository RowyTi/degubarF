import { deserialize, serialize } from 'jsonapi-fractal'
export const state = () => ({
  address: {},
});

export const mutations = {
  SET_ADDRESS(state, data) {
    state.address = data;
  },
};

export const actions = {

  // VER RECURSO {id}
  async getResource({ commit }, id) {
    const response = await this.$axios.$get(`addresses/${id}`)
    const serializedData = (deserialize(response, { changeCase: 'camelCase' }))
    commit("SET_ADDRESS", serializedData)
  },


  // ACTUALIZAR RECURSO
  async updateResource({ context, dispatch, state, rootState }, form) {
    const resource = {
      id: form.id,
      cp: form.cp,
      dpto: form.dpto,
      number: form.number,
      piso: form.piso,
      street: form.street,
      latitude: form.latitude,
      longitude: form.longitude,
    }
    const serialized = serialize(resource, 'addresses', { changeCase: 'kebabCase' })
    console.log(serialized);
    await this.$axios.$patch(`addresses/${form.id}`, serialized);
  },
};
