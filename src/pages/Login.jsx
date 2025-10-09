import React from 'react';
import { useNavigate } from 'react-router-dom';


export const Login = () => {
    const navigate = useNavigate();
    const handleSignIn = () => {
        console.log("Sign in clicked");
        navigate("/");
      };
      
  return (
    <div className='flex items-center justify-center min-h-screen bg-[var(--pink-color)]'>
        <div className='flex flex-col justify-center items-center w-96 h-auto rounded-lg bg-[var(--purple-color)] p-6'>
            <h1 className='p-2 text-2xl font-bold'>
                Login
            </h1>

            <h2 className='self-start'>
                username
            </h2>
            <input className='border p-2 rounded w-full mb-4' placeholder='type your username'/>

            <h2 className='self-start'>
                password
            </h2>
            <input className='border p-2 rounded w-full mb-4' placeholder='type your password'/>

            <button 
            onClick={handleSignIn}
            className='w-full bg-[var(--blue-color)] text-white p-2 rounded mb-2 hover:bg-[var(--dark-blue-color)] transition'>
                sign in
            </button>

            <button className="w-full bg-[var(--blue-color)] text-white p-2 rounded hover:bg-[var(--dark-blue-color)] transition">
            sign in with Google
            </button>
        </div>
    </div>
  );
};


