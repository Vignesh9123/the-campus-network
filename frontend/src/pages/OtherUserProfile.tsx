import React,{useState,useEffect} from 'react'
import ProfileSideBar from '@/components/sections/ProfileSideBar'
import { getUserProfile } from '@/api'
import { getUserPosts,getFollowers,getFollowing } from '@/api'
import { Link, useParams } from 'react-router-dom'
import Loader from '@/components/Loader'
import { PostInterface } from '@/types'
import { formatNumber } from '@/utils'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { useAuth } from '@/context/AuthContext'
  import { ExternalLink } from "lucide-react";
import PostCard from '@/components/modules/Posts/OthersPostCard'
import FollowButton from '@/components/modules/FollowButton'
import { useNavigate } from 'react-router-dom'
import DotLoader from '@/components/DotLoader'
function OtherUserProfile() {
    const navigate = useNavigate()
    const {username} = useParams()
    const [otherUser,setOtherUser] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [showPreview, setShowPreview] = useState(false);
    const [posts,setPosts] = useState<any>([])
    const {user} = useAuth()
    const [followers, setFollowers] = useState([])
    const [following, setFollowing] = useState([])
    const [followLoading,setFollowLoading] = useState(false)
    

    const getOtherFollowers = ()=>{
      if(followers[0]) return
      setFollowLoading(true)
      getFollowers({username:otherUser?.username}).then(
        (res)=>{
          setFollowers(res.data.data)
          setFollowLoading(false)
        }
      )
    }
    const getOtherFollowing = ()=>{
      if(following[0]) return
      setFollowLoading(true)
      getFollowing({username:otherUser?.username}).then(
        (res)=>{
          setFollowing(res.data.data)
          setFollowLoading(false)
        }

      )
    }

    useEffect(()=>{
        const fetchUserProfile = async()=>{
            setLoading(true)
            if(user?.username == username){

              navigate('/profile')
            }
            const response = await getUserProfile({username})
            console.log(response.data.data.user)
            setOtherUser(response.data.data.user)
            const posts = await getUserPosts({username:username||''})
            setPosts(posts.data.data)
            setLoading(false)
        }
        fetchUserProfile()
    },[])

  return (
    <div>
        {loading && <Loader/>}
        { !loading && !otherUser && <div className='text-2xl font-semibold text-center'>User not found</div>}

        { !loading && otherUser && <div className='flex'>
        <div className="w-[15%] md:w-1/4 border-0 border-r-[1px] h-screen">
        <ProfileSideBar/>
        </div>
        <div className="w-full md:w-[50%] overflow-y-scroll scrollbar-hide border-0 border-r-[1px] h-screen">
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
                    src={otherUser.profilePicture}
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
                    src={otherUser.profilePicture}
                    className="w-full h-full"
                    alt=""
                  />
                </DialogContent>
              </div>
            </Dialog>
            <div className="text-center font-bold text-lg">{otherUser.username}</div>
            <div className="flex mt-4 justify-around">
            <Dialog onOpenChange={getOtherFollowers}>
                  <DialogTrigger>
              <div className="hover:underline cursor-pointer">{
                formatNumber(otherUser.followers.length)+" "
              } Followers</div>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-0 max-w-[80vw] md:max-w-[35vw]">
                <DialogHeader>
                  <DialogTitle>Followers</DialogTitle>
                  <DialogDescription>
                    <div className="flex flex-col mt-3 gap-2  max-h-[70vh] overflow-y-auto">
                      {followLoading && <DotLoader />}
                      {!followLoading && !followers[0] && 
                      <div className="text-center text-sm m-3 text-muted-foreground">
                        No one is following {otherUser.username} yet
                      </div>}
                      {
                        followers[0] && followers.map((follower:any, index) => (
                          <div onClick={()=>{
                            navigate(`/user/${follower.username}`)
                            window.location.reload()
                            }} key={index} className="flex cursor-pointer hover:bg-muted p-2 items-center gap-2">
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
                {user?.following.includes(otherUser._id) && (
                  <FollowButton className='' userIdToFollow={otherUser._id} following={
                    user?.following.includes(otherUser._id)
                  }/>
                )}
                {!user?.following.includes(otherUser._id) && (
                <FollowButton className='' userIdToFollow={otherUser._id} following={
                  user?.following.includes(otherUser._id)
                }/>
                )}
              <Dialog onOpenChange={getOtherFollowing}>
                  <DialogTrigger>
              <div className="hover:underline cursor-pointer">{
                formatNumber(otherUser.following.length)+" "
              } Following</div>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-0 max-w-[80vw] md:max-w-[35vw]">
                <DialogHeader>
                  <DialogTitle>Following</DialogTitle>
                  <DialogDescription>
                    <div className="flex flex-col mt-3 gap-2  max-h-[70vh] overflow-y-auto">
                    {followLoading && <DotLoader />}

                      {!followLoading && !following[0] &&
                      <div className="text-center text-sm m-3 text-muted-foreground">
                        {otherUser.username} is not following anyone yet
                      </div>}
                   
                      {
                        following[0] && following.map((follow:any, index) => (
                          <div onClick={()=>{
                            navigate(`/user/${follow.username}`)
                            window.location.reload()
                            }} key={index} className="flex cursor-pointer hover:bg-muted p-2 items-center gap-2">
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
              {otherUser.bio}
            </div>
            <div className="w-full h-[2px] bg-muted"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 m-3 mx-5 gap-3">
              <div className="flex items-center gap-2">
                <div className="font-bold">College: </div>
                <div className="text-sm">
                  {otherUser.college}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-bold">Graduation: </div>
                <div className="text-sm">{otherUser.yearOfGraduation}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-bold">Branch: </div>
                <div className="text-sm">{otherUser.engineeringDomain}</div>
              </div>
            </div>
            <div className="w-full h-[2px] bg-muted mt-5"></div>
            <div className="posts">
              <div className="text-center font-bold text-lg mt-3">Posts</div>
              {
            posts.length==0 && <div className="text-center text-sm m-3 text-muted-foreground">
              No posts yet
            </div>
            }
            {
              posts.map((post:PostInterface, index:any) => (
                <PostCard key={index} user={otherUser} title={post.title} createdOn={post.createdOn} content={post.content} following={user?.following.includes(otherUser._id)}/>
              ))
            }
          
 
            </div>
        </div>
        <div className="hidden lg:block w-[25%] h-screen">
            <div className="text-xl font-semibold m-5 ml-2">Accounts to follow</div>
            
            
        </div>
        
        </div>
        
        }
      
    </div>
  )
}

export default OtherUserProfile
