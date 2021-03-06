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
        'filter[branch_id]': rootState.auth.user.branch ? rootState.auth.user.branch.id : null,
        'filter[username]': rootState.auth.user ? rootState.auth.user.username : null,
        'filter[rol]': rootState.auth.user.sa ? 'administrador' : null,
        'include': rootState.auth.user.sa ? 'branch' : null,
        'fields[branches]': 'name',
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
    const response = await this.$axios.$get(`staff/${id}`, {
      params: {
        'include': 'profile,profile.address'
      }
    })
    const serializedData = (deserialize(response, { changeCase: 'camelCase' }))
    commit("SET_EMPLEADO", serializedData)
  },

  // CREAR RECURSO
  async createResource({ context, dispatch, state }, form) {
    const resource = {
      data: {
        type: "staff",
        attributes: {
          username: form.username,
          state: form.state,
          password: form.password,
          role: form.roles,
          profile: {
            dateOfBirth: form.profile.dateOfBirth,
            lastName: form.profile.lastName,
            name: form.profile.name,
            codArea: form.profile.codArea,
            phone: form.profile.phone,
            address: {
              cp: form.profile.address.cp,
              dpto: form.profile.address.dpto,
              number: form.profile.address.number,
              piso: form.profile.address.piso,
              street: form.profile.address.street
            },
          }
        },
        relationships: {
          branch: {
            data: {
              type: "branches",
              id: form.branch.id
            }
          }
        }
      }
    }
    await this.$axios.$post("/staff", resource);
    await dispatch('getList', state.defaultOptions);
  },

  // ACTUALIZAR RECURSO
  async updateResource({ context, dispatch, state }, form) {
    const resource = {
      data: {
        id: form.id,
        type: "staff",
        attributes: {
          username: form.username,
          state: form.state,
          password: form.password,
          role: form.roles,
          profile: {
            id: form.profile.id,
            dateOfBirth: form.profile.dateOfBirth,
            lastName: form.profile.lastName,
            name: form.profile.name,
            codArea: form.profile.codArea,
            phone: form.profile.phone,
            address: {
              cp: form.profile.address.cp,
              dpto: form.profile.address.dpto,
              number: form.profile.address.number,
              piso: form.profile.address.piso,
              street: form.profile.address.street
            },
          }
        },
        relationships: {
          branch: {
            data: {
              type: "branches",
              id: form.branch.id
            }
          }
        }
      }
    }
    // console.log(resource);
    await this.$axios.$patch(`staff/${form.id}`, resource);
    await dispatch('getList', state.defaultOptions);
  },

  // ELIMINAR RECURSO SOFT
  async deleteResource({ context, dispatch, state }, id) {
    const serialized = serialize(id, 'staff', { changeCase: 'kebabCase' })
    await this.$axios.$delete(`staff/${id}`, serialized);
    await dispatch('getList', state.defaultOptions);
  }
};
