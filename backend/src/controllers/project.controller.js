import {Project} from '../models/project.model.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {Group} from '../models/group.model.js'
import { Task } from '../models/task.model.js'
import { User } from '../models/user.model.js'

const addProject = asyncHandler(async (req, res) => {
    const {title, description, startDate, estimatedEndDate, group} = req.body
    if(!title || !description || !startDate || !estimatedEndDate || !group) 
        throw new ApiError(400, "All fields are required")
    const groupExists = await Group.findById(group)
    if(!groupExists) 
        throw new ApiError(404, "Group not found")
    if(!groupExists.members.includes(req.user._id))
        throw new ApiError(403, "You are not a member of this group")
    if(groupExists.admin.toString() !== req.user._id.toString())
        throw new ApiError(403, "You are not the admin of this group")

    const project = await Project.create({
        title,
        description,
        startDate,
        estimatedEndDate,
        group,
        createdBy: req.user._id
    })

    if(!project) throw new ApiError(500, "Something went wrong while creating the project")
    groupExists.projects.push(project._id)
    await groupExists.save()
    return res.status(201).json(new ApiResponse(201, project, "Project added successfully"))
})

const getGroupProjects = asyncHandler(async (req, res) => {
    const {groupId} = req.params
    if(!groupId) throw new ApiError(400, "Group id is required")
    const group = await Group.findById(groupId)
    if(!group) throw new ApiError(404, "Group not found")
    if(!group.members.includes(req.user._id))
            throw new ApiError(403, "You are not a member of this group")
    const projects = await Project.find({group: groupId}).select('-tasks')
    if(!projects) throw new ApiError(404, "No projects found")
    return res.status(200).json(new ApiResponse(200, projects, "Projects fetched successfully"))    
})
const getMyProjects = asyncHandler(async (req, res) => {
    const groups = await Group.find({members: req.user._id})

    if(!groups) throw new ApiError(404, "You are not a member of any groups")

    const projects = await Project.find({group: {$in: groups.map(group => group._id)}}).select('-tasks')
    if(!projects) throw new ApiError(404, "No projects found")
    return res.status(200).json(new ApiResponse(200, projects, "Projects fetched successfully"))
})
const getProject = asyncHandler(async (req, res) => {
    const {projectId} = req.params
    if(!projectId) throw new ApiError(400, "Project id is required")
    const project = await Project.findById(projectId)
    if(!project) throw new ApiError(404, "Project not found")
    if(!req.user.groups.includes(project.group._id))
        throw new ApiError(403, "You are not a member of the group the project is part of")
    return res.status(200).json(new ApiResponse(200, project, "Project fetched successfully"))
})

const updateProject = asyncHandler(async (req, res) => {
    const {projectId} = req.params
    if(!projectId) throw new ApiError(400, "Project id is required")
    
    const project = await Project.findById(projectId)
    if(
        !req.user.groups.includes(project.group._id) ||
        project.createdBy._id.toString() !== req.user._id.toString()

    ){
        throw new ApiError(403, "You are not authorized to update this project")
    }

    const {title, description, estimatedEndDate} = req.body
    const updatedProject = await Project.findByIdAndUpdate(projectId, {
        title:title || project.title,
        description:description || project.description,
        estimatedEndDate:estimatedEndDate || project.estimatedEndDate 

    }, {new: true})

    if(!project) throw new ApiError(404, "Project not found")
    return res.status(200).json(new ApiResponse(200, updatedProject, "Project updated successfully"))
})

const deleteProject = asyncHandler(async (req, res) => {
    const {projectId} = req.params
    if(!projectId) throw new ApiError(400, "Project id is required")     
    const project = await Project.findById(projectId)
    if(
        !req.user.groups.includes(project.group._id) ||
        project.createdBy._id.toString() !== req.user._id.toString()
    
    ){
        throw new ApiError(403, "You are not authorized to delete this project")
    }
    await Project.findByIdAndDelete(projectId)
    if(!project) throw new ApiError(404, "Project not found")
    return res.status(200).json(new ApiResponse(200, null, "Project deleted successfully"))
})

const updateProjectStatus = asyncHandler(async (req, res) => {
    const {projectId} = req.params
    if(!projectId) throw new ApiError(400, "Project id is required")
    const project = await Project.findById(projectId)
    if(
        !req.user.groups.includes(project.group._id)
    ){
        throw new ApiError(403, "You are not authorized to update the status of this project")
    }
    const {status} = req.body
    const updatedProject = await Project.findByIdAndUpdate(projectId, {
        status:status || project.status
    }, {new: true})
    if(!project) throw new ApiError(404, "Project not found")
    return res.status(200).json(new ApiResponse(200, updatedProject, "Project status updated successfully"))
})


export {
    addProject,
    getGroupProjects,
    getMyProjects,
    getProject,
    updateProject,
    deleteProject,
    updateProjectStatus
}