export default function ({ $auth, redirect }) {
    if ($auth.hasScope('index:user') || $auth.hasScope('jklr')) {
        return true
    } else {
        return redirect('/db-admin/dashboard')
    }
}
