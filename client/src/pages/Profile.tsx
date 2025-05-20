import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import RechargeModal from "@/components/RechargeModal";
import { User } from "@shared/schema";

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [, setLocation] = useLocation();
  const [showRechargeModal, setShowRechargeModal] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
        setLocation("/");
      }
    } else {
      setLocation("/");
    }
  }, [setLocation]);

  const handleLogout = () => {
    // Clear user from localStorage
    localStorage.removeItem("user");
    setUser(null);
    setLocation("/");
  };

  const navigateToHelpSupport = () => {
    setLocation("/help-support");
  };

  if (!user) {
    return null;
  }

  const userInitial = user.username.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col pb-16 bg-[hsl(var(--background))]">
      <header className="bg-[hsl(var(--card))] p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
      </header>
      
      <main className="flex-1 overflow-auto p-4 bg-[hsl(var(--background))]">
        <div className="bg-[hsl(var(--card))] rounded-xl p-5 mb-5">
          <div className="flex items-center">
            <div className="bg-[hsl(var(--primary))] rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold text-black">
              {userInitial}
            </div>
            <div className="ml-4">
              <h2 className="text-white text-xl font-semibold">{user.username}</h2>
              <p className="text-[hsl(var(--text-secondary))]">ID: {user.id}</p>
            </div>
          </div>
          
          <div className="mt-5 p-3 bg-[hsl(var(--background))] rounded-lg flex justify-between items-center">
            <div>
              <p className="text-[hsl(var(--text-secondary))] text-sm">Coin Balance</p>
              <p className="text-white text-xl font-semibold flex items-center">
                <i className="ri-coin-line text-[hsl(var(--primary))] mr-1"></i>
                <span>{user.coins}</span>
              </p>
            </div>
            <button 
              className="bg-[hsl(var(--primary))] text-black px-4 py-2 rounded-lg font-medium"
              onClick={() => setShowRechargeModal(true)}
            >
              Recharge
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <a href="#" className="block bg-[hsl(var(--card))] p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <i className="ri-exchange-dollar-line text-[hsl(var(--primary))] text-xl mr-3"></i>
              <span className="text-[hsl(var(--foreground))]">Transactions</span>
            </div>
            <i className="ri-arrow-right-s-line text-[hsl(var(--text-secondary))]"></i>
          </a>
          
          <button 
            className="w-full block bg-[hsl(var(--card))] p-4 rounded-lg flex items-center justify-between"
            onClick={navigateToHelpSupport}
          >
            <div className="flex items-center">
              <i className="ri-question-line text-[hsl(var(--primary))] text-xl mr-3"></i>
              <span className="text-[hsl(var(--foreground))]">Help & Support</span>
            </div>
            <i className="ri-arrow-right-s-line text-[hsl(var(--text-secondary))]"></i>
          </button>
          
          <a href="#" className="block bg-[hsl(var(--card))] p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <i className="ri-shield-check-line text-[hsl(var(--primary))] text-xl mr-3"></i>
              <span className="text-[hsl(var(--foreground))]">Privacy Policy</span>
            </div>
            <i className="ri-arrow-right-s-line text-[hsl(var(--text-secondary))]"></i>
          </a>
          
          <a href="#" className="block bg-[hsl(var(--card))] p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <i className="ri-file-list-3-line text-[hsl(var(--primary))] text-xl mr-3"></i>
              <span className="text-[hsl(var(--foreground))]">Terms of Service</span>
            </div>
            <i className="ri-arrow-right-s-line text-[hsl(var(--text-secondary))]"></i>
          </a>
          
          <button 
            className="w-full bg-[hsl(var(--destructive))] bg-opacity-20 text-[hsl(var(--destructive))] p-4 rounded-lg flex items-center justify-center mt-6"
            onClick={handleLogout}
          >
            <i className="ri-logout-box-line mr-2"></i>
            <span>Logout</span>
          </button>
        </div>
        
        <p className="text-center text-[hsl(var(--text-secondary))] text-xs mt-8">
          App Version 1.0.0
        </p>
      </main>
      
      <Navigation />
      
      <RechargeModal 
        isOpen={showRechargeModal} 
        onClose={() => setShowRechargeModal(false)} 
      />
    </div>
  );
};

export default Profile;
