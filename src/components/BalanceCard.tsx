import React from 'react';
import { Card, CardContent } from './ui/card';
import { CreditCard, Leaf } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
  kaleToBRL: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, kaleToBRL }) => {
  const brlBalance = balance * kaleToBRL;
  
  return (
    <Card className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white relative overflow-hidden border-0 aspect-[1.6/1]">
      {/* Credit card chip */}
      <div className="absolute top-4 left-6">
        <div className="w-24 h-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-sm relative flex items-center justify-center">
          <img 
            src="/meridian-stellar-logo.svg" 
            alt="Meridian Logo" 
            className="w-20 h-4 object-contain z-10"
          />
        </div>
      </div>
      {/* Card brand logo */}
      <div className="absolute top-4 right-6">
        <Leaf className="h-8 w-8 text-green-400" />
      </div>
      
      <CardContent className="p-6 h-full flex flex-col justify-between">
        {/* Main balance */}
        <div className="mt-8">
          <p className="text-slate-300 text-sm mb-1">Available Balance</p>
          <p className="text-3xl font-bold tracking-wide">R$ {brlBalance.toFixed(2)} 🇧🇷</p>
        </div>
        
        {/* Bottom section */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-slate-400 text-xs mb-1">KALE Balance</p>
            <p className="text-lg font-semibold text-green-400">{balance.toFixed(2)} $KALE</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;