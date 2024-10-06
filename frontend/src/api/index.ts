import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URI,
    withCredentials: true,
    timeout: 120000,
});
apiClient.interceptors.request.use(
    function (config) {
      // Retrieve user token from local storage
      const token = localStorage.getItem("token");
      // Set authorization header with bearer token
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
);
const loginUser = (data: {email:string|null, username: string|null; password: string }) => {
    return apiClient.post("/users/loginuser", data);
};
const registerUser = (data:FormData) => {
    return apiClient.post("/users/register", data,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
const logoutUser = () => {
    return apiClient.post("/users/logout");
};
const getCurrentUser = () =>{
  return apiClient.get('/users/current-user')
}
const checkUsernameUnique = (username:string)=>{
  return apiClient.get(`/users/check-username?username=${username}`)
}

const updateAccountDetails = (data:{username:string|null, email:string|null, bio:string|null}) =>{
  return apiClient.patch('/users/update-account-details',data)
}

const addPersonalDetails = (data:{ phone:string|null, engineeringDomain:string|null, college:string|null, yearOfGraduation:string|null })=>{
  return apiClient.post('/users/add-personal-details',data)
}

const updateProfilePicture = (data:FormData)=>{
  return apiClient.patch('/users/update-profile-picture', data,{
    headers: {
        'Content-Type': 'multipart/form-data'
    }
  })
}

const changePassword = (data:{oldPassword:string, newPassword:string})=>{
  return apiClient.post('/users/change-password', data)
}
const forgotPassword = (data:{email:string})=>{
  return apiClient.post('/users/forgot-password', data)
}
const getAccountsToFollow = ()=>{
  return apiClient.get('/users/recommendations')
}

const createPost = (data:{title:string;content:string;isPublic:boolean;tags:string[];onlyFollowers:boolean}) =>{
  return apiClient.post('/posts/create',data)
}

const getUserPosts = (data:{username:string})=>{
  return apiClient.get(`/posts/user/${data.username}`)
}

const searchUser = (data:{query:string})=>{
  return apiClient.get(`/users/search?query=${data.query}`)
}
const getUserProfile = (data:{username:string | undefined}) =>{
  return apiClient.get(`/users/u=${data.username}`)
}
const refreshToken = () => {
    return apiClient.post("/users/refresh-token");
};
const followOrUnfollow = (data:{userId:string})=>{
  return apiClient.post(`/users/follow/${data.userId}`)
}
const searchPost = (data:{query:string})=>{
  return apiClient.get(`/posts/search?query=${data.query}`)
}
const getFollowers =(data:{username:string|undefined})=>{
  return apiClient.get(`/users/followers/${data.username}`)
}
const getFollowing = (data:{username:string|undefined})=>{
  return apiClient.get(`/users/following/${data.username}`)
}
const checkToken = ()=>{
  return apiClient.get('/users/check-token')
}
const likePost = (data:{postId:string})=>{
  return apiClient.post(`/posts/like/${data.postId}`)
}
const getUserFeed = ( ()=>{
  return apiClient.get('/users/feed')
})
const addComment = (data:{postId:string|undefined, content:string})=>{
  return apiClient.post(`/comments/${data.postId}`, {comment:data.content})
}
const getCommentsbyPost = (data:{postId:string|undefined})=>{
  return apiClient.get(`/comments/${data.postId}`)
}
const deleteComment = (data:{commentId:string|undefined})=>{
  return apiClient.delete(`/comments/${data.commentId}`)
}
const getPost = (data:{postId:string|undefined})=>{
  return apiClient.get(`/posts/post/${data.postId}`)
}
const createGroup = (data: { groupData: any }) => {
  return apiClient.post(`/groups/create-group`, data.groupData);
}

const getGroup = (data: { groupId: string | undefined }) => {
  return apiClient.get(`/groups/get-group/${data.groupId}`);
}

const acceptRequest = (data: { userId: string | undefined, groupId: string | undefined }) => {
  return apiClient.post(`/groups/accept-request/${data.userId}/${data.groupId}`);
}

const addToGroup = (data: { userId: string | undefined, groupId: string | undefined }) => {
  return apiClient.post(`/groups/add-to-group/${data.userId}/${data.groupId}`);
}

const deleteGroup = (data: { groupId: string | undefined }) => {
  return apiClient.delete(`/groups/delete-group/${data.groupId}`);
}

const exitFromGroup = (data: { groupId: string | undefined }) => {
  return apiClient.post(`/groups/exit-from-group/${data.groupId}`);
}

const isGroupNameUnique = (data: { groupName: string }) => {
  return apiClient.post(`/groups/is-group-name-unique`, { name: data.groupName });
}

const rejectRequest = (data: { userId: string | undefined, groupId: string | undefined }) => {
  return apiClient.post(`/groups/reject-request/${data.userId}/${data.groupId}`);
}

const removeFromGroup = (data: { userId: string | undefined, groupId: string | undefined }) => {
  return apiClient.post(`/groups/remove-from-group/${data.userId}/${data.groupId}`);
}

const requestToJoinGroup = (data: { groupId: string | undefined }) => {
  return apiClient.post(`/groups/request-to-join-group/${data.groupId}`);
}

const addProject = (data: { projectData: any }) => {
  return apiClient.post(`/projects/add-project`, data.projectData);
}

const getGroupProjects = (data: { groupId: string | undefined }) => {
  return apiClient.get(`/projects/get-group-projects/${data.groupId}`);
}

const getMyProjects = () => {
  return apiClient.get(`/projects/get-my-projects`);
}

const getProject = (data: { projectId: string | undefined }) => {
  return apiClient.get(`/projects/get-project/${data.projectId}`);
}

const updateProject = (data: { projectId: string | undefined, updateData: any }) => {
  return apiClient.patch(`/projects/update-project/${data.projectId}`, data.updateData);
}

const updateProjectStatus = (data: { projectId: string | undefined, status: string }) => {
  return apiClient.patch(`/projects/update-project-status/${data.projectId}`, { status: data.status });
}

const deleteProject = (data: { projectId: string | undefined }) => {
  return apiClient.delete(`/projects/delete-project/${data.projectId}`);
}

const createTask = (data: { taskData: any }) => {
  return apiClient.post(`/tasks/create-task`, data.taskData);
}

const getTask = (data: { taskId: string | undefined }) => {
  return apiClient.get(`/tasks/get-task/${data.taskId}`);
}

const updateTask = (data: { taskId: string | undefined, updateData: any }) => {
  return apiClient.patch(`/tasks/update-task/${data.taskId}`, data.updateData);
}

const updateTaskStatus = (data: { taskId: string | undefined, status: string }) => {
  return apiClient.patch(`/tasks/update-task-status/${data.taskId}`, { status: data.status });
}

const deleteTask = (data: { taskId: string | undefined }) => {
  return apiClient.delete(`/tasks/delete-task/${data.taskId}`);
}
const getMyGroups = ()=>{
  return apiClient.get('/groups/get-my-groups')
}
const getMyTasks = (data:{projectId:string |undefined})=>{
  return apiClient.get(`/tasks/get-my-tasks/${data.projectId}`)
}
const getOthersTasks = (data:{projectId: string | undefined})=>{
  return apiClient.get(`/tasks/get-others-tasks/${data.projectId}`)
}

const sendNotification = (data:{
  title:string,
  body:string,
  token:string;
})=>{
  return apiClient.post('/notifications/send-notification',data)
}

const storeDeviceToken = (
  data: { token: string }
) => {
  return apiClient.post("/notifications/store-device-token", data);
};

const sendNotificationToUser = (
  data: { userId: string, title: string, body: any}
) => {
  return apiClient.post("/notifications/send-notification-to-user", data);
};
const getGroupSuggestedPeople = (data:{groupId:string|undefined})=>{
  return apiClient.get(`/groups/group-suggested-people/${data.groupId}`)
}

const getGroupForVisitors = (data:{groupId:string|undefined})=>{
  return apiClient.get(`/groups/get-group-for-visitors/${data.groupId}`)
}

const getMyIndividualProjects = ()=>{
  return apiClient.get('/projects/get-my-individual-projects')
}

const updateGroupDetails = (
  data: { groupId: string | undefined, updateData: {
    name?:string,
    description?:string
  } }
)=>{
  return apiClient.patch(`/groups/update-group-details/${data.groupId}`, data.updateData)
}

const changeGroupAdmin = (
  data:{groupId:string | undefined, userId:string |undefined}
) =>{
  return apiClient.patch(`/groups/change-group-admin/${data.groupId}/${data.userId}`)

}

const createRepost = (data:{postId:string | undefined})=>{
  return apiClient.post(`/posts/repost/${data.postId}`);
}

const getLikedUsers = (data:{postId:string | undefined})=>{
  return apiClient.get(`/posts/likes/${data.postId}`);
}

const getRepostedUsers = (data:{postId:string | undefined})=>{
  return apiClient.get(`/posts/reposts/${data.postId}`);
}

export {refreshToken, loginUser,checkToken, registerUser, logoutUser ,getAccountsToFollow,changePassword,forgotPassword, getCurrentUser, checkUsernameUnique, createPost,createRepost ,updateAccountDetails,addPersonalDetails, updateProfilePicture,getUserPosts,searchUser, getUserProfile,followOrUnfollow, searchPost,getFollowers, getFollowing, likePost, getUserFeed, addComment,deleteComment,getCommentsbyPost,getPost,
  createGroup, getGroup, acceptRequest, addToGroup, deleteGroup, exitFromGroup, isGroupNameUnique, rejectRequest, removeFromGroup, requestToJoinGroup,
  addProject, getGroupProjects, getMyProjects, getProject, updateProject, updateProjectStatus, deleteProject,
  createTask, getTask, updateTask, updateTaskStatus, deleteTask,getMyGroups,getMyTasks,getOthersTasks,sendNotification,storeDeviceToken,sendNotificationToUser,getGroupSuggestedPeople,getGroupForVisitors,getMyIndividualProjects, updateGroupDetails, changeGroupAdmin, getLikedUsers, getRepostedUsers
  }
