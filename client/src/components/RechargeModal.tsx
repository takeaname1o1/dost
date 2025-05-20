import React, { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { QRCodeSVG } from "qrcode.react";

interface CoinPackage {
  coins: number;
  price: number;
  discount?: number;
}

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethod = "card" | "upi" | "crypto";

interface CryptoOption {
  id: string;
  name: string;
  icon: string;
  symbol: string;
}

const RechargeModal: React.FC<RechargeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [selectedCrypto, setSelectedCrypto] = useState<string>("btc");
  const [cryptoAddress, setCryptoAddress] = useState<string>("");
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [paymentStep, setPaymentStep] = useState<number>(1);
  
  const packages: CoinPackage[] = [
    { coins: 100, price: 100 },
    { coins: 300, price: 250, discount: 17 },
    { coins: 500, price: 400, discount: 20 },
    { coins: 1000, price: 750, discount: 25 },
  ];
  
  const cryptoOptions: CryptoOption[] = [
    { id: "btc", name: "Bitcoin", icon: "ri-bitcoin-fill", symbol: "BTC" },
    { id: "eth", name: "Ethereum", icon: "ri-ethereum-fill", symbol: "ETH" },
    { id: "usdt", name: "USDT", icon: "ri-coin-fill", symbol: "USDT" },
    { id: "bnb", name: "Binance", icon: "ri-coin-fill", symbol: "BNB" },
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
  
  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPaymentStep(1);
      setShowQRCode(false);
      setCryptoAddress("");
    }
  }, [isOpen]);
  
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
        amount: selectedPackage.price,
        coins: amount,
        paymentMethod: paymentMethod,
        ...(paymentMethod === "crypto" && { cryptoCurrency: selectedCrypto }),
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
    if (paymentMethod === "crypto") {
      if (paymentStep === 1) {
        // Generate mock crypto address
        const mockAddresses = {
          btc: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5",
          eth: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          usdt: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
          bnb: "bnb1jxfh2g85q3v0tdq56fnevx6xcxtcnhtsmcu64m"
        };
        setCryptoAddress(mockAddresses[selectedCrypto as keyof typeof mockAddresses]);
        setShowQRCode(true);
        setPaymentStep(2);
      } else {
        // Simulate payment completion
        addCoins(selectedPackage.coins);
        onClose();
      }
    } else {
      // Standard payment
      addCoins(selectedPackage.coins);
      onClose();
    }
  };
  
  const getCryptoEquivalent = () => {
    // Mock exchange rates
    const rates = {
      btc: 0.0000018 * selectedPackage.price,
      eth: 0.000038 * selectedPackage.price,
      usdt: 0.012 * selectedPackage.price,
      bnb: 0.0028 * selectedPackage.price
    };
    
    const selectedRate = rates[selectedCrypto as keyof typeof rates];
    return selectedRate.toFixed(selectedCrypto === "usdt" ? 2 : 6);
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
        
        {paymentStep === 1 && (
          <>
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
            
            <div className="mb-6">
              <p className="text-[hsl(var(--text-secondary))] mb-2">Payment Method</p>
              <div className="grid grid-cols-3 gap-2">
                <div 
                  className={`p-3 border ${paymentMethod === 'card' ? 'border-[hsl(var(--primary))]' : 'border-gray-700'} rounded-lg text-center cursor-pointer`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <i className="ri-bank-card-line text-xl mb-1"></i>
                  <p className="text-sm">Card</p>
                </div>
                <div 
                  className={`p-3 border ${paymentMethod === 'upi' ? 'border-[hsl(var(--primary))]' : 'border-gray-700'} rounded-lg text-center cursor-pointer`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <i className="ri-smartphone-line text-xl mb-1"></i>
                  <p className="text-sm">UPI</p>
                </div>
                <div 
                  className={`p-3 border ${paymentMethod === 'crypto' ? 'border-[hsl(var(--primary))]' : 'border-gray-700'} rounded-lg text-center cursor-pointer`}
                  onClick={() => setPaymentMethod('crypto')}
                >
                  <i className="ri-bit-coin-line text-xl mb-1"></i>
                  <p className="text-sm">Crypto</p>
                </div>
              </div>
            </div>
            
            {paymentMethod === 'crypto' && (
              <div className="mb-6">
                <p className="text-[hsl(var(--text-secondary))] mb-2">Select Cryptocurrency</p>
                <div className="grid grid-cols-2 gap-2">
                  {cryptoOptions.map((crypto) => (
                    <div 
                      key={crypto.id}
                      className={`p-2 border ${selectedCrypto === crypto.id ? 'border-[hsl(var(--primary))]' : 'border-gray-700'} rounded-lg flex items-center cursor-pointer`}
                      onClick={() => setSelectedCrypto(crypto.id)}
                    >
                      <i className={`${crypto.icon} text-xl mr-2`}></i>
                      <div>
                        <p className="text-sm font-medium">{crypto.name}</p>
                        <p className="text-xs text-[hsl(var(--text-secondary))]">{crypto.symbol}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        
        {paymentStep === 2 && (
          <div className="text-center">
            <div className="mb-4">
              <p className="text-lg font-semibold mb-1">Send payment to this address:</p>
              <div className="bg-[hsl(var(--background))] p-3 rounded-lg mb-3 flex items-center justify-between">
                <p className="text-sm break-all mr-2">{cryptoAddress}</p>
                <button 
                  className="text-[hsl(var(--primary))] hover:text-white text-sm px-2 py-1"
                  onClick={() => {
                    navigator.clipboard.writeText(cryptoAddress);
                    alert("Address copied to clipboard!");
                  }}
                >
                  <i className="ri-file-copy-line mr-1"></i>
                  Copy
                </button>
              </div>
              
              <div className="mx-auto w-48 h-48 bg-white p-3 rounded-lg mb-4">
                <QRCodeSVG
                  value={`${selectedCrypto}:${cryptoAddress}?amount=${getCryptoEquivalent()}`}
                  size={168}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"L"}
                  includeMargin={false}
                />
              </div>
              
              <div className="bg-[hsl(var(--background))] p-3 rounded-lg mb-3">
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--text-secondary))]">Amount:</span>
                  <span className="font-medium">{getCryptoEquivalent()} {cryptoOptions.find(c => c.id === selectedCrypto)?.symbol}</span>
                </div>
              </div>
              
              <p className="text-[hsl(var(--text-secondary))] text-sm mb-4">
                Please send exactly the amount shown above. The transaction may take a few minutes to confirm.
              </p>
            </div>
          </div>
        )}
        
        <button 
          className="w-full bg-[hsl(var(--primary))] hover:bg-opacity-90 text-black font-medium py-3 px-4 rounded-lg transition duration-300"
          onClick={handleRecharge}
        >
          {paymentStep === 1 ? "Proceed to Payment" : "I've Completed the Payment"}
        </button>
      </div>
    </div>
  );
};

export default RechargeModal;
