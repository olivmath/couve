import React from 'react';
import { useUser } from '@stackframe/stack';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { User, Settings, Shield, HelpCircle, LogOut, Leaf, Star } from 'lucide-react';
import { useWalletStore } from '../../stores/useWalletStore';

const ProfileView: React.FC = () => {
  const user = useUser();
  const { balance, kaleToBRL, navigateToView } = useWalletStore();
  const brlBalance = balance * kaleToBRL;

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
          <p className="text-green-100 text-sm mb-4">{user?.primaryEmail || 'Stellar Network Member'}</p>
          

        </CardContent>
      </Card>



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