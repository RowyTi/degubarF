export default function ({ $auth, redirect }) {
    if ($auth.hasScope('dashboard:product')) {
        return true
    } else {
        return redirect('/db-admin/dashboard')
    }
}
