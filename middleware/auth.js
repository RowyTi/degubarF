export default function ({ store, redirect }) {
  console.log(store.state.auth.loggedIn);
  // if (store.state.auth.loggedIn) {
  console.log("working");
  //   return redirect("/");
  // }
}
