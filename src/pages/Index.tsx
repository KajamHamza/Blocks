
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blocks-background">
      <div className="animate-pulse-slow">
        <h1 className="text-4xl font-bold text-gradient">Blocks</h1>
        <p className="text-muted-foreground text-center mt-2">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
