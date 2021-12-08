export default function ({ $auth, redirect }) {
    if ($auth.hasScope('dashboard:customer')) {
        return true
    } else {
        return redirect('/db-admin/dashboard')
    }
}
