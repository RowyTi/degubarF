export const getters = {
    isAuthenticated(state) {
      return state.auth.loggedIn;
    },
    user(state) {
      return state.auth.user;
    },
    // userFoto(state) {
    //   if (state.auth.user) {
    //     return "data:image/jpeg;base64," + state.auth.user.foto;
    //   }
    // }
  };