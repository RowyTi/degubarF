export default function({ store, redirect }) {
  if (store.state.auth.loggedIn) {
    // console.log("working");
    return redirect("/db-admin/dashboard");
  }
}
