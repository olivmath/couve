import React from "react";
import BalanceCard from "../BalanceCard";
import QuickActions from "../QuickActions";
import MeridianEventsCarousel from "../MeridianEventsCarousel";
import { useWalletStore } from "@/stores/useWalletStore";

const HomeView: React.FC = () => {
  const { balance, kaleToBRL} = useWalletStore();
  return (
    <div className="space-y-6 pb-20">
      <BalanceCard balance={balance} kaleToBRL={kaleToBRL} />
      <QuickActions />
      <MeridianEventsCarousel />
    </div>
  );
};

export default HomeView;
