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
const createPost = (data:{title:string;content:string;isPublic:boolean;tags:string[];onlyFollowers:boolean}) =>{
  return apiClient.post('/posts/create',data)
}
export { loginUser, registerUser, logoutUser , getCurrentUser, checkUsernameUnique, createPost, updateAccountDetails,addPersonalDetails, updateProfilePicture};