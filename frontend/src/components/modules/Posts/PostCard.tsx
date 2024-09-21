import {useState} from 'react'
import {Globe, EllipsisVertical, ThumbsUpIcon, MessageSquare, Repeat2}  from 'lucide-react'
import { UserInterface } from '@/context/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import { PostInterface } from '@/types'
import { useNavigate } from 'react-router-dom'
const PostCard = ({user, post}:{user:UserInterface;post:PostInterface}) => {

  const navigate = useNavigate()
  
   const [readMore, setReadMore] = useState(false)
    const postCreationTime = new Date(post.createdAt!)
  return (
    <div>
      <div className="postcard m-10 mt-3">
                <div className="flex header items-center gap-2">
                  <div className="flex gap-2 items-center">
                    <div>
                      <img
                        src={user.profilePicture}
                        className="w-10 h-10 rounded-full"
                        alt=""
                      />
                    </div>
                    <div className="flex-col">
                      <div className="pl-1 font-semibold">{user.username}</div>
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
                    <EllipsisVertical className="h-8 cursor-pointer hover:bg-muted" />
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
                  <div className="flex hover:bg-muted cursor-pointer p-2 items-center gap-3">
                    <ThumbsUpIcon className="w-5 h-5" />
                    <div className="text-sm">{post.likes?.length}</div>
                  </div>
                  <div 
                    onClick={()=>navigate(`/post/${post._id}`)}
                  className="flex hover:bg-muted cursor-pointer p-2  items-center gap-3">
                    <MessageSquare className="w-5 h-5" />
                    <div className="text-sm">{post.comments?.length}</div>
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
