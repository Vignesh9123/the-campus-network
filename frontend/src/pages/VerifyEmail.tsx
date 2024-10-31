import { verifyEmail } from "@/api"
import MobileUserNavbar from "@/components/sections/MobileUserNavbar"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "react-toastify"


function VerifyEmail() {
    const {token} = useParams()
    const [error, setError] = useState("")
    const [verifyLoading, setVerifyLoading] = useState(false)
    useEffect(() => {
        async function verifyEmailUsingToken() {
           setVerifyLoading(true)
        if(!token) {
            toast.error("Invalid token")
            return
        }
        verifyEmail({token}).then(() => {
            toast.success("Email verified successfully")
        })
        .catch(() => {
            toast.error("Something went wrong, please verify your email again")
            setError("Something went wrong, please verify your email again")
        })
        .finally(() => {
            setVerifyLoading(false)
        })
       } 
       verifyEmailUsingToken()
    },[])
  return (
    <div className="w-full">
      <MobileUserNavbar scrollableDiv={null}/>
    <div className="flex items-center justify-center w-full h-full">
            { verifyLoading && <div className="text-center">
                <h1 className="text-3xl font-bold">Verifying your email</h1>
                <p className="text-gray-500">Please wait while we verify your email</p>
            </div>}
            {error && <div className="text-center">
                <h1 className="text-3xl font-bold">Error</h1>
                <p className="text-gray-500">{error}</p>
            </div>}
            {!verifyLoading && !error && <div className="text-center">
                <h1 className="text-3xl font-bold">Email verified successfully</h1>
                <p className="text-gray-500">You can now go to the <Link to={'/profile'} className="text-blue-500 underline">Profile page</Link></p>
            </div>}

      
    </div>
    </div>

  )
}

export default VerifyEmail
