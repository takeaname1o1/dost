import React, { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.trim()) {
      try {
        // Directly call API without going through context
        const response = await apiRequest("POST", "/api/login", { username });
        const userData = await response.json();
        
        // Store user in localStorage (simple solution)
        localStorage.setItem("user", JSON.stringify(userData));
        
        // Redirect to home
        setLocation("/home");
      } catch (error) {
        console.error("Login failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[hsl(var(--background))]">
      <div className="w-full max-w-md bg-[hsl(var(--card))] rounded-xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dostt</h1>
          <p className="text-[hsl(var(--text-secondary))]">Welcome back!</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-[hsl(var(--foreground))] mb-2">
              Username
            </label>
            <Input
              type="text"
              id="username"
              className="w-full px-4 py-3 bg-[hsl(var(--background))] border border-gray-700 rounded-lg text-[hsl(var(--foreground))] focus:outline-none focus:border-[hsl(var(--primary))]"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-[hsl(var(--primary))] hover:bg-opacity-90 text-black font-medium py-3 px-4 rounded-lg transition duration-300"
          >
            Login
          </Button>
          
          <div className="mt-4 text-center">
            <a href="#" className="text-[hsl(var(--primary))] hover:underline">
              Need help?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
