export default function ({ $auth, redirect }) {
    if ($auth.hasScope('dashboard:staff')) {
        return true
    } else {
        return redirect('/db-admin/dashboard')
    }
}
