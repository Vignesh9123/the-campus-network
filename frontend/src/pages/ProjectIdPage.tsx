import { getMyTasks, getOthersTasks, getProject } from "@/api";
import ProfileSideBar from "@/components/sections/ProfileSideBar";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import TaskTableRow from "@/components/modules/TaskTableRow";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  import AddTasksModule from "@/components/modules/AddTasksModule";
  // import { Button } from "@/components/ui/button";
  import { Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
   } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
function ProjectIdPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<any>(null);
  const { user } = useAuth();
  const [admin, setAdmin] = useState(false)
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const [othersTasks, setOthersTasks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  
  const filteredMyTasks = myTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });


  const filteredOthersTasks = othersTasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });







  
  

  useEffect(() => {
    const fetchProject = async () => {
      const data = await getProject({ projectId });
      const myTaskRes = await getMyTasks({ projectId });
      setMyTasks(myTaskRes.data.data);
      const othersTaskRes = await getOthersTasks({projectId});
      setOthersTasks(othersTaskRes.data.data);
      const proj = data.data.data
      setProject(proj);
      if(proj.createdBy._id.toString() == user?._id.toString())
        setAdmin(true)
      
    };
    fetchProject();
  }, [projectId]);
  return (
    <div>
      <div className="flex">
        <div className="w-[15%] md:w-1/4 border-0 border-r-[1px] h-screen">
          <ProfileSideBar />
        </div>
        <div className="overflow-y-scroll md:w-3/4 scrollbar-hide h-screen">
          {project && (
            <div>
                <div className="flex items-center m-5 mb-2 mx-10 justify-between">                    
              <Breadcrumb className="">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <Link className="hover:text-white" to="/groups">
                      Groups
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <Link
                      className="hover:text-white"
                      to={`/groups/${project.group._id}?tab=Projects&scroll=true`}
                    >
                      {project.group.name}
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{project.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              {admin && <AddTasksModule projectId={project._id} members={project.group.members}/>}
                </div>
              <Separator className="mt-3" />
              <div className="header flex justify-between items-center">
                <div>
                  <div className="text-3xl mt-5 mx-10 font-bold">
                    {project?.title}
                  </div>
                  <div className="text-md text-muted-foreground mx-10">
                    {project?.description}
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="mx-5 flex items-center gap-1">
                    <div className="text-muted-foreground">Start Date:</div>
                    <div className="text-lg font-bold">
                      {new Date(project.startDate).toDateString()}
                    </div>
                  </div>
                  <div className="mx-5 flex items-center gap-1">
                    <div className="text-muted-foreground">
                      Estimated End Date:
                    </div>
                    <div className="text-lg font-bold">
                      {new Date(project.estimatedEndDate).toDateString()}
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="mt-5" />
              <Accordion type="single" defaultValue="yourTasks" collapsible className="m-5">
      <AccordionItem value="yourTasks">
        <AccordionTrigger className="text-xl font-semibold">Your Tasks</AccordionTrigger>
        <AccordionContent>
          {/* Filters */}
          <div className="flex justify-between">

         <div className="flex gap-5">
            <Select 
            value={statusFilter}
            onValueChange={
              (value) => {
                setStatusFilter(value);
              }
            }
            >
  <SelectTrigger className="w-[180px] focus:ring-0 border-0 border-b-[1px] border-b-slate-300
  ">
    <SelectValue placeholder="Status"
    />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All</SelectItem>
    <SelectItem value="todo">To Do</SelectItem>
    <SelectItem value="in progress">In Progress</SelectItem>
    <SelectItem value="completed">Completed</SelectItem>
  </SelectContent>
</Select>
            <Select
            value={priorityFilter}
            onValueChange={
              (value) => {
                setPriorityFilter(value);
              }}
            >
  <SelectTrigger className="w-[180px] focus:ring-0 border-0 border-b-[1px] border-b-slate-300
  ">
    <SelectValue placeholder="Priority" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All</SelectItem>
    <SelectItem value="low">Low</SelectItem>
    <SelectItem value="medium">Medium</SelectItem>
    <SelectItem value="high">High</SelectItem>
  </SelectContent>
</Select>
         </div>
         <Input
         placeholder="Search"
         className="border-0 border-b-[1px] border-b-slate-300 focus:ring-0"
         value={search}
         onChange={(e) => setSearch(e.target.value)}
         />
    </div>
          {/* Table */}

               <div className="grid grid-cols-5 p-5 place-items-center">
       <div>Title</div>
       <div>Status</div>
       <div>Assigned to</div>
       <div>Priority</div>
       <div>Due Date</div>
    </div>
    {
      filteredMyTasks.map((task) => (
        <TaskTableRow admin={admin} task={task} key={task._id} />
    ))}

        
    
  
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger  className="text-xl font-semibold">Others Tasks</AccordionTrigger>
        <AccordionContent>
          {/* Filters */}
          <div className="flex justify-between">

         <div className="flex gap-5">
            <Select
            value={statusFilter}

            onValueChange={
              (value) => {
                setStatusFilter(value);
              }
            }
            >
  <SelectTrigger className="w-[180px] focus:ring-0 border-0 border-b-[1px] border-b-slate-300
  ">
    <SelectValue placeholder="Status"
    />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All</SelectItem>
    <SelectItem value="todo">To Do</SelectItem>
    <SelectItem value="in progress">In Progress</SelectItem>
    <SelectItem value="completed">Completed</SelectItem>
  </SelectContent>
</Select>
            <Select
            value={priorityFilter}
            onValueChange={
              (value) => {
                setPriorityFilter(value);
              }}
            >
  <SelectTrigger className="w-[180px] focus:ring-0 border-0 border-b-[1px] border-b-slate-300
  ">
    <SelectValue placeholder="Priority" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All</SelectItem>
    <SelectItem value="low">Low</SelectItem>
    <SelectItem value="medium">Medium</SelectItem>
    <SelectItem value="high">High</SelectItem>
  </SelectContent>
</Select>
         </div>
         <Input
         placeholder="Search"
         className="border-0 border-b-[1px] border-b-slate-300 focus:ring-0"
         value={search}

         onChange={(e) => setSearch(e.target.value)}
         />
    </div>
          
        <div className="grid grid-cols-5 p-5 place-items-center">
       <div>Title</div>
       <div>Status</div>
       <div>Assigned to</div>
       <div>Priority</div>
       <div>Due Date</div>
    </div>
    {
      filteredOthersTasks.map((task) => (
        <TaskTableRow admin={admin} task={task} key={task._id} />
    ))}
      
         
        </AccordionContent>
      </AccordionItem>
    </Accordion>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectIdPage;
