import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { User, Settings, Shield, HelpCircle, LogOut, Leaf, Star } from 'lucide-react';
import { useWalletStore } from '../../stores/useWalletStore';

const ProfileView: React.FC = () => {
  const { balance, kaleToBRL } = useWalletStore();
  const brlBalance = balance * kaleToBRL;
  
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
            <User className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-1">KALE Farmer</h2>
          <p className="text-green-100 text-sm mb-4">Stellar Network Member</p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-green-100 text-sm">Total Balance</span>
              <Leaf className="h-4 w-4 text-green-200" />
            </div>
            <p className="text-2xl font-bold">R$ {brlBalance.toFixed(2)}</p>
            <p className="text-green-200 text-sm">{balance.toFixed(2)} $KALE</p>
          </div>
        </CardContent>
      </Card>

      {/* Farmer Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-2 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">127</div>
            <div className="text-xs text-gray-600">Days Farming</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">42</div>
            <div className="text-xs text-gray-600">Harvests</div>
          </CardContent>
        </Card>
        <Card className="border-2 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">8.9k</div>
            <div className="text-xs text-gray-600">KALE Earned</div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items */}
      <div className="space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="border-2 border-green-200 hover:bg-green-50 transition-colors cursor-pointer">
              <CardContent className="p-4" onClick={item.action}>
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

      {/* Meridian 2025 Banner */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">🌟 Meridian 2025</h3>
          <p className="text-sm text-purple-100 mb-3">
            Join us in Rio de Janeiro for the biggest Stellar event of the year!
          </p>
          <Button 
            className="bg-white text-purple-600 hover:bg-purple-50 text-sm"
            onClick={() => window.open('https://meridian.stellar.org', '_blank')}
          >
            Learn More
          </Button>
        </CardContent>
      </Card>

      {/* Logout */}
      <Button 
        variant="outline" 
        className="w-full border-2 border-red-200 text-red-600 hover:bg-red-50"
        onClick={() => console.log('Logout clicked')}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};

export default ProfileView;