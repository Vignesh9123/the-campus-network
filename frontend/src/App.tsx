import React from 'react'
import LandingPage from './components/sections/LandingPage'
import Login from './pages/Login'
import SetLogin from './pages/SetLogin'
import {Route, Routes, Navigate} from 'react-router-dom'
import RegisterForm from './pages/Register'
import Profile from './pages/Profile'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/setLogin' element={<SetLogin/>}/>
        <Route path='/register' element={<RegisterForm/>}/>
        <Route path='/profile' element={<Profile/>}/>
      </Routes>
      
    </div>
  )
}
 

export default App
