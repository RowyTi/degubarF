export default function ({ $auth, redirect }) {
  if ($auth.hasScope('dashboard')) {
    return true
  } else {
    return redirect('/login')
  }
}
