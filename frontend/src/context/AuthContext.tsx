import React, {useState, useEffect, useContext, createContext} from "react";
import {useNavigate} from 'react-router-dom'
import { requestHandler } from "@/utils";
import { loginUser, registerUser, logoutUser } from "@/api";
import Loader from "@/components/Loader";
interface UserInterface {
    _id: string;
    profilePicture: string;
    username: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  }
  
const AuthContext = createContext<{
    user:UserInterface | null;
    token: string | null;
    login:(data:{username:string;password:string })=>Promise<void>;
    register:(data:{username:string;email:string;password:string })=>Promise<void>;
    logout:()=>Promise<void>;
}>({
    user:null,
    token:null,
    login:async()=>{},
    register:async()=>{},
    logout:async()=>{},
});

const useAuth = () => useContext(AuthContext);
const navigate = useNavigate();

const AuthProvider:React.FC<{children:React.ReactNode}> = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<UserInterface | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const login = async (data:{username:string;password:string }) => {
        await requestHandler(
            async () => await loginUser(data),
            setIsLoading,
            (res) => {
                setUser(res.data.user);
                setToken(res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                localStorage.setItem("token", res.data.token);
                navigate("/profile");
            },
            alert
        );
    }
    const register = async (data:{username:string;email:string;password:string }) => {
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
     // Check for saved user and token in local storage during component initialization
  useEffect(() => {
    setIsLoading(true);
    const _token = localStorage.getItem("token");
    const _user:any = localStorage.getItem("user");
    if (_token && _user?._id) {
      setUser(_user);
      setToken(_token);
    }
    setIsLoading(false);
  }, []);
  return (
    <AuthContext.Provider value={{ user, login, register, logout, token }}>
      {isLoading ? <Loader /> : children} {/* Display a loader while loading */}
    </AuthContext.Provider>
  );
}

export {AuthContext, AuthProvider, useAuth}
