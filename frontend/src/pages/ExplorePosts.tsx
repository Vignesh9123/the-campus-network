import {useState, useEffect, useRef} from 'react'
import ProfileSideBar from '@/components/sections/ProfileSideBar'
import FloatingActionButton from '@/components/modules/FloatingActionButton'
import OthersPostCard from '@/components/modules/Posts/OthersPostCard'
import { useAuth } from '@/context/AuthContext'
import { getUserFeed } from '@/api'
import PostSkeletonLoader from '@/components/modules/Posts/PostSkeletonLoader'
import { usePullToRefresh } from '@/components/modules/usePullRefreshHook'


function ExplorePosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();
    const contentDivRef = useRef<HTMLDivElement>(null);
    
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getUserFeed();
        setPosts(data.data.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
      setLoading(false);
    };
    usePullToRefresh(contentDivRef, fetchPosts);

    const scrollToTop = () => {
      const contentDiv = document.querySelector('.scrollbar-hide');
      if (contentDiv) {
        contentDiv.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    useEffect(() => {
        fetchPosts();
        // Set up an interval to auto-refresh the data and scroll to top every 10 seconds
        const intervalId = setInterval(() => {
          fetchPosts();
          scrollToTop();
        }, 100000); 
    //TODO:Add refresh icon
        return () => clearInterval(intervalId);
    }, []);
 
    return (
        <>
        {user && <div className='flex'>
            <div className="w-[15%] md:w-1/4 border-0 border-r-[1px] h-screen">
            <ProfileSideBar/>
            </div>
            <div ref={contentDivRef} className="w-[85%] md:w-[50%] border-0 border-r-[1px] h-screen overflow-y-auto scrollbar-hide" key="scrollable-content">
                <div className="text-xl font-bold mx-10 my-5 text-center">Explore Posts</div>
                {loading && 
                <>
                <PostSkeletonLoader/>
                <PostSkeletonLoader/>
                <PostSkeletonLoader/>
                </>
                }
                
                {!loading && posts.length === 0 && <div className="text-center mt-10">No posts to show, search or follow new content</div>}
                {!loading && posts.length > 0 &&
                posts.map((post:any) => (
                    <OthersPostCard otherUser={post.createdBy} key={post._id} post={post}/>
                ))}

            </div>
            <div className="hidden lg:block w-[25%] h-screen">
                <div className="text-xl font-semibold m-5 ml-2">Accounts to follow</div>
            </div>
            <FloatingActionButton/>
        </div>}
        </>
    )
}

export default ExplorePosts
