export default function ({ $auth, redirect }) {
    if ($auth.hasScope('view:product') || $auth.hasScope('super-admin')){
        return true
    }else{
        return redirect('/db-admin/dashboard')
    }
}
  