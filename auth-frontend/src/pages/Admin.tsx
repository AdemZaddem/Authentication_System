import React from 'react'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

function Admin() {
    const {logout} = useAuthStore()
    const navigate = useNavigate()
    function handleLogout(){
        logout()
        navigate('/login')
    }
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Only admins can see this</p>
      <button onClick={handleLogout}>LogOut</button>
    </div>
  )
}

export default Admin
