import {useState, useEffect} from 'react'
import ProfileSideBar from '@/components/sections/ProfileSideBar'
import FloatingActionButton from '@/components/modules/FloatingActionButton'
import OthersPostCard from '@/components/modules/Posts/OthersPostCard'
import { useAuth } from '@/context/AuthContext'
import { getUserFeed } from '@/api'
import PostSkeletonLoader from '@/components/modules/Posts/PostSkeletonLoader'

function ExplorePosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();
    useEffect(() => {
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
    
        fetchPosts();
      }, []);
 
  return (
    <>
    {user && <div className='flex'>
        <div className="w-[15%] md:w-1/4 border-0 border-r-[1px] h-screen">
        <ProfileSideBar/>
        </div>
        <div className="w-[50%] border-0 border-r-[1px] h-screen overflow-y-auto scrollbar-hide">
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
                <OthersPostCard otherUser={post.createdBy} key={post._id} post={post} following={post.isFollowedUser} />
            ))}

        <FloatingActionButton/>
        </div>
        <div className="hidden lg:block w-[25%] h-screen">
            <div className="text-xl font-semibold m-5 ml-2">Accounts to follow</div>

            
        </div>
    </div>}
    </>
  )
}

export default ExplorePosts
