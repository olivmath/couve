import React, { useEffect } from "react";
import BalanceCard from "../BalanceCard";
import QuickActions from "../QuickActions";
import MeridianEventsCarousel from "../MeridianEventsCarousel";
import { useWalletStore } from "@/stores/useWalletStore";
import { useStellarAccount } from "../../lib/useStellarAccount";

const HomeView: React.FC = () => {
  const { kaleToBRL, kaleToUSD, setStellarBalance, setStellarAccount, updateKalePrice } = useWalletStore();
  const { stellarAccount, balance, refreshBalance } = useStellarAccount();
  
  // For now, assume that balance already represents KALE
  const kaleBalance = balance;

  // Synchronize Stellar balance with wallet store
  useEffect(() => {
    if (stellarAccount) {
      setStellarAccount(stellarAccount);
      setStellarBalance(balance);
    }
  }, [stellarAccount, balance, setStellarAccount, setStellarBalance]);

  // Update balance and price periodically
  useEffect(() => {
    if (stellarAccount) {
      console.log('⏰ [HomeView] Setting up interval for periodic updates...');
      const interval = setInterval(() => {
        console.log('🔄 [HomeView] Running periodic update...');
        refreshBalance();
        updateKalePrice();
      }, 30000); // Update every 30 seconds

      return () => {
        console.log('🛑 [HomeView] Clearing update interval');
        clearInterval(interval);
      };
    }
  }, [stellarAccount, refreshBalance, updateKalePrice]);

  // Update KALE price on initialization
  useEffect(() => {
    console.log('🚀 [HomeView] Updating KALE price on initialization...');
    updateKalePrice();
  }, [updateKalePrice]);

  return (
    <div className="space-y-6 pb-20">
      <BalanceCard kaleBalance={kaleBalance} kaleToBRL={kaleToBRL} kaleToUSD={kaleToUSD} />
      <QuickActions />
      <MeridianEventsCarousel />
    </div>
  );
};

export default HomeView;
