import ProfileSideBar from "@/components/sections/ProfileSideBar"
import { useAuth } from "@/context/AuthContext"
function Groups() {
    const { user } = useAuth();
  return (
   <div>
      {user && <div className='flex'>
        <div className="w-[15%] md:w-1/4 border-0 border-r-[1px] h-screen">
        <ProfileSideBar/>
        </div>
        <div className="md:w-[50%] w-[85vw] overflow-y-scroll scrollbar-hide border-0 border-r-[1px] h-screen"></div>
        <div className="md:w-[25%]  h-screen"></div>
      </div>}
   </div>
  )
}

export default Groups
