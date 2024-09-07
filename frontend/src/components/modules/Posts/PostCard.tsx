import React,{useState} from 'react'
import {Globe, EllipsisVertical, ThumbsUpIcon, MessageSquare, Repeat2}  from 'lucide-react'
import { UserInterface } from '@/context/AuthContext'
const PostCard = ({user, title, content}:{user:UserInterface;title:string;content:string}) => {
   const [readMore, setReadMore] = useState(false)
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
                      <div className="pl-1 font-semibold">three</div>
                      <div className="text-muted-foreground text-sm flex gap-1 items-center">
                        <Globe className="w-4 h-4" />
                        <div> 1d ago</div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto pr-10">
                    <EllipsisVertical className="h-8 cursor-pointer hover:bg-muted" />
                  </div>
                </div>
                <div className="w-3/4 h-[2px] mx-auto m-4 bg-muted"></div>
                <div className='text-lg p-1 font-bold'>{title}</div>
                <div className="text-sm p-2">
                 {readMore?content:content.slice(0,300)}
                 {content.length>300? <span className="text-blue-500 cursor-pointer" onClick={()=>setReadMore(!readMore)}>
                    {readMore?"...Read Less":"...Read More"}
                  </span>:""}
                </div>
                <div className="w-full h-[2px] m-2 bg-muted"></div>
                <div className="flex items-center justify-around gap-2 m-3">
                  <div className="flex hover:bg-muted cursor-pointer p-2 items-center gap-3">
                    <ThumbsUpIcon className="w-5 h-5" />
                    <div className="text-sm">0</div>
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