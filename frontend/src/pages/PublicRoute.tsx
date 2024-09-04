import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
function PublicRoute() {
    const {user} = useAuth();
  if(user){
    return <Navigate to="/profile" replace />
  }
  return (
    <div>
        <Outlet />
    </div>
  )
}


export default PublicRoute
