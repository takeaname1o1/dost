import React from "react";
import { Call, Companion } from "@shared/schema";
import { format } from "date-fns";

interface CallHistoryItemProps {
  call: Call;
  companion: Companion;
  onCallAgain: (call: Call) => void;
}

const CallHistoryItem: React.FC<CallHistoryItemProps> = ({
  call,
  companion,
  onCallAgain,
}) => {
  const { type, startTime, duration, coinsSpent } = call;
  const { name, imageUrl } = companion;
  
  // Format date for display
  const formattedDate = format(new Date(startTime), "MMM d, h:mm a");
  
  // Format duration (seconds) as MM:SS
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[hsl(var(--card))] rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-12 h-12 rounded-full object-cover mr-3" 
          />
          <div>
            <h3 className="text-white font-medium">{name}</h3>
            <p className="text-[hsl(var(--text-secondary))] text-xs">{formattedDate}</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-[hsl(var(--primary))] mr-2">
            <i className={type === "audio" ? "ri-phone-line" : "ri-vidicon-line"}></i>
          </span>
          <span className="text-[hsl(var(--foreground))]">{formatDuration(duration)}</span>
        </div>
      </div>
      <div className="mt-2 flex justify-between text-sm">
        <span className="text-[hsl(var(--text-secondary))]">Coins spent: {coinsSpent}</span>
        <button 
          className="text-[hsl(var(--primary))] flex items-center"
          onClick={() => onCallAgain(call)}
        >
          <i className={`${type === "audio" ? "ri-phone-line" : "ri-vidicon-line"} mr-1`}></i> Call again
        </button>
      </div>
    </div>
  );
};

export default CallHistoryItem;
