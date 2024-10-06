import {useState} from 'react'
import {Globe, EllipsisVertical, ThumbsUpIcon, MessageSquare, Repeat2}  from 'lucide-react'
import { UserInterface } from '@/context/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import { PostInterface } from '@/types'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { createRepost, getLikedUsers, getRepostedUsers } from '@/api'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import DotLoader from '@/components/DotLoader'
const PostCard = ({postedUser, post, refreshFunc}:{postedUser:UserInterface;post:PostInterface, refreshFunc:()=>void}) => {

  const navigate = useNavigate()
  const {user} = useAuth()
  
   const [readMore, setReadMore] = useState(false)
   const [reposted, setReposted] = useState(post.repostedBy?.includes(user?._id!))

   const [likedUsers, setLikedUsers] = useState([])
   const [repostedUsers, setRepostedUsers] = useState([])

   const [likedUsersLoading, setLikedUsersLoading] = useState(false)
   const [repostedUsersLoading, setRepostedUsersLoading] = useState(false)

   const handleRepostedUsersClick = async() => {
    setRepostedUsersLoading(true)
    setLikedUsersLoading(false)
    try {
      const res = await getRepostedUsers({postId:post._id})
      setRepostedUsers(res.data.data)
    } catch (error) {
      console.log(error)
    }
    finally{
      setRepostedUsersLoading(false)
    }
   }

   const handleLikedUsersClick = async() => {
    setLikedUsersLoading(true)
    try {
      const res = await getLikedUsers({postId:post._id})
      setLikedUsers(res.data.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLikedUsersLoading(false)
    }
   }

   const handleRepostClick = async() => {
    try {
      if(post.createdBy?._id === user?._id) return
      const res = await createRepost({postId:post._id})
      setReposted(!reposted)
      refreshFunc()
    } catch (error) {
      console.log(error)
    }
   }
   
    const postCreationTime = new Date(post.createdAt!)
  return (
    <div>
      <div className="postcard m-10 mt-3">
                <div className="flex header items-center gap-2">
                  <div className="flex gap-2 items-center">
                    <div>
                      <img
                        src={postedUser.profilePicture}
                        className="w-10 h-10 rounded-full"
                        alt=""
                      />
                    </div>
                    <div className="flex-col">
                      <div className="pl-1 font-semibold">{postedUser.username}</div>
                      <div className="text-muted-foreground text-sm flex gap-1 items-center">
                        <Globe className="w-4 h-4" />
                        <div>
                          {
                            //logic to display when the post was created eg, 1d, 10min, 1mo
                           formatDistanceToNow(postCreationTime, { addSuffix: true })
                            
                          }
                          
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto pr-10">
                  {!reposted && <EllipsisVertical className="h-8 cursor-pointer hover:bg-muted" />}
                  </div>
                </div>
                <div className="w-3/4 h-[2px] mx-auto m-4 bg-muted"></div>
                <div className='text-lg p-1 font-bold'>{post.title}</div>
                <div className="text-sm p-2">
                 {readMore?post.content:post.content.slice(0,300)}
                 {post.content.length>300? <span className="text-blue-500 cursor-pointer" onClick={()=>setReadMore(!readMore)}>
                    {readMore?"...Read Less":"...Read More"}
                  </span>:""}
                </div>
                <div className="w-full h-[2px] m-2 bg-muted"></div>
                <div className="flex items-center justify-around gap-2 m-3">
                  <div className='flex flex-col justify-center items-center'>

                  <div className="flex hover:bg-muted cursor-pointer p-2 items-center gap-3">
                    <ThumbsUpIcon className="w-5 h-5" />
                    <div className="text-sm">{post.likes?.length}</div>
                  </div>
                  <Dialog>
                    <DialogTrigger>

                  <div onClick={handleLikedUsersClick} className='text-xs cursor-pointer hover:bg-muted hover:underline'>See Liked Users</div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Liked Users</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                        {likedUsersLoading && <DotLoader/>}
                        {likedUsers.map((user:UserInterface)=>(
                          <div onClick={()=>navigate(`/user/${user.username}`)} key={user._id} className="flex gap-2 items-center cursor-pointer hover:bg-muted p-2">
                            <img src={user.profilePicture} className="w-10 h-10 rounded-full" alt="" />
                            <div>{user.username}</div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                  </div>
                  <div 
                    onClick={()=>navigate(`/post/${post._id}`)}
                    className="flex hover:bg-muted cursor-pointer p-2  items-center gap-3">
                    <MessageSquare className="w-5 h-5" />
                    <div className="text-sm">{post.comments?.length}</div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                  <div onClick={handleRepostClick} className="flex hover:bg-muted cursor-pointer p-2  items-center gap-3">
                  <Repeat2  className={`w-5 h-5 ${reposted?"text-green-500":""}`} />
                    <div className="text-sm">{post.repostedBy?.length || 0}</div>
                  </div>
                  <Dialog>
                    <DialogTrigger>

                  <div onClick={handleRepostedUsersClick} className='text-xs cursor-pointer hover:bg-muted hover:underline'>See Reposted Users</div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reposted Users</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
                        {repostedUsersLoading && <DotLoader/>}
                        {repostedUsers.map((user:UserInterface)=>(
                          <div onClick={()=>navigate(`/user/${user.username}`)} key={user._id} className="flex gap-2 items-center cursor-pointer hover:bg-muted p-2">
                            <img src={user.profilePicture} className="w-10 h-10 rounded-full" alt="" />
                            <div>{user.username}</div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                  </div>
                </div>
                <div className="w-full h-[2px] bg-muted"></div>
              </div>
    </div>
  )
}

export default PostCard
