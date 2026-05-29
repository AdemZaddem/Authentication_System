import React from 'react'
import { useAuthStore } from '../store/authStore'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({children}:{children:React.ReactNode}) {
    const {token} = useAuthStore()

    if(!token)return<Navigate to='/login'/>
    return children
}

export default ProtectedRoute
