export default function ({ $auth, redirect }) {
  if ($auth.hasScope('dashboard:order')) {
    return true
  } else {
    return redirect('/db-admin/dashboard')
  }
}
