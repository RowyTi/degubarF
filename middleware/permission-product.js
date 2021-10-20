export default function ({ $auth, redirect }) {
    if ($auth.hasScope('view:product') || $auth.hasScope('jklr')){
        return true
    }else{
        return redirect('/db-admin/dashboard')
    }
}
  