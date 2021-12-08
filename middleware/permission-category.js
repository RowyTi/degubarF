export default function ({ $auth, redirect }) {
    if ($auth.hasScope('dashboard:category')) {
        return true
    } else {
        return redirect('/db-admin/dashboard')
    }
}
