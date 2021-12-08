export default function ({ $auth, redirect }) {
    if ($auth.hasScope('dashboard:branch')) {
        return true
    } else {
        return redirect('/db-admin/dashboard')
    }
}
