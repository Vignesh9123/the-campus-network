import React, {useState, useEffect, useContext, createContext} from "react";
import {useNavigate, useLocation} from 'react-router-dom'
import { requestHandler } from "@/utils";
import { loginUser, registerUser, logoutUser,getCurrentUser,updateAccountDetails,addPersonalDetails , updateProfilePicture, refreshToken,followOrUnfollow,checkToken} from "@/api";
import Loader from "@/components/Loader";
export interface UserInterface {
    _id: string;
    profilePicture: string;
    username: string;
    bio:string;
    phone:string;
    email: string;
    createdAt: string;
    updatedAt: string;
    followers: string[];
    following: string[];
    college:string;
    engineeringDomain:string;
    yearOfGraduation:string;
  }
  
const AuthContext = createContext<{
    user:UserInterface | null;
    token: string | null;
    login:(data:{email:string|null,username:string|null;password:string })=>Promise<void>;
    register:(data:FormData)=>Promise<void>;
    logout:()=>Promise<void>;
    getGoogleSignedInUser:({accessToken}:any)=>Promise<void>;
    updateAccDetails: (data:{username:string|null, email:string|null, bio:string|null})=>Promise<void>;
    updatePersonalDetails:(data:{ phone:string|null, engineeringDomain:string|null, college:string|null, yearOfGraduation:string|null })=>Promise<void>;
    updatePFP:(data:FormData)=>Promise<void>;
    authError:string|null;
    isLoading:boolean;
    setIsLoading:(isLoading:boolean)=>void;
    followOrUnfollowUser:(userId:string)=>Promise<void>;
}>({
    user:null,
    token:null,
    login:async()=>{},
    register:async()=>{},
    logout:async()=>{},
    getGoogleSignedInUser:async()=>{},
    updateAccDetails:async()=>{},
    updatePersonalDetails:async()=>{},
    updatePFP:async()=>{},
    authError:null,
    isLoading:false,
    setIsLoading:(isLoading:boolean)=>{},
    followOrUnfollowUser:async()=>{},

});

const useAuth = () => useContext(AuthContext);

const AuthProvider:React.FC<{children:React.ReactNode}> = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<UserInterface | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [authError, setAuthError] = useState<string|null>('')
    const navigate = useNavigate();
    const location = useLocation();
    const login = async (data:{email:string|null,username:string|null;password:string }) => {
        await requestHandler(
            async () => await loginUser(data),
            setIsLoading,
            (res) => {
                setUser(res.data.user);
                setToken(res.data.accessToken);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                localStorage.setItem("token", res.data.accessToken);
                setAuthError(null);
                const currentUser = res.data.user
                if(!currentUser?.college && !currentUser?.engineeringDomain){
                    return navigate("/editProfile");
                
                }
                const savedLocation = location.state?.from || '/profile';
            navigate(savedLocation);
            },
            (err:any)=>{
                if(err.status == 401){
                    setAuthError("Invalid Credentials");
                }
                else if(err.status == 404){
                    setAuthError("Please make sure you have entered correct username/email")
                }
                else{
                    setAuthError("Something went wrong, please try again later");
                }
            }
        );
    }
    const register = async (data:FormData) => {
        await requestHandler(
            async () => await registerUser(data),
            setIsLoading,
            ()=>{
                navigate("/login");
            },
            (err:any)=>{
                if(err.status == 400){
                    setAuthError("User with this email already exists, please login");
                }
                else{
                    setAuthError("Something went wrong, please try again later");
                }
            }
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
            (err:any)=>{
                if(err.status == 403){
                    refreshAccessToken().then(()=>logout())
                    .catch((err)=>{
                        console.log(err)
                    })
                    
                }
                else{
                    console.log(err)
                }
            }
        );
    }

    const followOrUnfollowUser = async(userId:string)=>{
        await requestHandler(
            async()=>await followOrUnfollow({userId}),
            setIsLoading,
            (res)=>{
                console.log(res);
                setUser(res.data.currentUser);
                localStorage.setItem("user", JSON.stringify(res.data.currentUser));
            },
            (err:any)=>{
                if(err.status == 403){
                    refreshAccessToken().then(()=>followOrUnfollowUser(userId))
                    .catch((err)=>{
                        console.log(err)
                    })
                }
                else{
                    console.log(err)
                }
            }
        )
    }
    const refreshAccessToken = async()=>{
        await requestHandler(
            async()=>await refreshToken(),
            setIsLoading,
            (res)=>{
                setToken(res.data.accessToken);
                localStorage.setItem("token", res.data.accessToken);
            },
            (err:any)=>{
                if(err.status == 401){
                    setUser(null);
                    setToken(null);
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            }
        )
    }
    const checkTokenValidity = async()=>{
        await requestHandler(
            async()=>await checkToken(),
            setIsLoading,
            (res)=>{
                console.log(res);
            },
            (err:any)=>{
                if(err.status == 403){
                    refreshAccessToken()
                }
            }
        )
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
    const updateAccDetails = async(data:{username:string|null, email:string|null, bio:string|null})=>{
        await requestHandler(
            async()=>await updateAccountDetails(data),
            setIsLoading,
            (res)=>{
                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));
            },
            (err:any)=>{
                if(err.status == 403){
                    refreshAccessToken().then(()=>updateAccDetails(data))
                    .catch((err)=>{
                        console.log(err)
                    })
                }
                else{
                    console.log(err)
                }
            }

        )
    }
    const updatePersonalDetails = async(data:{ phone:string|null, engineeringDomain:string|null, college:string|null, yearOfGraduation:string|null })=>{
        await requestHandler(
            async()=>await addPersonalDetails(data),
            setIsLoading,
            (res)=>{
                console.log(res);
                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));
            },
            (err:any)=>{
                if(err.status == 403){
                    refreshAccessToken().then(()=>updatePersonalDetails(data))
                    .catch((err)=>{
                        console.log(err)
                    })
                }
                else{
                    console.log(err)
                }
            }
        )
    }
    const updatePFP = async(data:FormData)=>{
        await requestHandler(
            async()=>await updateProfilePicture(data),
            setIsLoading,
            (res)=>{
                console.log(res);
                setUser(res.data.user);
                localStorage.setItem("user", JSON.stringify(res.data));
            },
            (err:any)=>{
                if(err.status == 403){
                    refreshAccessToken().then(()=>updatePFP(data))
                    .catch((err)=>{
                        console.log(err)
                    })
                }
                else{
                    console.log(err)
                }
            }
        )
    }
   
     // Check for saved user and token in local storage during component initialization
     useEffect(() => {
        const initializeAuth = async () => {
            setIsLoading(true);

            const _token = localStorage.getItem("token");
            const _user: any = localStorage.getItem("user");
            if (_token && _user) {
                setUser(JSON.parse(_user));
                setToken(_token);
            }
            setIsLoading(false);
        };

        initializeAuth();
        checkTokenValidity();
    }, []);
  return (
    <AuthContext.Provider value={{ user, login, register, logout, token, getGoogleSignedInUser,updateAccDetails,updatePersonalDetails,updatePFP, authError,isLoading,setIsLoading,followOrUnfollowUser}}>
      {isLoading ? <Loader /> : children} {/* Display a loader while loading */}
    </AuthContext.Provider>
  );
}

export {AuthContext, AuthProvider, useAuth}
