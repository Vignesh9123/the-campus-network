import { Link } from 'react-router-dom'
import {Compass, Search,Settings,MessageCircle, } from 'lucide-react'
import { FaUsers } from "react-icons/fa";
import LogoutButton from '../modules/LogoutButton';
import { useAuth } from '@/context/AuthContext';

const ProfileSideBar = () => {
  const {user} = useAuth()
  const {pathname} = window.location
  return (
    <div className='flex flex-col gap-3 max-h-screen'>
      {/* <Link to={'/'} className=' md:hidden font-bold text-center m-3'>TCN</Link> */}
      <div className="flex items-center justify-center gap-2">
      <Link to="/"><img src="/TCN%20Logo%20WO%20BG.png" className='w-10 h-10 mt-5' alt="" /></Link>
      <Link to={'/'} className='hidden md:block text-xl font-bold text-center mt-5'>The Campus Network</Link>
      </div>
      <hr />

      
      <Link to='/explore' className={`hover:bg-muted flex gap-2 items-center text-lg p-3 ${pathname === '/explore' ? 'bg-muted text-xl font-bold' : ''}`}>
        <Compass strokeWidth={pathname=='/explore'?4:2} className='mx-auto md:mx-0'/>
        <div className='hidden md:block'>Explore</div>
      </Link>
      <Link to='/search' className={`hover:bg-muted flex gap-2 items-center text-lg p-3 ${pathname === '/search' ? 'bg-muted text-xl font-bold' : ''}`}>
        <Search strokeWidth={pathname=='/search'?4:3} className='mx-auto md:mx-0'/>
        <div className='hidden md:block'>Search</div>
      </Link>
      <Link to='/groups' className={`hover:bg-muted flex gap-2 items-center text-lg p-3 ${pathname === '/groups' ? 'bg-muted text-xl font-bold' : ''}`}>
        <FaUsers strokeWidth={pathname=='/groups'?4:2} className='text-2xl mx-auto md:mx-0'/>
        <div className='hidden md:block'>Groups</div>
      </Link>
      <Link to='/chat' className={`hover:bg-muted flex gap-2 items-center text-lg p-3 ${pathname === '/chat' ? 'bg-muted text-xl font-bold' : ''}`}>
        <MessageCircle strokeWidth={pathname=='/chat'?4:2} className='text-2xl mx-auto md:mx-0'/>
        <div className='hidden md:block'>Chats</div>
      </Link>
      {/* <Link to='/notifications' className={`hover:bg-muted flex gap-2 items-center text-lg p-3 ${pathname === '/notifications' ? 'bg-muted text-xl font-bold' : ''}`}>
        <Bell className='mx-auto md:mx-0' strokeWidth={pathname=='/notifications'?4:3}/>
        <div className='hidden md:block'>Notifications</div>
      </Link> */}

      {/* <Link to='/create' className={`hover:bg-muted flex gap-2 items-center text-lg p-3 ${pathname === '/create' ? 'bg-muted text-xl font-bold' : ''}`}>
        <Plus className='mx-auto md:mx-0' strokeWidth={pathname=='/create'?4:3}/>
        <div className='hidden md:block'>Create</div>
      </Link> */}

      <Link to='/profile' className={`hover:bg-muted flex gap-2 items-center text-lg p-3 ${pathname === '/profile' ? 'bg-muted text-xl font-bold' : ''}`}>
        <img src={user?.profilePicture} className='w-8 h-8 mx-auto md:mx-0 rounded-full' alt="" />
        <div className='hidden md:block'>Profile</div>
      </Link>
      <Link to='/settings' className={`hover:bg-muted flex gap-2 items-center text-lg p-3 ${pathname === '/settings' ? 'bg-muted text-xl font-bold' : ''}`}>
        <Settings className='mx-auto md:mx-0' strokeWidth={pathname=='/settings'?3:2}/>
        <div className='hidden md:block'>Settings</div>
      </Link>
      <LogoutButton className='hidden md:block mt-8 mx-5'/>
            
    </div>
  )
}

export default ProfileSideBar
