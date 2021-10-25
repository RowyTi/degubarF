export default function ({ $auth, redirect }) {
    if ($auth.hasScope('index:staff') || $auth.hasScope('jklr')) {
        return true
    } else {
        return redirect('/db-admin/dashboard')
    }
}
