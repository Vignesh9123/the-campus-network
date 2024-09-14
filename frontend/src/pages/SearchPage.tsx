import React, { useState } from 'react'
import ProfileSideBar from '@/components/sections/ProfileSideBar'
import { useAuth } from '@/context/AuthContext'
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { searchUser } from '@/api';
import { Link } from 'react-router-dom';

function SearchPage() {
    const {user} = useAuth();
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };
    const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const res = await searchUser({query:searchQuery});
      console.log(res.data.data);
      setSearchResults(res.data.data)
    };
  return (
    <div>
        {user && <div className='flex'>
        <div className="w-[15%] md:w-1/4 border-0 border-r-[1px] h-screen">
        <ProfileSideBar/>
        </div>
        <div className="w-[50%] mt-10">
        <PlaceholdersAndVanishInput  placeholders={["Search for a user", "Search for a post"]}  onChange={handleChange}
        onSubmit={onSubmit}/>
        {searchResults[0]&& <div className="text-xl font-semibold m-5 ml-2">Search Results</div>}
        {searchResults.map((result:any)=>{
          return (
            <Link to={`/user/${result.username}`} className="flex gap-2 items-center p-3 hover:bg-muted duration-150">
            <img src={result.profilePicture} width={10} height={10} className="w-10 h-10 rounded-full"/>
            <div>{result.username}</div>
        </Link>)
        })}
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
