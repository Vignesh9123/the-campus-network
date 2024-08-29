import React from 'react'
import LoginButton from '../modules/LoginButton'
import AccountDropdown from '../modules/AccountDropdown'
import SearchBar from '../modules/SearchBar'
import { Menu } from 'lucide-react'
import { ModeToggle } from '../mode-toggle'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CircleUser } from 'lucide-react'
import { Button } from '../ui/button'
const NavBar = ({className}:any) => {
  const {user, logout} = useAuth()
  return (
    <div className={'flex items-center  bg-white dark:bg-black px-5 py-5 ' + className || ''}>
      <div className='title cursor-pointer text-black font-bold text-2xl md:text-xl xl:text-2xl dark:text-white'>Campus Chronicles</div>
      <div className='menus hidden lg:block lg:ml-10'>
        <ul className='flex gap-10 text-black dark:text-white'>
          <li className='cursor-pointer hover:underline'>Home</li>
          <li className='cursor-pointer hover:underline'>Groups</li>
          <li className='cursor-pointer hover:underline'>Posts</li>
          <li className='cursor-pointer hover:underline'>About</li>
          <li className='cursor-pointer hover:underline'>Contact</li>
        </ul>

      </div>

    {user?<div className='mx-5'>
     
    </div>:<div className='hidden lg:block mx-10'>
      <Link to={'/login'} >
      <LoginButton />
      </Link>
    </div>}
    <div className='hidden md:block md:ml-28 lg:ml-10'>
      <SearchBar />
    </div>
    <div className='ml-auto cursor-pointer hover:bg-muted p-2 rounded-md lg:hidden'>
      <Menu />{/*TODO: Implement slider */}
    </div>
    <div className='ml-2 hidden lg:block'>
      <ModeToggle />
    </div>
      {user&&<div className='mx-5 flex items-center'>
        <AccountDropdown />
      
    </div>}
    </div>
  )
}

export default NavBar
