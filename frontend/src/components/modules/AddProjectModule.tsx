import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import { addProject } from '@/api'
function AddProjectModule({groupId, refreshFunc}: {groupId:string;
    refreshFunc: ()=>void
}) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [ open,  setOpen ] = useState(false) 


    const addProjectToGroup = ()=>{
        addProject({
           projectData:{
            title,
            description,
            startDate,
            estimatedEndDate: endDate,
            group: groupId
           
           }   
        }).then(()=>{
            setOpen(false)
            refreshFunc()
        })
    }

  return (
    <div>
      <Dialog 
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>
          <Button className="my-4 w-full ">Add Project</Button>
        </DialogTrigger>
        <DialogContent className="max-w-[40vw]">
          <DialogTitle>Add Project</DialogTitle>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-" htmlFor="name">
                Name
              </label>
              <div className="col-span-3">
              <Input
                id="name"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                type="text"
                placeholder="Project Name"
                className="
                "
              />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-" htmlFor="description">
                Description
              </label>
              <div className="col-span-3">
              <Input
                id="description"
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                type="text"
                placeholder="Project Description"
              />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
              <label className="text-" htmlFor="startDate">
                Start Date
              </label>
              <Input
                id="startDate"
                type="date"

                value={startDate}
                onChange={(e)=>setStartDate(e.target.value)}
                />
            <Separator orientation="vertical"/>
            </div>
              <div className="flex items-center gap-2">
              <label className="text-md" htmlFor="estendDate">
                  End Date <span className="text-xs">(estimated)</span>
              </label>
              <Input
                id="estendDate"
                type="date"
                value={endDate}
                onChange={(e)=>setEndDate(e.target.value)}
                />
            </div>
          </div>
          </div>
          <Button className="w-full"
          onClick={()=>{
            addProjectToGroup()
          }}
          >Add Project</Button>
        
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddProjectModule
