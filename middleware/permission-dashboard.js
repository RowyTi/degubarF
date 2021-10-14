export default function ({ $auth, redirect }) {
  if (!$auth.hasScope('view-dashboard')) {
    return redirect('/login')
  }
}
