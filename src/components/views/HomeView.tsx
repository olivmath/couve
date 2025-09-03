import React, { useEffect } from "react";
import BalanceCard from "../BalanceCard";
import QuickActions from "../QuickActions";
import MeridianEventsCarousel from "../MeridianEventsCarousel";
import { useWalletStore } from "@/stores/useWalletStore";
import { useStellarAccount } from "../../lib/useStellarAccount";

const HomeView: React.FC = () => {
  const { kaleToBRL, kaleToUSD, setStellarBalance, setStellarAccount, updateKalePrice } = useWalletStore();
  const { stellarAccount, balance, refreshBalance } = useStellarAccount();
  
  // Por enquanto, assumir que o balance já representa KALE
  const kaleBalance = balance;

  // Sincronizar o saldo Stellar com o wallet store
  useEffect(() => {
    if (stellarAccount) {
      setStellarAccount(stellarAccount);
      setStellarBalance(balance);
    }
  }, [stellarAccount, balance, setStellarAccount, setStellarBalance]);

  // Atualizar saldo e preço periodicamente
  useEffect(() => {
    if (stellarAccount) {
      const interval = setInterval(() => {
        refreshBalance();
        updateKalePrice();
      }, 30000); // Atualizar a cada 30 segundos

      return () => clearInterval(interval);
    }
  }, [stellarAccount, refreshBalance, updateKalePrice]);

  // Atualizar preço do KALE na inicialização
  useEffect(() => {
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
