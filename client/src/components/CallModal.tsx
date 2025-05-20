import React, { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Companion, User } from "@shared/schema";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "audio" | "video";
  companion: Companion | null;
}

const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  type,
  companion,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [timer, setTimer] = useState(0);
  const [coinsRemaining, setCoinsRemaining] = useState(0);
  
  const ratePerMinute = type === "audio" ? 10 : 60;
  const ratePerSecond = ratePerMinute / 60;
  
  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setCoinsRemaining(userData.coins);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }
  }, []);
  
  // Update coins in localStorage and on server
  const updateUserCoins = (newCoins: number) => {
    if (user) {
      // Update local state
      const updatedUser = { ...user, coins: newCoins };
      setUser(updatedUser);
      
      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update on server
      apiRequest("PATCH", `/api/users/${user.id}/coins`, { coins: newCoins })
        .catch(error => console.error("Failed to update coins:", error));
    }
  };
  
  useEffect(() => {
    if (!isOpen || !user) return;
    
    // Initialize the remaining coins
    setCoinsRemaining(user.coins);
    setTimer(0);
    
    // Start the call timer
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
      setCoinsRemaining(prev => {
        const newRemaining = prev - ratePerSecond;
        
        // End call if coins run out
        if (newRemaining <= 0) {
          clearInterval(interval);
          updateUserCoins(0);
          onClose();
          return 0;
        }
        
        return newRemaining;
      });
    }, 1000);
    
    return () => {
      clearInterval(interval);
      // Update user's coins when call ends
      updateUserCoins(Math.floor(coinsRemaining));
    };
  }, [isOpen, user, ratePerSecond, onClose]);
  
  if (!isOpen || !companion) return null;
  
  // Format timer as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSecs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        <img 
          src={companion.imageUrl} 
          alt={companion.name} 
          className="w-full h-full object-cover absolute inset-0" 
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
        
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <div className="bg-black bg-opacity-50 rounded-full px-3 py-1 flex items-center">
            <i className={`${type === "audio" ? "ri-phone-line" : "ri-vidicon-line"} text-[hsl(var(--primary))] mr-1`}></i>
            <span className="text-white">{type === "audio" ? "Audio Call" : "Video Call"}</span>
          </div>
          <div className="bg-black bg-opacity-50 rounded-full px-3 py-1 flex items-center">
            <i className="ri-coin-line text-[hsl(var(--primary))] mr-1"></i>
            <span className="text-white">{Math.floor(coinsRemaining)}</span>
          </div>
        </div>
        
        <div className="absolute bottom-24 left-0 right-0 px-4">
          <div className="text-center">
            <h2 className="text-white text-2xl font-bold mb-1">{companion.name}</h2>
            <p className="text-white text-opacity-80 mb-2">{formatTime(timer)}</p>
            <p className="bg-black bg-opacity-50 rounded-full px-4 py-1 text-white text-sm inline-block">
              {ratePerMinute} coins/minute
            </p>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-black flex justify-evenly">
        <button className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-800 text-white">
          <i className="ri-mic-off-line text-2xl"></i>
        </button>
        <button 
          className="w-14 h-14 rounded-full flex items-center justify-center bg-[hsl(var(--destructive))] text-white"
          onClick={onClose}
        >
          <i className="ri-phone-off-line text-2xl"></i>
        </button>
        <button className="w-14 h-14 rounded-full flex items-center justify-center bg-gray-800 text-white">
          <i className="ri-volume-up-line text-2xl"></i>
        </button>
      </div>
    </div>
  );
};

export default CallModal;
