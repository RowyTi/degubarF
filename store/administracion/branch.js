import { deserialize, serialize } from 'jsonapi-fractal'
export const state = () => ({
  branches: [],
  branch: {},
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
    const response = await this.$axios.$get(`branches`, {
      params: {
        // 'filter[branch_id]': rootState.auth.user.branch_id, // null para super admin
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
        // 'include': 'profile,profile.address'
      }
    })
    const serializedData = (deserialize(response, { changeCase: 'camelCase' }))
    commit("SET_BRANCH", serializedData)
  },

  // CREAR RECURSO
  async createResource({ context, dispatch, state }, form) {
    const resource = {
      username: form.username,
      state: form.state,
      password: form.password,
      branches: {
        id: form.branch_id
      },
      profile: {
        avatar: "rutadefualt.png",
        dateOfBirth: form.profile.dateOfBirth,
        lastName: form.profile.lastName,
        name: form.profile.name,
        phone: form.profile.phone,
        address: {
          cp: form.profile.address.cp,
          dpto: form.profile.address.dpto,
          number: form.profile.address.number,
          piso: form.profile.address.piso,
          street: form.profile.address.street
        }
      }
    }
    const serialized = serialize(resource, 'staff', { relationships: ['branches'], changeCase: 'kebabCase' })
    await this.$axios.$post("/staff", serialized);
    await dispatch('getList', state.defaultOptions);
  },

  // ACTUALIZAR RECURSO
  async updateResource({ context, dispatch, state }, form) {
    const resource = {
      id: form.id,
      username: form.username,
      state: form.state,
      password: form.password,
      profile: {
        id: form.profile.id,
        avatar: "rutadefualt.png",
        dateOfBirth: form.profile.dateOfBirth,
        lastName: form.profile.lastName,
        name: form.profile.name,
        phone: form.profile.phone,
        address: {
          cp: form.profile.address.cp,
          dpto: form.profile.address.dpto,
          number: form.profile.address.number,
          piso: form.profile.address.piso,
          street: form.profile.address.street
        }
      }
    }
    const serialized = serialize(resource, 'staff', { changeCase: 'kebabCase' })
    await this.$axios.$patch(`staff/${form.id}`, serialized);
    await dispatch('getList', state.defaultOptions);
  },

  // ELIMINAR RECURSO SOFT
  async deleteResource({ context, dispatch, state }, id) {
    const serialized = serialize(id, 'staff', { changeCase: 'kebabCase' })
    await this.$axios.$delete(`staff/${id}`, serialized);
    await dispatch('getList', state.defaultOptions);
  }
};
