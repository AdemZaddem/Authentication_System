import React from 'react'
import Login from './pages/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import { Navigate } from 'react-router-dom'
import AdminRoute from './components/AdminRoute'
import Admin from './pages/Admin'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboard' element={
         <ProtectedRoute>
          <Dashboard/>
        </ProtectedRoute>
      }/>
      <Route path='/admin' element={
        <AdminRoute>
          <Admin/>
        </AdminRoute>
      }/>
       <Route path='*' element={<Navigate to='/login'/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
