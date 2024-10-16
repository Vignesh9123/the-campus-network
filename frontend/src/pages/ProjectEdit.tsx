import { getProject, updateProject } from "@/api"
import ProfileSideBar from "@/components/sections/ProfileSideBar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {useState, useEffect} from 'react'
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

function ProjectEdit() {
  const navigate = useNavigate()
  const { projectId } = useParams()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("")
  const [estimatedEndDate, setEstimatedEndDate] = useState("")

  const fetchProject = async () => {
    const data = await getProject({projectId})
    setTitle(data.data.data.title)
    setDescription(data.data.data.description)
    setStatus(data.data.data.status)
    setEstimatedEndDate(data.data.data.estimatedEndDate.split("T")[0])
  }
  useEffect(() => {
    fetchProject()
  }, [])

  const handleUpdate = async () => {
    await updateProject({projectId, updateData:{
      title,
      description,
      status,
      estimatedEndDate
    }})
    toast.success("Project updated successfully")
    navigate(`/projects/${projectId}`)
  }

  return (
    <div className="flex">
      <div className="hidden md:block md:w-1/4 border-0 border-r h-screen">
        <ProfileSideBar/>
      </div>
      <div className="w-full md:w-3/4">
      <div className=" py-3 text-center font-bold border-0 border-b">
        <div className="cursor-pointer flex" onClick={()=>navigate(-1)}><ArrowLeft/>Back</div>
        <div className="text-xl ">Edit Project</div>
      </div>
      <div className="m-5 flex flex-col gap-2">
       <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-md" htmlFor="name">
            Name
          </label>
          <Input
            id="name"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-md" htmlFor="description">
            Description
          </label>
          <Input
            id="description"
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-md" htmlFor="status">
            Status
          </label>
          <Input
            id="status"
            value={status}
            onChange={(e)=>setStatus(e.target.value)}
          />
        </div>
       <div className="flex flex-col gap-2">
          <label className="text-md" htmlFor="estendDate">
            Estimated End Date
          </label>
          <Input
            id="estendDate"
            type="date"
            value={estimatedEndDate}
            onChange={(e)=>setEstimatedEndDate(e.target.value)}
          />
        </div>

        <div className="grid col-span-2 mt-5">
          <Button onClick={handleUpdate}>Update</Button>
        </div>
        

       </div>
       </div>
      </div>


    </div>
  )
}

export default ProjectEdit
