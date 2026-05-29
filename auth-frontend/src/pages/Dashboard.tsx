import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function Dashboard() {
    const {user,logout} = useAuthStore()
    const navigate = useNavigate()

    function handleLogout(){
        logout()
        navigate('/login')
    }
  return (
    <div>
      <h1>Welocme back {user?.email}</h1>
      <p>Role: {user?.role}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard
