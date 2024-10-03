import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Eye,
    EyeOff,
    
} from 'lucide-react'
import { changePassword } from "@/api"
import { toast } from "react-toastify"
function AccountSettings() {
    
    const [showPassword, setShowPassword] = useState(false)
    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const handleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }
    const [showNewPassword, setShowNewPassword] = useState(false)
    const handleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword)
    }
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newConfirmPassword, setNewConfirmPassword] = useState("")
    const [resetPasswordEmail, setResetPasswordEmail] = useState("")
    const [verifyEmail, setVerifyEmail] = useState("")
    const [cperror, setCperror] = useState<null| string>(null)

    const handlePasswordChangeSubmit = ()=>{
        if(!oldPassword || !newPassword || !newConfirmPassword){
            setCperror("All fields are required")
            return
        }
        if(newPassword !== newConfirmPassword){
            setCperror("Passwords do not match")
            return
        }
    if(oldPassword == newPassword ){
        setCperror("New password cannot be the same as old password")
        return
    }
        setCperror(null)
        changePassword({oldPassword,newPassword}).then(
            (res)=>{
                if(res.status == 200){
                    toast.success("Password Changed Successfully")
                    setOldPassword("")
                    setNewPassword("")
                    setNewConfirmPassword("")
                }
            }
        ).catch((err)=>{
            if(err.status == 400){
                setCperror("Invalid Old Password")
            }
        })
    }

  return (
    <div className="grid gap-6 h-[80vh] md:h-[90vh] scrollbar-hide overflow-y-auto">
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Enter your old password and a new password to change your password
          here.
          <br />
          <span className="text-red-500">{cperror}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div>
          <Input type={showPassword ? "text" : "password"} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="Old Password" />
          {
            showPassword?<EyeOff onClick={handleShowPassword} className="absolute right-3 top-3"/>:<Eye onClick={handleShowPassword} className="absolute right-3 top-3"/>
          }
          </div>
          <div>

          <Input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
          {
            showNewPassword?<EyeOff onClick={handleShowNewPassword} className="absolute right-3 top-3"/>:<Eye onClick={handleShowNewPassword} className="absolute right-3 top-3"/>
          }
          </div>
          <div>
          <Input type={showConfirmPassword ? "text" : "password"} value={newConfirmPassword} onChange={(e) => setNewConfirmPassword(e.target.value)} placeholder="Confirm Password" />
          {
            showConfirmPassword?<EyeOff onClick={handleShowConfirmPassword} className="absolute right-3 top-3"/>:<Eye onClick={handleShowConfirmPassword} className="absolute right-3 top-3"/>
          }
          </div>
        
       
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button onClick={handlePasswordChangeSubmit}>Change</Button>
      </CardFooter>
    </Card>
    <Card x-chunk="dashboard-04-chunk-2">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
         Forgot your password? Reset it here by entering your email address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <Input value={resetPasswordEmail} onChange={(e) => setResetPasswordEmail(e.target.value)} placeholder="Email" />
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button>Reset</Button>
      </CardFooter>
    </Card>
    <Card x-chunk="dashboard-04-chunk-2">
      <CardHeader>
        <CardTitle>Verify Email</CardTitle>
        <CardDescription>
          Enter your email address to verify your email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <Input value={verifyEmail} onChange={(e) => setVerifyEmail(e.target.value)} placeholder="Email" />
        </form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button>Verify</Button>
      </CardFooter>
    </Card>

       
  </div>
  )
}

export default AccountSettings
