import React, { useState, useRef} from 'react'
import ProfileSideBar from '@/components/sections/ProfileSideBar'
import { useAuth } from '@/context/AuthContext'
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { searchUser, searchPost } from '@/api';
import { Link } from 'react-router-dom';
import Loader from '@/components/Loader';
import PostCard from '@/components/modules/Posts/OthersPostCard';
import MobileUserNavbar from '@/components/sections/MobileUserNavbar';


function SearchPage() {
  document.title = "The Campus Network - Search";
    const {user} = useAuth();
    const [searchQuery, setSearchQuery] = useState('')
    const [userSearchResults, setUserSearchResults] = useState([]);
    const [postSearchResults, setPostSearchResults] = useState([{}]);
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)
    const [selectedTab, setSelectedTab] = useState('users')
    const scrollableDiv = useRef<HTMLDivElement>(null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };
    const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
      setSearched(true)
      e.preventDefault();
      setLoading(true)
      const res = await searchUser({query:searchQuery});
      const postRes = await searchPost({query:searchQuery})
      setLoading(false)
      setUserSearchResults(res.data.data);
      setPostSearchResults(postRes.data.data.posts);
    };
  return (
    <div>
        {user && <div className='flex'>
        <div className="hidden md:block md:w-1/4 border-0 border-r-[1px] h-screen">
        <ProfileSideBar/>
        </div>
        <div ref={scrollableDiv} className="w-full md:w-[50%] overflow-y-scroll scrollbar-hide border-0 border-r-[1px] h-screen">
          <MobileUserNavbar scrollableDiv={scrollableDiv}/>
          <div className='mt-5'></div>
        <PlaceholdersAndVanishInput  placeholders={["Search for a user", "Search for a post"]}  onChange={handleChange}
        onSubmit={onSubmit}/>
        {searched && loading && <div className="text-xl font-semibold m-5 ml-2">
          <Loader/></div>}        

        <div className="flex">
          <div className="w-full">
           {searched && <div className="flex mt-2">
              
              <button
                className={`px-4 py-2 font-semibold w-1/2 border-0 border-r-gray-700 ${selectedTab === 'users' ? 'bg-muted border-0 border-b-2 border-blue-500 border-r-[1px] text-white' : ''}`}
                onClick={() => setSelectedTab('users')}
              >
                Users
              </button>
              <button
                className={`px-4 py-2 font-semibold w-1/2 border-l-gray-700 ${selectedTab === 'posts' ? 'bg-muted border-0 border-b-2 border-blue-500 text-white border-l-[1px]' : ''}`}
                onClick={() => setSelectedTab('posts')}
              >
                Posts
              </button>
            </div>}
            {selectedTab === 'users' && searched && !loading && !userSearchResults[0] && <div className='text-center m-10 text-lg font-bold'>
              No results found
              </div>}
            {selectedTab === 'users' && !loading && userSearchResults.length > 0 && (
              <div>
              
                {userSearchResults[0] && userSearchResults.map((result: any) => {
                  return (
                    <Link to={`/user/${result.username}`} className="flex gap-2 items-center p-3 hover:bg-muted duration-150">
                      <img src={result.profilePicture} width={10} height={10} className="w-10 h-10 rounded-full" />
                      <div>{result.username}</div>
                    </Link>
                  );
                })}
                
              </div>
            )}
            {selectedTab === 'posts' && searched && postSearchResults.length === 0 && <div className='text-center m-10 text-lg font-bold'>
              No results found
              </div>}
            
            {selectedTab === 'posts' && postSearchResults.length > 0 && (
              <div>
                {/* Render post search results */}
                {postSearchResults.map((result:any) => {
                  return(
                    <PostCard post={result} otherUser={result.createdBy} key={result._id} />
                  )
                })}
              </div>
            )}
          </div>
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

export default SearchPage
