import React from 'react';
import BalanceCard from '../BalanceCard';
import QuickActions from '../QuickActions';
import MeridianEventsCarousel from '../MeridianEventsCarousel';

interface HomeViewProps {
  balance: number;
  kaleToBRL: number;
  transactions: any[];
  onSend: () => void;
  onReceive: () => void;
  onFarm: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({
  balance,
  kaleToBRL,
  transactions,
  onSend,
  onReceive,
  onFarm
}) => {
  return (
    <div className="space-y-6 pb-20">
      <BalanceCard balance={balance} kaleToBRL={kaleToBRL} />
      <QuickActions 
        onSend={onSend}
        onReceive={onReceive}
        onFarm={onFarm}
      />
      <MeridianEventsCarousel />
    </div>
  );
};

export default HomeView;