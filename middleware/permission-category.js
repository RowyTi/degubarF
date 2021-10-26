export default function ({ $auth, redirect }) {
    if ($auth.hasScope('index:category') || $auth.hasScope('jklr')){
        return true
    }else{
        return redirect('/db-admin/dashboard')
    }
}
  