export default function ({ $auth, redirect }) {
    if ($auth.hasScope('dashboard:table')) {
        return true
    } else {
        return redirect('/db-admin/dashboard')
    }
}
