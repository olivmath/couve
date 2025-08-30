import { Leaf, Sprout } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header = ({ 
  title = "KALE Farmer Wallet", 
  subtitle = "Cultivating the future of payments 🥬" 
}: HeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 shadow-lg p-4">
      <div className="flex items-center justify-center text-white">
        <Leaf className="h-6 w-6 mr-2" />
        <h1 className="text-lg font-bold">{title}</h1>
        <Sprout className="h-6 w-6 ml-2" />
      </div>
      <p className="text-green-100 text-center text-sm mt-1">{subtitle}</p>
    </div>
  );
};