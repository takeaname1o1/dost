import React from "react";
import { useLocation, Link } from "wouter";

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

const Navigation: React.FC = () => {
  const [location] = useLocation();

  const navItems: NavItem[] = [
    { path: "/home", icon: "ri-home-5-line", label: "Home" },
    { path: "/call-history", icon: "ri-history-line", label: "Calls" },
    { path: "/profile", icon: "ri-user-line", label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[hsl(var(--card))] p-2 flex justify-around items-center shadow-lg">
      {navItems.map((item) => {
        const isActive = location === item.path;
        
        return (
          <Link 
            key={item.path} 
            href={item.path}
            className={`flex flex-col items-center p-2 ${
              isActive 
                ? "text-[hsl(var(--primary))]" 
                : "text-[hsl(var(--foreground))]"
            }`}
          >
            <i className={`${item.icon} text-xl`}></i>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
