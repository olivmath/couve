import React, { useState } from 'react';
import { useUser } from '@stackframe/stack';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { User, Settings, Shield, HelpCircle, LogOut, Leaf, Star, Eye, EyeOff, Copy } from 'lucide-react';
import { useWalletStore } from '../../stores/useWalletStore';
import { useStellarAccount } from '../../lib/useStellarAccount';
import AddressDisplay from '../AddressDisplay';
import copy from 'copy-to-clipboard';

const ProfileView: React.FC = () => {
  const user = useUser();
  const { kaleToBRL, navigateToView } = useWalletStore();
  const { stellarAccount, balance } = useStellarAccount();
  const brlBalance = balance * kaleToBRL;
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedPrivateKey, setCopiedPrivateKey] = useState(false);

  const handleLogout = async () => {
    if (user) {
      await user.signOut();
      navigateToView('signin');
    }
  };
  
  const menuItems = [
    {
      icon: Settings,
      label: 'Settings',
      description: 'Manage your preferences',
      action: () => console.log('Settings clicked')
    },
    {
      icon: Shield,
      label: 'Security',
      description: 'Privacy and security settings',
      action: () => console.log('Security clicked')
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Get help and contact support',
      action: () => console.log('Help clicked')
    },
    {
      icon: Star,
      label: 'Rate App',
      description: 'Share your feedback',
      action: () => console.log('Rate clicked')
    }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Header */}
      <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-0">
        <CardContent className="p-6 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            {user?.profileImageUrl ? (
              <img 
                src={user.profileImageUrl} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-white" />
            )}
          </div>
          <h2 className="text-xl font-bold mb-1">{user?.displayName || 'Couve Farmer'}</h2>
          <p className="text-green-100 text-sm mb-2">{user?.primaryEmail || 'Stellar Network Member'}</p>
          
          {/* Stellar Account Address */}
          {stellarAccount && (
            <div className="bg-white/10 rounded-lg p-3 mt-4 space-y-3">
              <div>
                <p className="text-green-100 text-xs mb-2">Endereço Público:</p>
                <AddressDisplay 
                  address={stellarAccount.publicKey}
                  className="text-white"
                  showIcons={true}
                />
              </div>
              
              {/* Private Key Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-green-100 text-xs">Chave Privada:</p>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="p-1 rounded-md hover:bg-white/20 transition-colors"
                      title={showPrivateKey ? 'Ocultar chave privada' : 'Mostrar chave privada'}
                    >
                      {showPrivateKey ? (
                        <EyeOff className="h-4 w-4 text-white" />
                      ) : (
                        <Eye className="h-4 w-4 text-white" />
                      )}
                    </button>
                    {showPrivateKey && (
                      <button
                        onClick={() => {
                          copy(stellarAccount.secretKey);
                          setCopiedPrivateKey(true);
                          setTimeout(() => setCopiedPrivateKey(false), 2000);
                        }}
                        className="p-1 rounded-md hover:bg-white/20 transition-colors"
                        title="Copiar chave privada"
                      >
                        <Copy className="h-4 w-4 text-white" />
                      </button>
                    )}
                  </div>
                </div>
                
                {showPrivateKey ? (
                  <div className="bg-red-500/20 border border-red-400/30 rounded-md p-2">
                    <p className="text-red-200 text-xs mb-1 font-semibold">⚠️ ATENÇÃO: Mantenha sua chave privada segura!</p>
                    <p className="font-mono text-xs text-white break-all">
                      {stellarAccount.secretKey}
                    </p>
                    {copiedPrivateKey && (
                      <p className="text-green-200 text-xs mt-1">✓ Copiado!</p>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/5 rounded-md p-2">
                    <p className="font-mono text-xs text-white">••••••••••••••••••••••••••••••••••••••••••••••••••••••••</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </CardContent>
      </Card>



      {/* Menu Items */}
      <div className="space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="border-2 border-green-200 hover:bg-green-50 transition-colors cursor-pointer">
              <CardContent className="p-3" onClick={item.action}>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Icon className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.label}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>





      {/* Logout */}
      <Card className="border-2 border-red-200 hover:bg-red-50 transition-colors cursor-pointer">
        <CardContent className="p-3" onClick={handleLogout}>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <LogOut className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-red-600">Sign Out</h3>
              <p className="text-sm text-red-500">Logout from your account</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;