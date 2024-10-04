import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ProfileSideBar from "@/components/sections/ProfileSideBar";
import PostCard from "@/components/modules/Posts/PostCard";
import {
  ExternalLink,
  Mail,
} from "lucide-react";
import HappeningPostCard from "@/components/modules/Posts/HappeningPostCard";
import FloatingActionButton from "@/components/modules/FloatingActionButton";
import {Link, useNavigate} from 'react-router-dom'
import { formatNumber } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Autoplay from "embla-carousel-autoplay"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import FollowButton from "@/components/modules/FollowButton";
import { getUserPosts,getFollowers,getFollowing,getAccountsToFollow } from '@/api'
import { PostInterface } from "@/types";
import DotLoader from "@/components/DotLoader";
const Profile = () => {
  const navigate = useNavigate()
  const plugin = useRef(
    Autoplay({ stopOnMouseEnter:true, stopOnInteraction:false,stopOnFocusIn:false, delay: 3000 })
  )
  const { user } = useAuth();
  const pathname = window.location.pathname;
  const [showPreview, setShowPreview] = useState(false);
  const [posts, setPosts] = useState([])

  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [followLoading, setFollowLoading] = useState(false)
  const [accountsToFollow, setAccountsToFollow] = useState([])
  const [accountToFollowLoading, setAccountToFollowLoading] = useState(false)
  

  const getOwnFollowers = ()=>{
    if(followers[0]) return
    setFollowLoading(true)
    getFollowers({username:user?.username}).then(
      (res)=>{
        setFollowers(res.data.data)
        setFollowLoading(false)
      }
    )
  }
  const getOwnFollowing = ()=>{
    if(following[0]) return
    setFollowLoading(true)
    getFollowing({username:user?.username}).then(
      (res)=>{
        setFollowing(res.data.data)
        setFollowLoading(false)
      }
    )
  }
  const getAccountRecommendations = async()=>{
    if(accountsToFollow[0]) return
    setAccountToFollowLoading(true)
    const res = await getAccountsToFollow()
    setAccountsToFollow(res.data.data)
    setAccountToFollowLoading(false)

    
  }
  useEffect(()=>{
    document.title = "The Campus Network - Profile"
    getUserPosts({username:user?.username!}).then((res)=>{
      setPosts(res.data.data)
    })
    getAccountRecommendations()
    
  },[])
  return (
    <div>
      {user && (
        <div className="flex">
          <div className="w-[15%] md:w-1/3 border-0 border-r-[1px] h-screen">
            <ProfileSideBar />
          </div>
          <div className="md:w-2/3 w-[85%] overflow-y-scroll scrollbar-hide border-0 border-r-[1px] h-screen">
            <div className="flex border-0 border-b">
              <div
                className={`w-1/2 py-5 text-center cursor-pointer ${
                  pathname == "/profile"
                    ? "font-bold text-lg text- bg-muted border-0 border-b-4 border-blue-500"
                    : "hover:bg-slate-900 duration-200"
                }`}
              >
                Profile
              </div>
              <Link to='/editProfile' className="py-5 w-1/2 text-center cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-900 duration-200">
                Edit Profile
              </Link>
            </div>
            <Dialog>
              <div className="m-3 mx-auto w-44 rounded-full h-44">
                <DialogTrigger>
                  <img
                    onMouseEnter={() => {
                      setShowPreview(true);
                    }}
                    onMouseLeave={() => {
                      setShowPreview(false);
                    }}
                    src={user.profilePicture}
                    className=" mx-auto rounded-full border-[7px] w-44 h-44  border-muted hover:opacity-50 dark:hover:opacity-25 cursor-pointer"
                    alt=""
                  />
                  <ExternalLink
                    className={`w-10 cursor-pointer absolute top-[40%] hover:opacity-100 left-[40%] h-10 ${
                      showPreview ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </DialogTrigger>
                <DialogContent className="bg-transparent border-0">
                  <img
                    src={user.profilePicture}
                    className="w-full h-full"
                    alt=""
                  />
                </DialogContent>
              </div>
            </Dialog>
            <div className="text-center font-bold text-lg">{user.username}</div>
            <div className="text-center text-muted-foreground flex justify-center gap-1 items-center"><Mail size={20}/>{user.email}</div>

            <div className="flex justify-around">
              <Dialog onOpenChange={getOwnFollowers}>
                  <DialogTrigger>
              <div className="hover:underline cursor-pointer">{
                formatNumber(user.followers.length)+" "
              } Followers</div>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-0 max-w-[80vw] md:max-w-[35vw]">
                <DialogHeader>
                  <DialogTitle>Followers</DialogTitle>
                  <DialogDescription>
                    <div className="flex flex-col mt-3 gap-2  max-h-[70vh] overflow-y-auto">
                      {followLoading && <DotLoader/>}
                      {!followLoading && !followers[0] &&
                       <div className="text-center text-sm m-3 text-muted-foreground">No Followers yet</div>}
                      
                      {
                        followers[0] && followers.map((follower:any, index) => (
                          <div onClick={()=>{
                            navigate(`/user/${follower.username}`)
                            window.location.reload()
                            }} key={index} className="flex items-center gap-2 hover:bg-muted cursor-pointer p-2">
                            <img src={follower.profilePicture} className="w-10 h-10 rounded-full" alt="" />
                            <div className="flex flex-col">
                              <div className="font-bold">{follower.username}</div>
                              <div className="text-sm text-muted-foreground">{follower.email}</div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
              </Dialog>
              <Dialog onOpenChange={getOwnFollowing}>
                  <DialogTrigger>
              <div className="hover:underline cursor-pointer">{
                formatNumber(user.following.length)+" "
              } Following</div>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-0 max-w-[80vw] md:max-w-[35vw]">
                <DialogHeader>
                  <DialogTitle>Following</DialogTitle>
                  <DialogDescription>
                    <div className="flex flex-col mt-3 gap-2  max-h-[70vh] overflow-y-auto">
                      {followLoading && <DotLoader/>}
                      {!followLoading && !following[0] &&
                       <div className="text-center text-sm m-3 text-muted-foreground">You are not following anyone yet</div>}

                      
                      {
                        following[0] && following.map((follow:any, index) => (
                          <div onClick={()=>{
                            navigate(`/user/${follow.username}`)
                            window.location.reload()
                            }} key={index} className="flex items-center gap-2 hover:bg-muted cursor-pointer p-2">
                            <img src={follow.profilePicture} className="w-10 h-10 rounded-full" alt="" />
                            <div className="flex flex-col">
                              <div className="font-bold">{follow.username}</div>
                              <div className="text-sm text-muted-foreground">{follow.email}</div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
              </Dialog>
            </div>
           
            <div className="text-center mt-3 font-bold text-lg">Bio</div>
            <div className="text-center text-sm m-3 text-muted-foreground">
              {user.bio}
            </div>
            <div className="w-full h-[2px] bg-muted"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 m-3 mx-5 gap-3">
              <div className="flex items-center gap-2">
                <div className="font-bold">College: </div>
                <div className="text-sm">
                  {user.college}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-bold">Graduation: </div>
                <div className="text-sm">{user.yearOfGraduation}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-bold">Branch: </div>
                <div className="text-sm">{user.engineeringDomain}</div>
              </div>
            </div>
            <div className="w-full h-[2px] bg-muted mt-5"></div>
            <div className="posts">
              <div className="text-center font-bold text-lg mt-3">Posts</div>
              {
                posts.length == 0 &&
                <div className="text-center text-muted-foreground mt-3">No posts yet</div>
              }
            {
              posts.map((post:PostInterface, index) => (
                <PostCard key={index} user={user} post={post}/>
              ))
            }
          
 
            </div>
          </div>
          <div className="hidden lg:block w-1/3 h-screen">
            <div className="text-xl font-semibold m-5 ml-2">Accounts to follow</div>

            <div className="relative flex border-y-[] flex-col  overflow-auto">
            <div className="absolute top-0 left-0 right-0 h-[60px] bg-gradient-to-b from-slate-200 dark:from-slate-800 to-transparent"></div>
              {!accountToFollowLoading && accountsToFollow.map(
                (user:any, index) => (
                <div key={index} className="accountCard flex items-center justify-between gap-1 p-3 h-14 w-[95%] mx-auto border-y-[1px]">
                <div className="flex items-center gap-1">
                    <div>
                      <img src={user.profilePicture} className="w-10 h-10 rounded-full " alt="" />
                    </div>
                    <Link  to={`/user/${user.username}`} className="font-semibold hover:underline">
                      {user.username}
                    </Link>
                </div>
                    <FollowButton userIdToFollow={user._id} className="h-3/4"/>
              </div>
              ) )}
              
                
              
              

              
            </div>
     
            
          </div>
        </div>
      )}
      <FloatingActionButton/>
    </div>
  );
};

export default Profile