export default function ({ $auth, redirect }) {
    if ($auth.hasScope('view:user') || $auth.hasScope('super-admin')){
        return true
    }else{
        return redirect('/db-admin/dashboard')
    }
}
  