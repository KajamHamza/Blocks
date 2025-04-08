
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Users, Bell, UserCircle, PlusCircle } from 'lucide-react';

const MobileNavBar = () => {
  const navItems = [
    { icon: <Home className="h-5 w-5" />, path: '/feed' },
    { icon: <Search className="h-5 w-5" />, path: '/explore' },
    { icon: <Users className="h-5 w-5" />, path: '/communities' },
    { icon: <Bell className="h-5 w-5" />, path: '/notifications' },
    { icon: <UserCircle className="h-5 w-5" />, path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 w-full border-t border-white/10 bg-blocks-background">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <NavLink 
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center justify-center ${isActive ? 'text-blocks-accent' : 'text-foreground/60'}`
            }
          >
            {item.icon}
          </NavLink>
        ))}
      </div>
      <button 
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 h-12 w-12 rounded-full bg-blocks-accent flex items-center justify-center shadow-lg"
      >
        <PlusCircle className="h-6 w-6 text-white" />
      </button>
    </nav>
  );
};

export default MobileNavBar;
