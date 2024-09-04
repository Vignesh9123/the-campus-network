import React from 'react'
import { Link } from 'react-router-dom'
import {Home, Compass, Search, User,Settings} from 'lucide-react'
import { FaUsers } from "react-icons/fa";
import LogoutButton from '../modules/LogoutButton';

const ProfileSideBar = () => {
  const pathname = window.location.pathname
  return (
    <div className='flex flex-col gap-3'>
      <Link to={'/'} className=' md:hidden font-bold text-center m-3'>CC</Link>
      <Link to={'/'} className='hidden md:block text-2xl font-bold text-center m-3'>Campus Chronicles</Link>
      <Link to='/' className='hover:bg-muted duration-150 flex gap-2 items-center text-lg p-3'>
        <Home className='mx-auto md:mx-0'/>
        <div className='hidden md:block'>Home</div>
      </Link>
      <Link to='/explore' className='hover:bg-muted flex gap-2 items-center text-lg p-3'>
        <Compass className='mx-auto md:mx-0'/>
        <div className='hidden md:block'>Explore</div>
      </Link>
      <Link to='/search' className='hover:bg-muted flex gap-2 items-center text-lg p-3'>
        <Search className='mx-auto md:mx-0'/>
        <div className='hidden md:block'>Search</div>
      </Link>
      <Link to='/groups' className='hover:bg-muted flex gap-2 items-center text-lg p-3'>
        <FaUsers className='text-2xl mx-auto md:mx-0'/>
        <div className='hidden md:block'>Groups</div>
      </Link>
      <Link to='/profile' className={`hover:bg-muted flex gap-2 items-center text-lg p-3 ${pathname === '/profile' ? 'bg-muted text-xl font-bold' : ''}`}>
        <User className='mx-auto md:mx-0' strokeWidth={4}/>
        <div className='hidden md:block'>Profile</div>
      </Link>
      <Link to='/settings' className='hover:bg-muted flex gap-2 items-center text-lg p-3'>
        <Settings className='mx-auto md:mx-0'/>
        <div className='hidden md:block'>Settings</div>
      </Link>
      <LogoutButton className='hidden md:block mt-16 mx-5'/>
            
    </div>
  )
}

export default ProfileSideBar
