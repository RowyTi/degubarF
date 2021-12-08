export default function ({ $auth, redirect }) {
    if ($auth.hasScope('dashboard:user')) {
        return true
    } else {
        return redirect('/db-admin/dashboard')
    }
}
