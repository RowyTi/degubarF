export default function ({ $auth, redirect }) {
    if ($auth.hasScope('view:category') || $auth.hasScope('jklr')){
        return true
    }else{
        return redirect('/db-admin/dashboard')
    }
}
  