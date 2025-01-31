import {useState} from 'react'
import {Globe, EllipsisVertical, ThumbsUpIcon, MessageSquare, Repeat2, Trash2}  from 'lucide-react'
import { UserInterface } from '@/context/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import { PostInterface } from '@/types'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { createRepost, deletePost, getLikedUsers, getRepostedUsers } from '@/api'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import DotLoader from '@/components/DotLoader'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
const PostCard = ({postedUser, post, refreshFunc}:{postedUser:UserInterface;post:PostInterface, refreshFunc:()=>void}) => {

  const navigate = useNavigate()
  const {user} = useAuth()
  
   const [readMore, setReadMore] = useState(false)
   const [reposted, setReposted] = useState(post.repostedBy?.includes(user?._id!))

   const [likedUsers, setLikedUsers] = useState([])
   const [repostedUsers, setRepostedUsers] = useState([])

   const [likedUsersLoading, setLikedUsersLoading] = useState(false)
   const [repostedUsersLoading, setRepostedUsersLoading] = useState(false)
   const [dropdownOpen, setDropdownOpen] = useState(false)
   const handleRepostedUsersClick = async() => {
    setRepostedUsersLoading(true)
    setLikedUsersLoading(false)
    try {
      const res = await getRepostedUsers({postId:post._id})
      setRepostedUsers(res.data.data)
    } catch {
      toast.error("Something went wrong. Please try again later.", {theme:"colored"})
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
    } catch{
     toast.error("Something went wrong. Please try again later.", {theme:"colored"})
    } finally {
      setLikedUsersLoading(false)
    }
   }

   const handleRepostClick = async() => {
    try {
      if(post.createdBy?._id === user?._id) return
      await createRepost({postId:post._id})
      setReposted(!reposted)
      refreshFunc()
    } catch {
      toast.error("Something went wrong. Please try again later.", {theme:"colored"})
    }
   }


   const handleDeletePost = async(postId:string)=>{
    try {
      deletePost({postId})
      .then(()=>{
        refreshFunc()
      })
    } catch {
     toast.error("Something went wrong. Please try again later.", {theme:"colored"})
    } finally{
      setDropdownOpen(false)
    }
   }
   
    const postCreationTime = new Date(post.createdAt!)
  return (
    <div>
      <div className="postcard m-3 md:m-10 mt-3">
                <div className="flex header items-center gap-2">
                  <div className="flex gap-2 items-center">
                    <div className='w-fit'>
                      <img
                        src={postedUser.profilePicture}
                        className="w-10 h-10 rounded-full"
                        alt=""
                      />
                    </div>
                    <div className="flex-col">
                      <div onClick={()=>{
                        if(reposted)
                          navigate(`/user/${postedUser.username}`)
                        }} className={`pl-1 font-semibold ${reposted && "hover:underline cursor-pointer"}`}>{postedUser.username}</div>
                      <div className="text-muted-foreground text-xs md:text-sm flex gap-1 items-center">
                        <Globe className="w-4 h-4" />
                        <div>
                          {
                           formatDistanceToNow(postCreationTime,{addSuffix:true})
                            
                          }
                          
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto pr-10">
                  {!reposted && 
                  <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                    <DropdownMenuTrigger>
                  <EllipsisVertical className="h-8 cursor-pointer hover:bg-muted" />
                    </DropdownMenuTrigger>  
                    <DropdownMenuContent>
                      <Dialog>
                      <DialogTrigger className=' w-full'>

                      <Button variant={"destructive"} className=' flex items-center gap-2 w-full'><Trash2 size={20}/> Delete </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
                        </DialogHeader>
                        <DialogClose asChild>
                          <Button variant={"destructive"} onClick={()=>handleDeletePost(post._id)} >Delete</Button>
                        </DialogClose>
                        <DialogClose asChild>

                          <Button>Cancel</Button>
                        </DialogClose>
                        
                      </DialogContent>
                      </Dialog>                      
                    </DropdownMenuContent>
                  </DropdownMenu>
                  }
                  </div>
                </div>
                <div className="w-3/4 h-[2px] mx-auto m-4 bg-muted"></div>
                <div className='text-lg p-1 font-bold'>{post.title}</div>
                <div className="text-sm p-2 break-words">
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
                 {!reposted && <Dialog>
                    <DialogTrigger>

                  <div onClick={handleLikedUsersClick} className='text-xs cursor-pointer hover:bg-muted hover:underline'>See Liked Users</div>
                    </DialogTrigger>
                    <DialogContent className='max-w-[400px]'>
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
                  </Dialog>}
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
                  {!reposted && <Dialog>
                    <DialogTrigger>

                  <div onClick={handleRepostedUsersClick} className='text-xs cursor-pointer hover:bg-muted hover:underline'>See Reposted Users</div>
                    </DialogTrigger>
                    <DialogContent className='max-w-[400px]'>
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
                  </Dialog>}
                  </div>
                </div>
                <div className="w-full h-[2px] bg-muted"></div>
              </div>
    </div>
  )
}

export default PostCard
