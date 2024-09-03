import React from 'react'
import { Link } from 'react-router-dom'
import {Home, Compass, Search, User,Settings} from 'lucide-react'
import { FaUsers } from "react-icons/fa";
import LogoutButton from '../modules/LogoutButton';

const ProfileSideBar = () => {
  const pathname = window.location.pathname
  return (
    <div className='flex flex-col gap-3'>
      <Link to={'/'} className='text-lg font-bold text-center m-3'>Campus Chronicles</Link>
      <Link to='/' className='hover:bg-muted duration-150 flex gap-2 items-center text-lg p-3'>
        <Home/>
        <div>Home</div>
      </Link>
      <Link to='/explore' className='hover:bg-muted flex gap-2 items-center text-lg p-3'>
        <Compass/>
        <div>Explore</div>
      </Link>
      <Link to='/search' className='hover:bg-muted flex gap-2 items-center text-lg p-3'>
        <Search/>
        <div>Search</div>
      </Link>
      <Link to='/groups' className='hover:bg-muted flex gap-2 items-center text-lg p-3'>
        <FaUsers className='text-2xl'/>
        <div>Groups</div>
      </Link>
      <Link to='/profile' className={`hover:bg-muted flex gap-2 items-center text-lg p-3 ${pathname === '/profile' ? 'bg-muted text-xl font-bold' : ''}`}>
        <User strokeWidth={4}/>
        <div>Profile</div>
      </Link>
      <Link to='/settings' className='hover:bg-muted flex gap-2 items-center text-lg p-3'>
        <Settings/>
        <div>Settings</div>
      </Link>
      <LogoutButton className='mt-14 mx-5'/>
            
    </div>
  )
}

export default ProfileSideBar
