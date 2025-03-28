
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { ChevronLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <Logo size="lg" className="mx-auto" />
        
        <div className="space-y-2">
          <h1 className="text-5xl font-display font-bold text-white">404</h1>
          <p className="text-xl text-gray-400">This page doesn't exist in our blockchain</p>
        </div>
        
        <div className="pt-4">
          <Button 
            variant="default" 
            className="bg-blocks-primary hover:bg-blocks-primary/90 gap-2"
            onClick={() => window.location.href = '/'}
          >
            <ChevronLeft size={16} />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
