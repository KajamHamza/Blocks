
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WalletConnectionProvider, useWalletConnection } from "@/hooks/use-wallet-connection";
import Landing from "@/pages/Landing";
import Feed from "@/pages/Feed";
import Profile from "@/pages/Profile";
import Communities from "@/pages/Communities";
import Explore from "@/pages/Explore";
import Notifications from "@/pages/Notifications";
import Bookmarks from "@/pages/Bookmarks";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Auth protection wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isConnected } = useWalletConnection();
  
  // Force immediate redirect if not authenticated
  if (!isConnected || !isAuthenticated) {
    console.log('User not authenticated, redirecting to landing page');
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useWalletConnection();
  
  return (
    <Routes>
      <Route path="/" element={
        // If user is authenticated, redirect to feed
        isAuthenticated ? <Navigate to="/feed" replace /> : <Landing />
      } />
      <Route path="/feed" element={
        <ProtectedRoute>
          <Feed />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/profile/:username" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/communities" element={
        <ProtectedRoute>
          <Communities />
        </ProtectedRoute>
      } />
      <Route path="/explore" element={
        <ProtectedRoute>
          <Explore />
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      } />
      <Route path="/bookmarks" element={
        <ProtectedRoute>
          <Bookmarks />
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WalletConnectionProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </WalletConnectionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
