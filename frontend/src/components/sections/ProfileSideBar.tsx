import { Link } from 'react-router-dom'
import {Home, Compass, Search, User,Settings} from 'lucide-react'
import { FaUsers } from "react-icons/fa";
import LogoutButton from '../modules/LogoutButton';

const ProfileSideBar = () => {
  const pathname = window.location.pathname
  return (
    <div className='flex flex-col gap-3 max-h-screen'>
      <Link to={'/'} className=' md:hidden font-bold text-center m-3'>TCN</Link>
      <Link to={'/'} className='hidden md:block text-2xl font-bold text-center m-3'>The Campus Network</Link>
      <Link to='/' className='hover:bg-muted duration-150 flex gap-2 items-center text-lg p-3'>
        <Home className='mx-auto md:mx-0'/>
        <div className='hidden md:block'>Home</div>
      </Link>
      <Link to='/explore' className={`hover:bg-muted flex gap-2 items-center text-lg p-3 ${pathname === '/explore' ? 'bg-muted text-xl font-bold' : ''}`}>
        <Compass strokeWidth={pathname=='/explore'?4:2} className='mx-auto md:mx-0'/>
        <div className='hidden md:block'>Explore</div>
      </Link>
      <Link to='/search' className={`hover:bg-muted flex gap-2 items-center text-lg p-3 ${pathname === '/search' ? 'bg-muted text-xl font-bold' : ''}`}>
        <Search strokeWidth={pathname=='/search'?4:3} className='mx-auto md:mx-0'/>
        <div className='hidden md:block'>Search</div>
      </Link>
      <Link to='/groups' className='hover:bg-muted flex gap-2 items-center text-lg p-3'>
        <FaUsers className='text-2xl mx-auto md:mx-0'/>
        <div className='hidden md:block'>Groups</div>
      </Link>
      <Link to='/profile' className={`hover:bg-muted flex gap-2 items-center text-lg p-3 ${pathname === '/profile' ? 'bg-muted text-xl font-bold' : ''}`}>
        <User className='mx-auto md:mx-0' strokeWidth={pathname=='/profile'?4:3}/>
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
