import React from 'react'
import { useAuthStore } from '../store/authStore'
import { Navigate } from 'react-router-dom'

function AdminRoute({children}:{children:React.ReactNode}) {
  const {token,user} = useAuthStore()
  if(!token)return <Navigate to={'/login'}/>
  if(user?.role !== 'admin')return <Navigate to='/dashboard'/>
  return children
}

export default AdminRoute
