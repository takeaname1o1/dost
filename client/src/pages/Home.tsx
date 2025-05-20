import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import CompanionCard from "@/components/CompanionCard";
import CallModal from "@/components/CallModal";
import RechargeModal from "@/components/RechargeModal";
import { useQuery } from "@tanstack/react-query";
import { Companion, User } from "@shared/schema";
import { Button } from "@/components/ui/button";

const filterOptions = ["All", "New", "Online", "Hindi", "Marathi"];

const Home: React.FC = () => {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [callType, setCallType] = useState<"audio" | "video">("audio");
  const [activeFilter, setActiveFilter] = useState("All");
  
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

  // Fetch companions
  const { data: companions = [] } = useQuery<Companion[]>({
    queryKey: ["/api/companions"],
    refetchOnWindowFocus: false,
  });

  // Filter companions based on the active filter
  const filteredCompanions = companions.filter(companion => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Online") return companion.isOnline;
    if (activeFilter === "New") {
      // For demo purposes, assume companions with IDs > 2 are "new"
      return companion.id > 2;
    }
    // Language filters
    return companion.languages.includes(activeFilter);
  });

  const handleAudioCall = (companion: Companion) => {
    setSelectedCompanion(companion);
    setCallType("audio");
    setShowCallModal(true);
  };

  const handleVideoCall = (companion: Companion) => {
    setSelectedCompanion(companion);
    setCallType("video");
    setShowCallModal(true);
  };

  const handleRandomCall = () => {
    // Choose a random online companion
    const onlineCompanions = companions.filter(c => c.isOnline);
    if (onlineCompanions.length > 0) {
      const randomIndex = Math.floor(Math.random() * onlineCompanions.length);
      setSelectedCompanion(onlineCompanions[randomIndex]);
      // Randomly choose call type (audio or video) for demo
      setCallType(Math.random() > 0.5 ? "audio" : "video");
      setShowCallModal(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-16 bg-[hsl(var(--background))]">
      {/* Header */}
      <header className="bg-[hsl(var(--card))] p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-white">Dostt</h1>
        <div className="flex items-center space-x-2 bg-[hsl(var(--background))] rounded-full px-3 py-1">
          <i className="ri-coin-line text-[hsl(var(--primary))]"></i>
          <span className="text-[hsl(var(--foreground))] font-medium">{user?.coins || 0}</span>
          <button 
            className="text-xs bg-[hsl(var(--primary))] text-black px-2 py-0.5 rounded-full ml-1"
            onClick={() => setShowRechargeModal(true)}
          >
            +
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto p-4 bg-[hsl(var(--background))]">
        {/* Filter options */}
        <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
          {filterOptions.map(filter => (
            <button
              key={filter}
              className={`flex-shrink-0 ${
                activeFilter === filter 
                  ? "bg-[hsl(var(--primary))] text-black" 
                  : "bg-[hsl(var(--card))] text-[hsl(var(--foreground))]"
              } px-4 py-2 rounded-full`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        
        {/* Random call button */}
        <div className="mb-6">
          <button 
            className="w-full bg-[hsl(var(--accent))] hover:bg-opacity-90 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center space-x-2"
            onClick={handleRandomCall}
          >
            <i className="ri-shuffle-line"></i>
            <span>Random Call</span>
          </button>
        </div>
        
        {/* Companion list */}
        {companions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[hsl(var(--text-secondary))] mb-4">Loading companions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCompanions.map((companion) => (
              <CompanionCard
                key={companion.id}
                companion={companion}
                onAudioCall={handleAudioCall}
                onVideoCall={handleVideoCall}
              />
            ))}
          </div>
        )}
      </main>
      
      {/* Navigation */}
      <Navigation />
      
      {/* Modals */}
      <RechargeModal 
        isOpen={showRechargeModal} 
        onClose={() => setShowRechargeModal(false)} 
      />
      
      <CallModal 
        isOpen={showCallModal} 
        onClose={() => setShowCallModal(false)} 
        type={callType}
        companion={selectedCompanion}
      />
    </div>
  );
};

export default Home;
