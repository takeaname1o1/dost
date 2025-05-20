import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import CallHistoryItem from "@/components/CallHistoryItem";
import CallModal from "@/components/CallModal";
import { useQuery } from "@tanstack/react-query";
import { Call, Companion, User } from "@shared/schema";

const CallHistory: React.FC = () => {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);

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

  // Fetch call history
  const { data: calls = [] } = useQuery<Call[]>({
    queryKey: ["/api/calls", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const response = await fetch(`/api/calls?userId=${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch calls');
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch companions
  const { data: companions = [] } = useQuery<Companion[]>({
    queryKey: ["/api/companions"],
  });

  const handleCallAgain = (call: Call) => {
    setSelectedCall(call);
    const companion = companions.find(c => c.id === call.companionId) || null;
    setSelectedCompanion(companion);
    setShowCallModal(true);
  };

  // Sort calls by date (newest first)
  const sortedCalls = [...calls].sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  return (
    <div className="min-h-screen flex flex-col pb-16 bg-[hsl(var(--background))]">
      <header className="bg-[hsl(var(--card))] p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-white">Call History</h1>
      </header>
      
      <main className="flex-1 overflow-auto p-4 bg-[hsl(var(--background))]">
        {sortedCalls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[hsl(var(--text-secondary))]">No calls yet</p>
            <p className="text-[hsl(var(--text-secondary))] text-sm mt-2">
              Your call history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedCalls.map((call) => {
              const companion = companions.find(c => c.id === call.companionId);
              if (!companion) return null;
              
              return (
                <CallHistoryItem
                  key={call.id}
                  call={call}
                  companion={companion}
                  onCallAgain={handleCallAgain}
                />
              );
            })}
          </div>
        )}
      </main>
      
      <Navigation />
      
      {selectedCall && selectedCompanion && (
        <CallModal 
          isOpen={showCallModal} 
          onClose={() => setShowCallModal(false)} 
          type={selectedCall.type as "audio" | "video"}
          companion={selectedCompanion}
        />
      )}
    </div>
  );
};

export default CallHistory;
