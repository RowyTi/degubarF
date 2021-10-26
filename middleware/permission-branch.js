export default function ({ $auth, redirect }) {
    if ($auth.hasScope('index:branch') || $auth.hasScope('jklr')){
        return true
    }else{
        return redirect('/db-admin/dashboard')
    }
}
  