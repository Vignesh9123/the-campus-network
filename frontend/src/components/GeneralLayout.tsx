import ProfileSideBar from "./sections/ProfileSideBar"
import { Outlet } from "react-router-dom"
function GeneralLayout() {
  return (
    <div className="flex">
       <div className="w-[15%] md:w-1/4 h-screen border-0 border-r">
        <ProfileSideBar/>
       </div>
       
        <Outlet />
    </div>
  )
  
}

export default GeneralLayout
