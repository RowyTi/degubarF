export default function ({ $auth, redirect }) {
  if ($auth.hasScope('index:dashboard') || $auth.hasScope('jklr')){
    return true
  }else {
    return redirect('/')
  }
}
