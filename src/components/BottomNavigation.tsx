import React from 'react';
import { Home, FileText, User } from 'lucide-react';
import { ViewType } from '../hooks/useWallet';

interface BottomNavigationProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
    },
    {
      id: 'history',
      label: 'Statement',
      icon: FileText,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-green-200 px-4 py-2 max-w-sm mx-auto">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ViewType)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-green-100 text-green-700' 
                  : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${
                isActive ? 'text-green-700' : 'text-gray-500'
              }`} />
              <span className={`text-xs font-medium ${
                isActive ? 'text-green-700' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;