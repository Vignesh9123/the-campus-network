import { resetPassword, signedInResetPassword } from "@/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuth } from "@/context/AuthContext"
import MobileUserNavbar from "@/components/sections/MobileUserNavbar"
import { EyeOff, Eye } from "lucide-react"
function ResetPassword() {

  const { token } = useParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const {user,setUser} = useAuth()
  const handleResetPassword = async() => {
    if(!token){
      toast.error("Invalid token")
      return
    }
    if(password !== confirmPassword){
      setError("Passwords do not match")
      return
    }
    if(user){
      signedInResetPassword({token, password}).then(()=>{
        toast.success("Password reset successfully")
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
        navigate("/login")
      }).catch(()=>{
        toast.error("Sorry, the password reset link is invalid or has expired")
      })
      return
    }
    else{
    resetPassword({token, password}).then(()=>{
      toast.success("Password reset successfully")
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
      navigate("/login")
    }).catch(()=>{
      toast.error("Sorry, the password reset link has expired")
    })}
  }
  return (
    <div className="w-full">
      <MobileUserNavbar scrollableDiv={null}/>
    <div className="flex w-full h-full flex-col justify-center items-center gap-4">
      {error && <p className="text-sm text-red-500">{error}</p>}
      <h1 className="text-2xl font-bold">Reset Password</h1>
      <p className="text-sm">Enter your new password below</p>
      <div className="relative w-[90vw] md:w-[50vw]">
        <Input type={`${showPassword?'text':'password'}`} className="" placeholder="New Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <span className="absolute right-2 top-2 cursor-pointer" onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff/>:<Eye/>}</span>
      </div>
      <div className="relative w-[90vw] md:w-[50vw]">
        <Input type={`${showConfirmPassword?'text':'password'}`} placeholder="Confirm New Password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
        <span className="absolute right-2 top-2 cursor-pointer" onClick={()=>setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword?<EyeOff/>:<Eye/>}</span>
      </div>
      <Button onClick={handleResetPassword}>Reset Password</Button>
    </div>
    </div>
  )    
}

export default ResetPassword
