import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './ui/logo';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Search, 
  Bell, 
  Bookmark, 
  Users, 
  User, 
  Settings, 
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWallet } from '@/hooks/useWallet';
import { useProfile } from '@/hooks/useProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { shortenAddress } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { walletInfo, disconnect } = useWallet();
  const { currentProfile } = useProfile();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/explore' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Bookmark, label: 'Bookmarks', path: '/bookmarks' },
    { icon: Users, label: 'Communities', path: '/communities' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handlePostClick = () => {
    // Show toast if post button is clicked
    toast({
      title: "Create Post",
      description: "Post creation will be available in the feed page",
    });
    navigate('/');
  };

  const handleLogout = () => {
    disconnect();
    navigate('/');
  };

  return (
    <div className={cn(
      "h-full relative transition-all duration-300 ease-in-out", 
      collapsed ? "w-20" : "w-full max-w-xs",
      className
    )}>
      <div className="absolute top-1/2 -right-3 z-10">
        <Button 
          onClick={toggleSidebar} 
          size="sm" 
          variant="outline" 
          className="h-6 w-6 rounded-full p-0 bg-gray-800/90 border border-gray-700 text-gray-400"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </Button>
      </div>
      
      <div className={cn(
        "h-full w-full border-r border-gray-800/40 backdrop-blur-md bg-black/30 flex flex-col p-4 relative before:absolute before:inset-0 before:bg-noise-pattern before:opacity-5 before:z-0",
        collapsed ? "items-center" : ""
      )}>
        <div className={cn("px-4 py-3", collapsed ? "flex justify-center" : "")}>
          <Link to="/" className={cn("flex items-center gap-2", collapsed ? "justify-center" : "")}>
            <Logo size="md" />
            {!collapsed && <span className="text-xl font-display font-bold text-white">Blocks</span>}
          </Link>
        </div>
        
        <nav className="flex-1 mt-6 relative z-10">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
                      collapsed ? "justify-center px-2" : "",
                      active 
                        ? "bg-gray-800/80 text-blocks-primary" 
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon size={20} />
                    {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className={cn("mt-auto relative z-10", collapsed ? "w-full px-0" : "px-4 py-2")}>
          <Button 
            className={cn(
              "bg-blocks-primary hover:bg-blocks-primary/90 text-white rounded-lg py-2.5",
              collapsed ? "w-12 h-12 p-0 rounded-full mx-auto" : "w-full"
            )}
            onClick={handlePostClick}
          >
            <PlusCircle className={cn(collapsed ? "h-5 w-5" : "mr-2 h-5 w-5")} />
            {!collapsed && <span>Post</span>}
          </Button>
        </div>
        
        {walletInfo && (
          <div className={cn("mt-4 px-4 py-3 relative z-10", collapsed ? "w-full" : "")}>
            <div className={cn(
              "flex items-center gap-3 hover:bg-gray-800/50 px-2 py-2 rounded-lg transition-colors",
              collapsed ? "justify-center" : ""
            )}>
              <div className="flex-shrink-0">
                <Link to="/profile">
                  <Avatar className="h-9 w-9 border border-gray-700/50">
                    {currentProfile?.profilePicture ? (
                      <AvatarImage src={currentProfile.profilePicture} alt={currentProfile.username} />
                    ) : (
                      <AvatarFallback className="bg-gray-700 text-white">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Link>
              </div>
              
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <Link to="/profile">
                      <p className="text-sm font-medium text-white truncate flex items-center gap-1">
                        <span>@{currentProfile?.username?.toLowerCase() || shortenAddress(walletInfo.address)}</span>
                        <span className="inline-flex items-center ml-1 px-1.5 py-0.5 rounded-full text-xs bg-purple-800/50 text-purple-300 border border-purple-700/50">
                          <Shield className="h-3 w-3 mr-0.5" />
                          0.01
                        </span>
                      </p>
                      
                    </Link>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-white p-1 h-auto w-auto"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            {collapsed && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-gray-400 hover:text-white p-1 h-auto w-auto mt-2 mx-auto flex"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
