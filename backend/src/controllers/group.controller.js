import {Group} from '../models/group.model.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../models/user.model.js'

const createGroup = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    if (!name) {
        throw new ApiError(400, "Group name is required")
    }
    const group = await Group.create({
        name,
        description,
        admin: req.user._id,
        members: [req.user._id]
    })
    if (!group) {
        throw new ApiError(500, "Something went wrong while creating group")
    }
    const user = await User.findByIdAndUpdate(req.user._id, {$push: {groups: group._id}}, {new: true})
    .select('-password -refreshToken')
    return res.status(201).json(new ApiResponse(201, {user,group}, "Group created successfully"))
})

const isGroupNameUnique = asyncHandler(async (req, res) => {
    const {name} = req.body
    const group = await Group.findOne({name})
    if (group) {
        return res.status(200).json(new ApiResponse(200, {isUnique: false}, "Group name already exists"))
    }
    return res.status(200).json(new ApiResponse(200, {isUnique: true}, "Group name is unique"))
})


const getGroup = asyncHandler(async (req, res) => {
    const {groupId} = req.params
    const group = await Group.findById(groupId)
        .populate('admin', 'username email profilePicture') //TODO:Check if required
        .populate('members', 'username email profilePicture')
        .populate('projects', '')
    //populate joinRequests only req.user._id == group.admin._id

    if (req.user._id.equals(group.admin._id)) {
        group.joinRequests = await User.find({_id: {$in: group.joinRequests}}, 'username email profilePicture')
    } else {
        group.joinRequests = []
    }
    
    if (!group) {
        throw new ApiError(404, "Group not found")
    }
    return res.status(200).json(new ApiResponse(200, group, "Group found"))
})

const exitFromGroup = asyncHandler(async (req, res) => {
    const {groupId} = req.params
    const group = await Group.findById(groupId)
    if (!group) {
        throw new ApiError(404, "Group not found")
    }
    if (!group.members.includes(req.user._id)) {
        throw new ApiError(400, "User is not a member of this group")
    }
    group.members = group.members.filter(member => member.toString() !== req.user._id.toString())
    await group.save()
    const user = await User.findByIdAndUpdate(req.user._id, {$pull: {groups: group._id}}, {new: true})
    .select('-password -refreshToken')
    return res.status(200).json(new ApiResponse(200, null, "User left from group"))
})

const requestToJoinGroup = asyncHandler(async (req, res) => {
    const {groupId} = req.params
    const group = await Group.findById(groupId)
    if (!group) {
        throw new ApiError(404, "Group not found")
    }
    if (group.joinRequests.includes(req.user._id)) {
        throw new ApiError(400, "Request already sent")
    }
    if(group.members.includes(req.user._id))
        throw new ApiError(400, "User already the member of the group")
    group.joinRequests.push(req.user._id)
    await group.save()

    const user = await User.findByIdAndUpdate(req.user._id, {$push: {pendingGroupRequests: group._id}}, {new: true})
    .select('-password -refreshToken')
    return res.status(200).json(new ApiResponse(200, null, "Request sent"))
})

const acceptRequest = asyncHandler(async (req, res) => {
    const {groupId, userId} = req.params
    const group = await Group.findById(groupId)
    if (!group) {
        throw new ApiError(404, "Group not found")
    }
    if(
        !group.admin.equals(req.user._id)
    ){
        throw new ApiError(403, "You are not authorized to accept requests")
    }
    if (!group.joinRequests.includes(userId)) {
        throw new ApiError(400, "Request not found")
    }
    group.joinRequests = group.joinRequests.filter(request => request.toString() !== userId.toString())
    group.members.push(userId)
    await group.save()
    const user = await User.findByIdAndUpdate(userId, {$push: {groups: group._id}, $pull: {pendingGroupRequests: group._id}}, {new: true})
    .select('-password -refreshToken')
    return res.status(200).json(new ApiResponse(200, group, "Request accepted"))
})

const rejectRequest = asyncHandler(async (req, res) => {
    const {groupId, userId} = req.params
    const group = await Group.findById(groupId)
    if (!group) {
        throw new ApiError(404, "Group not found")
    }
    if(
        !group.admin.equals(req.user._id)
    ){
        throw new ApiError(403, "You are not authorized to reject requests")
    }
    if (!group.joinRequests.includes(userId)) {
        throw new ApiError(400, "Request not found")
    }
    group.joinRequests = group.joinRequests.filter(request => request.toString() !== userId.toString())
    await group.save()

    const user = await User.findByIdAndUpdate(userId, {$pull: {pendingGroupRequests: group._id}}, {new: true})
    .select('-password -refreshToken')
    return res.status(200).json(new ApiResponse(200, group, "Request rejected"))
})

const addToGroup = asyncHandler(async (req, res) => {
    const {groupId, userId} = req.params
    const group = await Group.findById(groupId)
    if (!group) {
        throw new ApiError(404, "Group not found")
    }
    if(
        !group.admin.equals(req.user._id) 
    ){
        throw new ApiError(403, "You are not authorized to add users to this group")
    }
    if(group.members.includes(userId))
        throw new ApiError(400, "User already the member of the group")
    if (!group.members.includes(userId)) {
        group.members.push(userId)
        await group.save()
    }
    const user = await User.findByIdAndUpdate(userId, {$push: {groups: group._id}}, {new: true})
    return res.status(200).json(new ApiResponse(200, {user,group}, "User added to group"))
})

const removeFromGroup = asyncHandler(async (req, res) => {
    const {groupId, userId} = req.params
    const group = await Group.findById(groupId)
    if (!group) {
        throw new ApiError(404, "Group not found")
    }
    if(
        !group.admin.equals(req.user._id)
    ){
        throw new ApiError(403, "You are not authorized to remove users from this group")
    }
    if(!group.members.includes(userId))
        throw new ApiError(400, "User is not a member of this group")
    if (group.members.includes(userId)) {
        group.members = group.members.filter(member => member.toString() !== userId.toString())
        await group.save()
    }
    await User.findByIdAndUpdate(userId, {$pull: {groups: group._id}}, {new: true})
    return res.status(200).json(new ApiResponse(200, group, "User removed from group"))
})

const deleteGroup = asyncHandler(async (req, res) => {
    const {groupId} = req.params
    const group = await Group.findById(groupId)
    if (!group) {
        throw new ApiError(404, "Group not found")
    }
    if (!group.admin.equals(req.user._id)) {
        throw new ApiError(403, "You are not authorized to delete this group")
    }
    for(let id of group.members){
        await User.findByIdAndUpdate(id, 
            {
                $pull:{groups:group._id,}

            }
        )
    }

    for(let id of group.joinRequests){
        await User.findByIdAndUpdate(id,
            {
                $pull:{pendingGroupRequests:group._id,}

            }
        )
    }
    await Group.findByIdAndDelete(groupId)

    return res.status(200).json(new ApiResponse(200, null, "Group deleted successfully"))
})

const getMyGroups = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate('groups', 'name description')
        .select('groups')
    return res.status(200).json(new ApiResponse(200, user.groups, "Groups found"))
})

export {
    createGroup,
    isGroupNameUnique,
    getGroup,
    addToGroup,
    exitFromGroup,
    requestToJoinGroup,
    acceptRequest,
    rejectRequest,
    removeFromGroup,
    deleteGroup,
    getMyGroups
}