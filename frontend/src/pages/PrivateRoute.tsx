import React from 'react'
import {Outlet,Navigate} from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
function PrivateRoute() {
    const {user}=useAuth()
    console.log(user)
  if(!user){
    return <Navigate to='/login' replace/>
  }
  return <Outlet/>
}
 

export default PrivateRoute
