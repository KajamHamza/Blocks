
import React from 'react';
import MainLayout from '@/components/main-layout';
import { useWallet } from '@/hooks/useWallet';
import { Button } from '@/components/ui/button';
import { LogOut, UserCog, Key, Wallet, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { walletInfo, disconnect } = useWallet();
  const navigate = useNavigate();

  const handleDisconnect = () => {
    disconnect();
    // Redirect to landing page
    navigate('/');
  };

  return (
    <MainLayout>
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>
        
        <div className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5 text-blocks-primary" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Manage your account details and profile settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="text-sm font-medium text-gray-400">Connected Address</div>
                <div className="font-mono bg-gray-900/50 p-2 rounded border border-gray-700/50">
                  {walletInfo?.address || 'Not connected'}
                </div>
              </div>
              <div className="grid gap-2">
                <div className="text-sm font-medium text-gray-400">Network</div>
                <div className="font-medium">
                  {walletInfo?.chain || 'Not connected'}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-blocks-primary" />
                <span>Wallet Connection</span>
              </CardTitle>
              <CardDescription>
                Manage your wallet connection settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                onClick={handleDisconnect}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Disconnect Wallet
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blocks-primary" />
                <span>Security</span>
              </CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">
                Blockchain accounts are secured by your wallet provider. For enhanced security,
                we recommend using hardware wallets and enabling all security features in your wallet.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
