import { useEffect, useState, useRef } from "react"
import ProfileSideBar from "@/components/sections/ProfileSideBar"
import { useAuth } from "@/context/AuthContext"
import {acceptRequest, deleteGroup, getGroup,removeFromGroup,getGroupSuggestedPeople, addToGroup,exitFromGroup, rejectRequest} from '@/api'
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import GroupAnnouncements from "./GroupAnnouncements";
import PostSkeletonLoader from "@/components/modules/Posts/PostSkeletonLoader";
import { Check, X } from "lucide-react";
import AddProjectModule from "@/components/modules/AddProjectModule";
import { 

    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
 } from "@/components/ui/alert-dialog";
import { toast } from "react-toastify";
import {RWebShare} from 'react-web-share'

function GroupIdPage() {
    const {groupId} = useParams()
    const navigate = useNavigate()
    const { user } = useAuth();
    const [searchParams] = useSearchParams();

    const urlTab = searchParams.get("tab")
    const scroll = searchParams.get("scroll")

    const [group, setGroup] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState(urlTab || "Announcements");
    const [admin, setAdmin] = useState(false);
    const [joinRequests,setJoinRequests] = useState([]);
    const [suggestedPeople, setSuggestedPeople] = useState([])
    
    const scrollableDivRef = useRef<HTMLDivElement>(null);

    const scrollToTop = ()=>{
        if(scrollableDivRef.current){
            scrollableDivRef.current.scrollTo(
              {
                
                top:0,
                behavior:"smooth"
              }
            )
        }
    }
    const fetchGroup = async () => {
      setLoading(true);
      try {
          const data = await getGroup({groupId});
          const grp = data.data.data
          const members = data.data.data.members
          
          if(members.find((member:any) => member._id === user?._id))
            {
              setGroup(data.data.data);
              }else{
                  
            }
            if(user?._id == grp.admin._id){
              setAdmin(true)
              setJoinRequests(grp.joinRequests)
              
            }
            else{
              setAdmin(false)

            }             
      } catch (err:any) {
          if(err.status == 403){
           navigate(`/groupview/${groupId}`)
            
          }
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };
  const fetchSuggestedPeople = async () => {
    if(admin)
    {const suggestedPeopleRes = await getGroupSuggestedPeople({groupId})
    if(suggestedPeopleRes.status == 200){
      setSuggestedPeople(suggestedPeopleRes.data.data)}
    }
    
};
    useEffect(() => {
        fetchGroup();
        if(scroll == "true")
        {scrollableDivRef && 
        scrollableDivRef.current &&
        scrollableDivRef.current.scrollTo({
          top: 500,
          behavior: "instant",
        });}
        fetchSuggestedPeople()
        
    }, [groupId, scrollableDivRef.current]);
  return (
   <div>
      {user && <div className='flex'>
        <div className="w-[15%] md:w-1/4 border-0 border-r-[1px] h-screen">
        <ProfileSideBar/>
        </div>
        <div ref={scrollableDivRef} className="md:w-[50%] w-[85vw] overflow-y-scroll scrollbar-hide border-0 border-r-[1px] h-screen">
          {loading && <div>
            <PostSkeletonLoader/>
            <PostSkeletonLoader/>
            <PostSkeletonLoader/>
            </div>}
            {error && <div>Error: {error}</div>}
          {group &&  <div className="min-h-screen">
      {/* Group Header */}
      <div className="group-header bg--100 dark:bg--800 text-center p-4">
        
        <h1 className="text-4xl mt-4 font-bold text-gray-900 dark:text-gray-200">{group.name}</h1>
        <p className="text-gray-600 mt-1 dark:text-gray-400">{group.description}</p>

        <div className="group-stats flex justify-center gap-4 mt-4 text-gray-700 dark:text-gray-300">
          <span>Members: {group.members.length}</span>
          <span>Posts: {group.posts.length}</span>
          <span>Projects: {group.projects.length}</span>
        </div>
            <div className="flex justify-center items-center gap-5">
          {/* TODO:<AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="mt-6">Join Group</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to join this group?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will send a request to the group admin to accept your request.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={()=>{
                  requestToJoinGroup({groupId}).then(()=>{
                    navigate('/groups')
                  })
                }}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog> */}
          <AlertDialog>
            <AlertDialogTrigger >
        <Button variant={"destructive"} className="mt-6">    
          Leave Group
        </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to leave this group?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={()=>{
                  exitFromGroup({groupId}).then(()=>{
                    navigate('/groups')
                  }).then(()=>{
                    toast.success("Successfully left the group")
                
                  })
                }}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
         
          {/* </AlertDialog> */}
        {admin && <div>
          {/*Delete Group */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"} className="mt-6 ml-2">
                Delete Group
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the group and all its data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={()=>{
                  deleteGroup({groupId}).then(()=>{
                    navigate('/groups')
                  })

                
                }}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          </div>}
          <RWebShare

            data={{
              text:  `
              Check out this group: ${group.name}`,
              url: `${window.location.origin}/groups/${group._id}`,
              title: "Share Group",

            }}

          >
            <Button variant={"default"} className="mt-6 ml-2">
              Share Group
            </Button>
          </RWebShare>

        
            </div>
      </div>

      {/* Group Tabs */}
      <div className="group-tabs bg-gray-200 sticky top-0 z-[9999] dark:bg-gray-700 text-gray-800 dark:text-gray-200">
        <ul className="flex justify-center md:gap-6">
          <li className={`cursor-pointer hover:text-blue-500 duration-150 p-2 md:px-4 m-2 ${
            selectedTab === "Announcements" && "bg-muted  font-bold hover:text-gray-500"
          }`}
          onClick={() =>{
            if(selectedTab != "Announcements") 
            setSelectedTab("Announcements")
            else{
              scrollToTop()
            }
          }
          }
          >Announcements</li>
          <li className={`cursor-pointer hover:text-blue-500 duration-150 p-2  md:px-4 m-2
            ${selectedTab === "Projects" && "bg-muted hover:text-gray-500 font-bold"}
          `}
          onClick={()=>{
            if(selectedTab != "Projects") 
              setSelectedTab("Projects")
              else{
                scrollToTop()
              }
          }}
          >Projects</li>
          <li className={`cursor-pointer hover:text-blue-500 duration-150  p-2  md:px-4 m-2
            ${selectedTab === "Members" && "bg-muted hover:text-gray-500 font-bold"}
          `}
          onClick={()=>{
            if(selectedTab != "Members") 
              setSelectedTab("Members")
              else{
                scrollToTop()
              }
          }}
          >Members</li>
          {(group.admin._id == user._id) && <li className={`cursor-pointer hover:text-blue-500 duration-150 p-2  md:px-4 m-2
            ${selectedTab === "Settings" && "bg-muted hover:text-gray-500 font-bold"}
          `}
          onClick={()=>{
            setSelectedTab("Settings")
          }}
          >Settings</li>}
        </ul>
      </div>
      {selectedTab === "Announcements" && <GroupAnnouncements/>}
      {selectedTab === "Projects" && <div className="group-projects p-4">
        {/* Project Cards */}
        {group.projects.length == 0 && 
      <p className="text-center">No projects found</p>}
      {admin && 
      <AddProjectModule groupId={group._id} refreshFunc={fetchGroup}/>
      } 
        {group.projects
          .map((project:any) => (
            <div key={project._id} className="bg-muted p-4 m-2">
              <div className="flex items-center justify-between">
                <div>

              <h2 className="
              text-xl font-semibold my-1
              ">{project.title}</h2>
              <p className="my-2">{project.description}</p>
              </div>
              <div>
                <div className="flex justify-end">
                {project.status == 'active' &&<span className="text-green-500 px-2 py-1 rounded-full">Active</span>}
                {project.status == 'completed' &&<span className="text-blue-500 px-2 py-1 rounded-full">Completed</span>}
                {project.status == 'pending' &&<span className="text-yellow-500 px-2 py-1 rounded-full">Pending</span>}<br/>
                </div>
                <Button className="my-2"
                onClick={()=>{
                  navigate(`/projects/${project._id}`)
                }}
                >View Project</Button>
              </div>
              </div>
            </div>
          ))}
      </div>}
     {selectedTab === "Members" && <div className="group-members p-4">
        {group.members.map((member:any) => (
  <div key={member._id} className="bg-muted p-4 m-2 cursor-pointer">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <img
          src={member.profilePicture}
          alt={member.username}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <Link to={`/user/${member.username}`} className="text-xl hover:underline block font-semibold my-1">{member.username}</Link>
          <span className="text-gray-500">{member.email}</span>
        </div>
      </div>
      <div>
        <div className="flex justify-end">
          {member._id === group.admin._id && (
            <span className="text-green-500 px-2 py-1 rounded-full">Admin</span>
          )}
          {member._id !== group.admin._id && (
            <div>
              
            <span className="text-blue-500 px-2 py-1 rounded-full">Member</span>
            <br/>
          {  admin &&
            <Button className="my-1" 
            onClick={()=>{removeFromGroup({userId:member._id, groupId:group._id})
            .then(()=>{
              fetchGroup()
            })
            
           }} variant={"destructive"}>Remove</Button>}
            </div>
            
          )}
        </div>
      </div>
    </div>
  </div>
))}

      </div>}
      {selectedTab === "Settings" && <div className="group-settings p-4">
        {/* Settings Form */}
      </div>}

    </div>}
        </div>
        <div className="md:w-[25%] hidden md:block  h-screen">
        {admin &&
        <div className="min-h-[40vh] max-h-[40vh] overflow-y-auto"> 
        <div className="m-3 text-lg font-bold">
          Join Requests
          </div>
          {joinRequests.length == 0 &&
          <p className="text-center">No join requests</p>
          }
          {
            joinRequests.map(
              (request:any)=>{
                return(
                  <div className="bg-muted p-2 m-2 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={request.profilePicture}
                          alt={request.username}
                          className="w-5 h-5 rounded-full mr-2"
                        />
                        <div>
                          <Link to={`/user/${request.username}`} className=" hover:underline block font-semibold my-1">{request.username}</Link>
                          <span className="text-sm text-gray-500">{request.email}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex gap-2 justify-end">
                          <Button
                           onClick={()=>{acceptRequest({userId:request._id,groupId:group._id})
                           .then(()=>{
                            fetchGroup()
                           })
                          }}
                           className="my-2">
                            <Check/>
                          </Button>
                          <Button className="my-2" variant={"destructive"}
                             onClick={()=>{
                              rejectRequest({userId:request._id, groupId:group._id})
                              .then(()=>{
                                
                                fetchGroup()
                              })
                            }}>
                            
                            <X/>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            )
          }
          </div>

          }
          {admin && <div>
            <div className="m-3 text-lg font-bold">
          Suggested Members

          </div>
            <div className="max-h-[40vh] overflow-y-auto">

          {suggestedPeople.length == 0 &&
          <p className="text-center">No suggested members</p>
          }
          {
            suggestedPeople.map(
              (person:any)=>{
                return(
                  <div className="bg-muted p-2 m-2 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src={person.profilePicture}
                          alt={person.username}
                          className="w-5 h-5 rounded-full mr-2"
                        />
                        <div>
                          <Link to={`/user/${person.username}`} className=" hover:underline block font-semibold my-1">{person.username}</Link>
                          <span className="text-sm text-gray-500">{person.email.length>15?person.email.substring(0,15)+"...":person.email}</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex gap-2 justify-end">
                          <Button
                           onClick={()=>{addToGroup({userId:person._id, groupId:group._id})
                           .then(()=>{
                            fetchGroup()
                           })
                          }}
                           className="my-2">
                            <Check/>
                          </Button>
                          <Button className="my-2" variant={"destructive"}
                       
                          >
                            
                            <X/>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            )
          }
                      </div>

        </div>}
   </div>
    </div>}
    </div>
  )
}

export default GroupIdPage
