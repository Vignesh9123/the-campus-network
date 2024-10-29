import { resetPassword } from "@/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"


function ResetPassword() {

  const { token } = useParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const handleResetPassword = async() => {
    if(!token){
      toast.error("Invalid token")
      return
    }
    if(password !== confirmPassword){
      setError("Passwords do not match")
      return
    }
    resetPassword({token, password}).then(()=>{
      toast.success("Password reset successfully")
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      navigate("/login")
      window.location.reload()
    }).catch(()=>{
      toast.error("Sorry, the password reset link has expired")
    })
  }
  return (
    <div className="flex w-full flex-col justify-center items-center gap-4">
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Input type="password" placeholder="Enter New Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
      <Input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
      <Button onClick={handleResetPassword}>Submit</Button>    
    </div>
  )
}

export default ResetPassword
