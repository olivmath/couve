import React from 'react';
import { Card, CardContent } from './ui/card';
import { Leaf } from 'lucide-react';
import { iconColors, textColors } from '../lib/styles';

interface BalanceCardProps {
  kaleBalance: number;
  kaleToBRL: number;
  kaleToUSD?: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ kaleBalance, kaleToBRL, kaleToUSD = 0.000385 }) => {
  console.log('💳 [BalanceCard] Props recebidas:', { kaleBalance, kaleToBRL, kaleToUSD });
  
  const brlBalance = kaleBalance * kaleToBRL;
  const kaleToBRLPrice = kaleToBRL;
  const usdBalance = kaleBalance * kaleToUSD;
  
  console.log('🧮 [BalanceCard] Valores calculados:', { brlBalance, kaleToBRLPrice, usdBalance });
  
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
        <img 
          src="/stellar-xlm-logo.svg" 
          alt="Stellar Logo" 
          className="h-8 w-8 opacity-80"
        />
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
            <p className={`text-lg font-semibold ${iconColors.lighter}`}>{kaleBalance.toFixed(2)} $KALE</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-xs mb-1">KALE Price</p>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-300">
                U$ {kaleToUSD.toFixed(6)} USD
              </p>
              <p className="text-sm font-medium text-slate-300">
                R$ {kaleToBRLPrice.toFixed(6)} BRL
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;