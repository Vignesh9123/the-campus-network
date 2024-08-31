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
const registerUser = (data: {
    email: string;
    password: string;
    username: string;
  }) => {
    return apiClient.post("/users/register", data);
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
export { loginUser, registerUser, logoutUser , getCurrentUser, checkUsernameUnique};