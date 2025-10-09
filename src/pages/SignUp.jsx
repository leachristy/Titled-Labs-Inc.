import React from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  const handleSignUp = () => {
    console.log("Sign Up clicked");
    navigate("/home"); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--pink-color)]">
      <div className="flex flex-col justify-center items-center w-96 h-auto rounded-lg bg-[var(--purple-color)] p-6">
        <h1 className="p-2 text-2xl font-bold">sign up</h1>

        <h2 className="self-start">email</h2>
        <input
          className="border p-2 rounded w-full mb-4"
          placeholder="Enter your email"
          type="email"
        />

        <h2 className="self-start">password</h2>
        <input
          className="border p-2 rounded w-full mb-4"
          placeholder="Enter your password"
          type="password"
        />

        <button
          onClick={handleSignUp}
          className="w-full bg-[var(--blue-color)] text-white p-2 rounded mb-2 hover:bg-[var(--dark-blue-color)] transition"
        >
          sign up
        </button>
      </div>
    </div>
  );
};
