import {useState} from 'react'
import {Globe, ThumbsUpIcon, MessageSquare, Repeat2}  from 'lucide-react'
import { UserInterface } from '@/context/AuthContext'
import FollowButton from '../FollowButton'
import { useNavigate } from 'react-router-dom'
import { createRepost, likePost } from '@/api'
import { useAuth } from '@/context/AuthContext'
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({otherUser, post, followCallback }:{otherUser:UserInterface|undefined;post:any;
  followCallback?: () => void
}) => {
   const navigate = useNavigate()
   const [readMore, setReadMore] = useState(false)
   const {user} = useAuth()
    const postCreationTime = new Date(post.createdAt)
    const [likes, setLikes] = useState(post.likes.length)
    const [comments, _] = useState(post.comments.length)
    const [reposts, setReposts] = useState(post.repostedBy?.length || 0)
    const [liked, setLiked] = useState(post.likes.includes(user?._id))
    const [reposted, setReposted] = useState(post.repostedBy?.includes(user?._id))
    const [likeLoading, setLikeLoading] = useState(false)
    const [repostLoading, setRepostLoading] = useState(false)
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

    const handleRepost = async()=>{
      if(repostLoading) return
      setRepostLoading(true)
    const res = await createRepost({postId:post._id})
      setReposts(res.data.data.repostLength)
      setReposted(!reposted)
      setRepostLoading(false)
    }
  return (
    <div>
      <div className="postcard m-10 mt-3">
                <div className="flex header items-center gap-2">
                  <div className="flex gap-2 items-center">
                    <div className='w-fit'>
                      <img
                        src={otherUser && otherUser.profilePicture}
                        className="w-10 h-10 rounded-full"
                        alt=""
                      />
                    </div>
                    <div className="flex-col">
                      <div onClick={() =>{ 
                        navigate(`/user/${otherUser && otherUser.username}`)
                        window.location.reload()
                      }
                        } className="pl-1 cursor-pointer text-sm md:text-md font-semibold hover:underline">{otherUser && otherUser.username}</div>
                      <div className="text-muted-foreground text-sm flex gap-1 items-center">
                        <Globe className="w-4 h-4" />
                        <div className='text-xs md:text-sm'>
                          {

                            formatDistanceToNow(postCreationTime, { addSuffix: true })
                           
                            
                          }
                          
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto pr-10">
                    <FollowButton userIdToFollow={otherUser && otherUser._id} 
                    callback={followCallback} 
                    />
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
                  <div onClick={()=>{navigate(`/post/${post._id}`)}} className="flex hover:bg-muted cursor-pointer p-2  items-center gap-3">
                    <MessageSquare className="w-5 h-5" />
                    <div className="text-sm">{comments}</div>
                  </div>
                  <div onClick={handleRepost}  className="flex hover:bg-muted cursor-pointer p-2  items-center gap-3">
                    <Repeat2 className={`w-5 h-5 ${reposted && !repostLoading?"text-green-500":"" } ${repostLoading?"text-gray-500":""}`} />
                    <div className="text-sm">{reposts}</div>
                  </div>
                </div>
                <div className="w-full h-[2px] bg-muted"></div>
              </div>
    </div>
  )
}

export default PostCard
