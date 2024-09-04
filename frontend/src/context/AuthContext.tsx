import React, {useState, useEffect, useContext, createContext} from "react";
import {useNavigate} from 'react-router-dom'
import { requestHandler } from "@/utils";
import { loginUser, registerUser, logoutUser,getCurrentUser } from "@/api";
import Loader from "@/components/Loader";
export interface UserInterface {
    _id: string;
    profilePicture: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    followers: string[];
    following: string[];
  }
  
const AuthContext = createContext<{
    user:UserInterface | null;
    token: string | null;
    login:(data:{email:string|null,username:string|null;password:string })=>Promise<void>;
    register:(data:FormData)=>Promise<void>;
    logout:()=>Promise<void>;
    getGoogleSignedInUser:({accessToken}:any)=>Promise<void>
}>({
    user:null,
    token:null,
    login:async()=>{},
    register:async()=>{},
    logout:async()=>{},
    getGoogleSignedInUser:async()=>{}
});

const useAuth = () => useContext(AuthContext);

const AuthProvider:React.FC<{children:React.ReactNode}> = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<UserInterface | null>(null);
    const [token, setToken] = useState<string | null>(null);
    
    const navigate = useNavigate();
    const login = async (data:{email:string|null,username:string|null;password:string }) => {
        await requestHandler(
            async () => await loginUser(data),
            setIsLoading,
            (res) => {
                console.log(res);
                setUser(res.data.user);
                setToken(res.data.accessToken);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                localStorage.setItem("token", res.data.accessToken);
                navigate("/profile");
            },
            alert
        );
    }
    const register = async (data:FormData) => {
        await requestHandler(
            async () => await registerUser(data),
            setIsLoading,
            ()=>{
                navigate("/login");
            },
            alert
        );
    }

    const logout = async () => {
        await requestHandler(
            async () => await logoutUser(),
            setIsLoading,
            ()=>{
                setUser(null);
                setToken(null);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/login");
            },
            alert
        );
    }

    const getGoogleSignedInUser = async({accessToken}:any)=>{
        await requestHandler(
            async()=>await getCurrentUser(),
            setIsLoading,
            (res)=>{
                console.log(res);
                setUser(res.data);
                setToken(accessToken);
                localStorage.setItem("user", JSON.stringify(res.data));
                localStorage.setItem("token", accessToken);
            },
            alert
        )
    }
   
     // Check for saved user and token in local storage during component initialization
  useEffect(() => {
    setIsLoading(true);
    const _token = localStorage.getItem("token");
    const _user:any = localStorage.getItem("user");
    if (_token && _user) {
    setUser(JSON.parse(_user));
      setToken(_token);
    }
    setIsLoading(false);
  }, []);
  return (
    <AuthContext.Provider value={{ user, login, register, logout, token, getGoogleSignedInUser}}>
      {isLoading ? <Loader /> : children} {/* Display a loader while loading */}
    </AuthContext.Provider>
  );
}

export {AuthContext, AuthProvider, useAuth}
