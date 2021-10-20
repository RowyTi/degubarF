export default function ({ $auth, redirect }) {
  if ($auth.hasScope('view:dashboard') || $auth.hasScope('jklr')){
    return true
  }else {
    return redirect('/')
  }
}
