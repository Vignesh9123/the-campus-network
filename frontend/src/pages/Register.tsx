"use client";
import React,{useEffect, useState} from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FcGoogle } from "react-icons/fc";
import NavBar from "@/components/sections/NavBar";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import { checkUsernameUnique } from "@/api";

export default function RegisterForm() {
    const { register, authError } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState<File | null | undefined>(null);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isUnique, setIsUnique] = useState(true);
    const [error, setError] = useState('')

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    const checkUsername = async () => {
      if (username.length>0&&username.length < 6) {
        setIsUnique(false);
        setError('Username must be at least 6 characters long');
      } else {
        const usernameRegex = /^[a-zA-Z_][a-zA-Z0-9_@]*$/;
        if(username.length>0&&!usernameRegex.test(username)){
          setError('Username can only contain alphanumeric characters, underscores and @, and should start with an alphabet');
        }
        else{
        try {
          const response = await checkUsernameUnique(username);
          const data = response.data.data
          setIsUnique(data.isUnique);
          setError('');
        } catch (error) {
          setIsUnique(false);
          setError('')
        }
      }
      }
    };
    
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const formData = new FormData()
    formData.append('username', username)
    formData.append('email', email)
    formData.append('password', password)
    if(profilePicture){
      formData.append('profilePicture', profilePicture)
    }
    if(username && email && password && isUnique){
        register(formData);
    }

    
  };
  useEffect(() => {
    
      checkUsername();
    
  
    // Cleanup the timeout if username changes within debounce delay
  }, [username]);
  useEffect(()=>{
    document.title = 'The Campus Network - Register'
  },[])
  return (
    <>
    <NavBar className='mb-5'/>
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to The Campus Network
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Have an account already? <Link to='/login' className="underline">Login Here</Link>
      </p>
      <form
            action={`${import.meta.env.VITE_SERVER_URI}/users/login/google`}
            method="get"
            >
            <button className="mt-5 relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]">
              <FcGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                Sign up with Google
              </span>
              <BottomGradient />
            </button>
          </form>
      <form className="my-8" onSubmit={handleSubmit}>
      {authError && <div className="text-red-500 text-sm m-2">{authError}</div>}

        <LabelInputContainer className="mb-4">
          <Label htmlFor="username">Username <p className="inline text-red-500 text-sm">*</p></Label>
          <Input value={username} onChange={(e)=>{
            setUsername(e.target.value);
          }} id="username" placeholder="Unique_Username" required={true} type="text" />
          {(!isUnique || !!error)? <p className="text-red-500 text-sm">{error || "Username already taken"}</p>:
          <p className="text-green-500 text-sm">{username.length>0?"Username is available":""}</p>}
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address <p className="inline text-red-500 text-sm">*</p></Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} id="email" placeholder="projectmayhem@fc.com" required={true} type="email" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="profilePicture">Profile Picture</Label>
          <Input id="profilePicture" onChange={(e) => setProfilePicture(e.target.files?.[0])} type="file"/>
        </LabelInputContainer>
       
        <LabelInputContainer className="mb-4 relative">
          <Label htmlFor="password">Password <p className="inline text-red-500 text-sm">*</p></Label>
          <Input value={password} required={true} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="••••••••" type={showPassword ? "text" : "password"} />
          <button type="button" onClick={togglePasswordVisibility} className="absolute right-3 top-7 text-white">
            {showPassword ? <FaEyeSlash className="text-black dark:text-white top-2"/> : <FaEye className="text-black dark:text-white top-2"/>}
          </button>
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="confirmPassword">Confirm Password <p className="inline text-red-500 text-sm">*</p></Label>
          <Input  required={true} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} id="confirmPassword" placeholder="••••••••" type="password" />
        </LabelInputContainer>

        <button
          className={`bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] ${(isUnique && !error)?"":"opacity-75 cursor-not-allowed"}`}
          disabled={(!isUnique || !!error)}
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
        </div>
      </form>
         
    </div>
              </>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
