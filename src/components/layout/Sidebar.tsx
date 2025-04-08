
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Search, 
  Bell, 
  Bookmark, 
  UserCircle, 
  Users, 
  LogOut, 
  PlusCircle 
} from 'lucide-react';
import { useWalletConnection } from '@/hooks/use-wallet-connection';

const Sidebar = () => {
  const { disconnect } = useWalletConnection();
  const navigate = useNavigate();
  
  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Home', path: '/feed' },
    { icon: <Search className="h-5 w-5" />, label: 'Explore', path: '/explore' },
    { icon: <Bell className="h-5 w-5" />, label: 'Notifications', path: '/notifications' },
    { icon: <Bookmark className="h-5 w-5" />, label: 'Bookmarks', path: '/bookmarks' },
    { icon: <Users className="h-5 w-5" />, label: 'Communities', path: '/communities' },
    { icon: <UserCircle className="h-5 w-5" />, label: 'Profile', path: '/profile' },
  ];

  const handleDisconnect = () => {
    disconnect();
    navigate('/', { replace: true });
  };

  return (
    <aside className="w-60 border-r border-white/10 h-full p-4 flex flex-col">
      <div className="mb-4 flex justify-center">
        <img src="/logo.svg" alt="Blocks Logo" className="h-10" />
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-2.5 rounded-full transition-colors ${
                    isActive 
                      ? 'bg-white/10 font-medium' 
                      : 'hover:bg-white/5'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <NavLink to="/feed">
        <Button 
          size="lg" 
          className="mt-4 w-full bg-blocks-accent hover:bg-blocks-accent/90 text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Post
        </Button>
      </NavLink>
      
      <div className="mt-auto pt-4 border-t border-white/10">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleDisconnect}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Disconnect Wallet
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
