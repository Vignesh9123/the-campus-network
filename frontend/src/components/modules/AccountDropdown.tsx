import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button'
import { AuthContext } from '@/context/AuthContext'
function AccountDropdown() {
    const {logout, user} = React.useContext(AuthContext)

  
  return (
    <div>
       {user && <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
      <div className='mx-2'>{user.username.charAt(0).toUpperCase() + user.username.slice(1)}</div>
                <img className="rounded-full w-10 h-10 py-1 px-1" src={user.profilePicture} alt="" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} >Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>}
    </div>
  )
}

export default AccountDropdown
