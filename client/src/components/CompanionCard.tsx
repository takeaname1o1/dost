import React from "react";
import { Companion } from "@shared/schema";

interface CompanionCardProps {
  companion: Companion;
  onAudioCall: (companion: Companion) => void;
  onVideoCall: (companion: Companion) => void;
}

const CompanionCard: React.FC<CompanionCardProps> = ({
  companion,
  onAudioCall,
  onVideoCall,
}) => {
  const { name, age, languages, interests, imageUrl, isOnline } = companion;

  return (
    <div className="bg-[hsl(var(--card))] rounded-xl overflow-hidden shadow-lg">
      <img 
        src={imageUrl} 
        alt={name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white text-lg font-semibold">{name}, {age}</h3>
            <p className="text-[hsl(var(--text-secondary))] text-sm">{languages}</p>
          </div>
          <div className={`${isOnline ? 'bg-[hsl(var(--success))]' : 'bg-gray-600'} ${isOnline ? 'text-[hsl(var(--success))]' : 'text-gray-300'} bg-opacity-20 text-xs px-2 py-1 rounded-full`}>
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
        <p className="text-[hsl(var(--text-secondary))] text-sm mt-2">{interests}</p>
        <div className="flex justify-between mt-4">
          <button 
            className={`call-button bg-[hsl(var(--primary))] text-black px-4 py-2 rounded-lg font-medium flex items-center ${!isOnline && 'opacity-50 cursor-not-allowed'}`}
            onClick={() => isOnline && onAudioCall(companion)}
            disabled={!isOnline}
          >
            <i className="ri-phone-line mr-1"></i> 10 coins/min
          </button>
          <button 
            className={`call-button bg-[hsl(var(--primary))] text-black px-4 py-2 rounded-lg font-medium flex items-center ${!isOnline && 'opacity-50 cursor-not-allowed'}`}
            onClick={() => isOnline && onVideoCall(companion)}
            disabled={!isOnline}
          >
            <i className="ri-vidicon-line mr-1"></i> 60 coins/min
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanionCard;
