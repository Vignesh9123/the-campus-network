import {useState} from 'react'
import {Globe, ThumbsUpIcon, MessageSquare, Repeat2}  from 'lucide-react'
import { UserInterface } from '@/context/AuthContext'
import FollowButton from '../FollowButton'
import { Link } from 'react-router-dom'
import { likePost } from '@/api'
import { useAuth } from '@/context/AuthContext'
const PostCard = ({otherUser, post, following}:{otherUser:UserInterface; following?:boolean;post:any}) => {
   const [readMore, setReadMore] = useState(false)
   const {user} = useAuth()
    const postCreationTime = new Date(post.createdAt)
    const [likes, setLikes] = useState(post.likes.length)
    const [liked, setLiked] = useState(post.likes.includes(user?._id))
    const [likeLoading, 
        setLikeLoading] = useState(false)
    const handleLike = async () => {
       try {
        if(likeLoading) return
        setLikeLoading(true)
        const res = await likePost({postId:post._id})
        setLikes(res.data.data)
        setLiked(!liked)
        setLikeLoading(false)
       } catch (error) {
        
       }
    }
  return (
    <div>
      <div className="postcard m-10 mt-3">
                <div className="flex header items-center gap-2">
                  <div className="flex gap-2 items-center">
                    <div>
                      <img
                        src={otherUser.profilePicture}
                        className="w-10 h-10 rounded-full"
                        alt=""
                      />
                    </div>
                    <div className="flex-col">
                      <Link to={`/user/${otherUser.username}`} className="pl-1 cursor-pointer font-semibold hover:underline">{otherUser.username}</Link>
                      <div className="text-muted-foreground text-sm flex gap-1 items-center">
                        <Globe className="w-4 h-4" />
                        <div>
                          {
                            //logic to display when the post was created eg, 1d, 10min, 1mo
                            (() => {
                              const currentTime = new Date()
                              const diffInMs = currentTime.getTime() - postCreationTime.getTime()
                              const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
                              const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
                              const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
                              const diffInMonths = Math.floor(diffInDays / 30)
                              const diffInYears = Math.floor(diffInMonths / 12)
                              const diffInSeconds = Math.floor(diffInMs / 1000)
                              if (diffInYears > 0) {
                                return `${diffInYears}y ago`
                              } else if (diffInMonths > 0) {
                                return `${diffInMonths}mo go`
                              } else if (diffInDays > 0) {
                                return `${diffInDays}d ago`
                              } else if (diffInHours > 0) {
                                return `${diffInHours}h ago`
                              } else if (diffInMinutes > 0) {
                                return `${diffInMinutes}min ago`
                              } else if (diffInSeconds > 0) {
                                return `${diffInSeconds}s ago`
                              } else {
                                return `just now`
                              }
                              
                            })()
                            
                          }
                          
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto pr-10">
                    <FollowButton userIdToFollow={otherUser._id} following={following}/>
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
                  <div className="flex hover:bg-muted cursor-pointer p-2 items-center gap-3 " onClick={handleLike}>
                    <ThumbsUpIcon className={`w-5 h-5 ${liked?"text-red-500":""}`}  />
                    <div className="text-sm">{likes}</div>
                  </div>
                  <div className="flex hover:bg-muted cursor-pointer p-2  items-center gap-3">
                    <MessageSquare className="w-5 h-5" />
                    <div className="text-sm">0</div>
                  </div>
                  <div className="flex hover:bg-muted cursor-pointer p-2  items-center gap-3">
                    <Repeat2 className="w-5 h-5" />
                    <div className="text-sm">0</div>
                  </div>
                </div>
                <div className="w-full h-[2px] bg-muted"></div>
              </div>
    </div>
  )
}

export default PostCard
