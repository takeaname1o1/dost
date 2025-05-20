import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface UserContextType {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
  updateUserCoins: (newCoins: number) => void;
  addCoins: (amount: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (username: string) => {
    try {
      const response = await apiRequest("POST", "/api/login", { username });
      const userData = await response.json();
      setUser(userData);
      console.log("Logged in as", userData.username);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    setUser(null);
    console.log("Logged out successfully");
  };

  const updateUserCoins = (newCoins: number) => {
    if (user) {
      setUser({ ...user, coins: newCoins });
      // Also update on server
      apiRequest("PATCH", `/api/users/${user.id}/coins`, { coins: newCoins })
        .catch(error => console.error("Failed to update coins:", error));
    }
  };

  const addCoins = (amount: number) => {
    if (user) {
      const newCoins = user.coins + amount;
      setUser({ ...user, coins: newCoins });
      
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

  return (
    <UserContext.Provider value={{ user, login, logout, updateUserCoins, addCoins }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
