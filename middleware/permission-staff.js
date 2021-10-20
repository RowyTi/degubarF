export default function ({ $auth, redirect }) {
    if ($auth.hasScope('view:staff') || $auth.hasScope('jklr')){
        return true
    }else{
        return redirect('/db-admin/dashboard')
    }
}
  