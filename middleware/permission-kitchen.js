export default function ({ $auth, redirect }) {
  if ($auth.hasScope('dashboard:kitchen')) {
      return true
  } else {
      return redirect('/db-admin/dashboard')
  }
}