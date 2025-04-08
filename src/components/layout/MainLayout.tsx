
import React from 'react';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileNavBar from './MobileNavBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-blocks-background text-foreground">
      {isMobile ? (
        <div className="flex flex-col h-screen">
          <div className="flex-1 overflow-y-auto pb-16">
            {children}
          </div>
          <MobileNavBar />
        </div>
      ) : (
        <div className="flex h-screen">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">{children}</main>
          <RightPanel />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
