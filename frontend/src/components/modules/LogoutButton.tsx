import React from 'react'
import { Button } from '../ui/button'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom' 
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
const LogoutButton = ({className, variant}:{className?:string, variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined}) => {
    const navigate = useNavigate();
    const {logout} = useAuth();
  const handleLogout = () => {
    logout();
    navigate('/login');
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
    <Button className={className} variant={variant} >Logout</Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
        
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  )
}
  

export default LogoutButton
