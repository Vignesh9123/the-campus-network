import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import {FaUserFriends} from  'react-icons/fa'
import { Button } from "../ui/button"

function GroupRightSideBar() {
    const [groups, setGroups] = useState<any>([])
    const [search, setSearch] = useState('')
    //dummy data

    const dummyGroups = [
        {
          id: '6698301832gdh93293024bac',
          name: 'Vignesh',
          description: 'This is group 1',
          members: 10,
        },
        {
          id: '2',
          name: 'Group 2',
          description: 'This is group 2',
          members: 20,
        },
        {
          id: '3',
          name: 'Group 3',
          description: 'This is group 3',
          members: 15,
        },
      ]

    useEffect(() => {
        if(search.length > 0){
        setGroups(
            dummyGroups.filter((group:any) => group.id.toLowerCase() === (search.toLowerCase()))
        
        )}
        else{
            setGroups([])
        }
    }, [search])
    useEffect(
        () => {
            console.log(groups)
        }
        ,[groups])

  return (
    <div>
        <div className="search-groups p-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-200 mb-4">Search Groups</h2>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search using Group Id"
              className="w-full border border-gray-300 dark:border-gray-700 rounded"
            />
            <div className="mt-4">
              {groups[0] && groups.map((group:any) => (
                <div key={group.id} className="flex items-center justify-between p-2 border-b border-gray-300 dark:border-gray-700">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">{group.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{group.description}</p>
                  </div>
                  <div>

                  <div className="text-gray-600 flex m-1 justify-end dark:text-gray-400">
                    <FaUserFriends className="w-6 h-6" />
                    {group.members}
                  </div>
                  <Button className="text-xs">Send Request</Button>
                </div>


                  </div>
              ))}
              {search.length!=0  && groups.length === 0 && <p className="text-gray-600 dark:text-gray-400">No groups found</p>}
            
          </div>
          
            
          </div>
    </div>
  )
}

export default GroupRightSideBar
