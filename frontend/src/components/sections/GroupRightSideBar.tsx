import { useEffect, useState } from "react"
import { Input } from "../ui/input"
import {FaUserFriends} from  'react-icons/fa'
import { Button } from "../ui/button"
import { getGroup } from "@/api"

function GroupRightSideBar() {
    const [group, setGroup] = useState<any>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
        const fetchGroups = async () => {
            setLoading(true)
            const data = await getGroup({groupId:search})
            setGroup(data.data.data)
            setLoading(false)
        }
        fetchGroups()
    }, [search])
    useEffect(
        () => {
            console.log(group)
        }
        ,[group])

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
              {group._id  && !loading &&
                <div key={group._id} className="flex items-center justify-between p-2 border-b border-gray-300 dark:border-gray-700">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">{group.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{group.description}</p>
                  </div>
                  <div>

                  <div className="text-gray-600 flex m-1 justify-end dark:text-gray-400">
                    <FaUserFriends className="w-6 h-6" />
                  </div>
                  <Button variant="secondary" className="text-xs">Send Request</Button>
                </div>


                  </div>
              }
              {search.length!=0  && group.length === 0 && <p className="text-gray-600 dark:text-gray-400">No groups found</p>}
            
          </div>
          
            
          </div>
    </div>
  )
}

export default GroupRightSideBar
