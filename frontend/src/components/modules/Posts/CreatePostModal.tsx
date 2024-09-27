import React,{useRef,useEffect, useState} from 'react'
import { Button } from '@/components/ui/button';
import { createPost } from '@/api';
export default function CreatePostModule() {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [maxReachedTitle, setMaxReachedTitle] = useState(false)
    const [maxReachedContent, setMaxReachedContent] = useState(false)
    const [isPublic, setIsPublic] = useState(true)
    const [isOnlyFollowers, setIsOnlyFollowers] = useState(false)

    const handlePublicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsPublic(event.target.checked);
    };

    const handleOnlyFollowersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsOnlyFollowers(event.target.checked);
    };  

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
        if (event.target.value.length >= 100) {
            setMaxReachedTitle(true);
        } else {
            setMaxReachedTitle(false);
        }
    };

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
        if (event.target.value.length >= 1000) {
            setMaxReachedContent(true);
        }
        else {
            setMaxReachedContent(false);
        }
    };

    const handlePostSubmit = async()=>{
      const post = {
        title,
        content,
        isPublic,
        onlyFollowers:isOnlyFollowers,
        tags:[]
      }
      createPost(post)
      .then((res)=>{
        console.log(res)
        window.location.reload()
      })
    }
    

    const autoExpand = () => {
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.style.height = 'auto'; // Reset height
          textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content
        }
      };
    
      useEffect(() => {
        // Expand on initial render if there's content
        autoExpand();
      }, []);
  return (
    <div className='m-5 mx-auto w-[95%]'>
      <div>
        <input type="text" value={title} onChange={handleTitleChange} className='w-full p-2 
        text-gray-800 font-bold dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 resize-none overflow-hidden' placeholder='Title' required={true}  minLength={5} maxLength={100}/>
        <div className={`ml-auto mt-1 mb-4 w-fit ${title.length>90?'text-red-500':'text-gray-400'}`}>{title.length}/100</div>
      </div>
       <textarea
      ref={textareaRef}
      onInput={autoExpand}
      value={content}
      onChange={handleContentChange}
      className="w-full p-4 max-h-[45vh] overflow-y-auto text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 resize-none overflow-hidden"
      placeholder="Write your post here..."
      required={true}
      minLength={10}
      maxLength={1000}
    />
    <div className={`ml-auto mt-1 mb-4 w-fit ${content.length>950?'text-red-500':'text-gray-400'}`}>{content.length}/1000</div>
    <div className='flex gap-5'>
    <div>
    <input type="checkbox" id="public" name="public" checked={isPublic} onChange={handlePublicChange} />
    <label className='ml-1' htmlFor="public">Public</label>
    </div>
    <div>
    <input type="checkbox" id="onlyFollowers" name="onlyFollowers" checked={isOnlyFollowers} onChange={handleOnlyFollowersChange} />
    <label className='ml-1' htmlFor="onlyFollowers">Only followers</label>
    </div>
    </div>
    <div className='flex justify-end'>
      <Button onClick={handlePostSubmit} disabled={maxReachedTitle || maxReachedContent} >Post</Button>
    </div>
    </div>  
  );
}

