import React, { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";

interface CoinPackage {
  coins: number;
  price: number;
  discount?: number;
}

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RechargeModal: React.FC<RechargeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [user, setUser] = useState<User | null>(null);
  
  const packages: CoinPackage[] = [
    { coins: 100, price: 100 },
    { coins: 300, price: 250, discount: 17 },
    { coins: 500, price: 400, discount: 20 },
    { coins: 1000, price: 750, discount: 25 },
  ];
  
  const [selectedPackage, setSelectedPackage] = useState<CoinPackage>(packages[1]);
  
  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
      }
    }
  }, []);
  
  const addCoins = (amount: number) => {
    if (user) {
      const newCoins = user.coins + amount;
      
      // Update local state
      const updatedUser = { ...user, coins: newCoins };
      setUser(updatedUser);
      
      // Update in localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Record transaction and update on server
      apiRequest("POST", "/api/transactions", {
        userId: user.id,
        amount: amount,
        coins: amount,
      })
        .then(() => {
          return apiRequest("PATCH", `/api/users/${user.id}/coins`, { coins: newCoins });
        })
        .then(() => {
          console.log(`${amount} coins have been added to your account`);
        })
        .catch(error => {
          console.error("Failed to add coins:", error);
        });
    }
  };
  
  const handleRecharge = () => {
    addCoins(selectedPackage.coins);
    onClose();
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
      <div className="bg-[hsl(var(--card))] rounded-xl w-full max-w-md p-6 relative">
        <button 
          className="absolute top-3 right-3 text-[hsl(var(--text-secondary))] hover:text-white"
          onClick={onClose}
        >
          <i className="ri-close-line text-xl"></i>
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-4">Recharge Coins</h2>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {packages.map((pkg) => (
            <div 
              key={pkg.coins}
              className={`border ${selectedPackage.coins === pkg.coins ? 'border-[hsl(var(--primary))]' : 'border-gray-700'} 
                rounded-lg p-3 text-center cursor-pointer hover:border-[hsl(var(--primary))] transition duration-200`}
              onClick={() => setSelectedPackage(pkg)}
            >
              <p className="text-lg font-semibold text-white">{pkg.coins} Coins</p>
              <p className="text-[hsl(var(--primary))]">₹{pkg.price}</p>
              {pkg.discount && (
                <p className="text-[hsl(var(--success))] text-xs">Save {pkg.discount}%</p>
              )}
            </div>
          ))}
        </div>
        
        <div className="bg-[hsl(var(--background))] p-3 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[hsl(var(--text-secondary))]">Selected package:</span>
            <span className="text-white">{selectedPackage.coins} Coins</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[hsl(var(--text-secondary))]">Amount:</span>
            <span className="text-white">₹{selectedPackage.price}</span>
          </div>
        </div>
        
        <button 
          className="w-full bg-[hsl(var(--primary))] hover:bg-opacity-90 text-black font-medium py-3 px-4 rounded-lg transition duration-300"
          onClick={handleRecharge}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default RechargeModal;
