import React from 'react';
import HomeView from './components/views/HomeView';
import { SendView } from './components/views/SendView';
import { DepositView } from './components/views/DepositView';
import { HistoryView } from './components/views/HistoryView';
import { SuccessView } from './components/views/SuccessView';
import ProfileView from './components/views/ProfileView';
import BottomNavigation from './components/BottomNavigation';
import { useWallet } from './hooks/useWallet';

function App() {
  const {
    balance,
    pixAmount,
    pixKey,
    currentView,
    isProcessing,
    qrCodeData,
    kaleToBRL,
    transactions,
    setPixAmount,
    setPixKey,
    handleSendPIX,
    setCurrentView
  } = useWallet();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            balance={balance}
            kaleToBRL={kaleToBRL}
            transactions={transactions}
            onSend={() => setCurrentView('send')}
            onReceive={() => setCurrentView('deposit')}
            onFarm={() => window.open('https://kalefarm.xyz', '_blank')}
          />
        );
      case 'send':
        return (
          <SendView
            balance={balance}
            kaleToBRL={kaleToBRL}
            pixAmount={pixAmount}
            pixKey={pixKey}
            isProcessing={isProcessing}
            onPixAmountChange={setPixAmount}
            onPixKeyChange={setPixKey}
            onSendPIX={handleSendPIX}
            onNavigate={setCurrentView}
            canSend={!!pixAmount && !!pixKey && parseFloat(pixAmount) > 0 && (parseFloat(pixAmount) / kaleToBRL) <= balance}
          />
        );
      case 'deposit':
        return (
          <DepositView
            onNavigate={setCurrentView}
          />
        );
      case 'history':
        return (
          <HistoryView
            transactions={transactions}
            kaleToBRL={kaleToBRL}
            onNavigate={setCurrentView}
          />
        );
      case 'profile':
        return (
          <ProfileView
            balance={balance}
            kaleToBRL={kaleToBRL}
          />
        );
      case 'success':
        return (
          <SuccessView
            pixAmount={pixAmount}
            kaleToBRL={kaleToBRL}
            onNavigate={setCurrentView}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-gradient-to-b from-green-50 to-white min-h-screen relative">
      <div className="p-4">
        {renderCurrentView()}
      </div>
      
      {/* Show bottom navigation only on main views */}
      {['home', 'history', 'profile'].includes(currentView) && (
        <BottomNavigation 
          currentView={currentView}
          onNavigate={setCurrentView}
        />
      )}
      
      <div className="p-4 text-center text-xs text-gray-500 pb-20">
        <p>🥬 Demo KALE Farmer Wallet</p>
        <p>Powered by Stellar • Proof-of-Teamwork</p>
      </div>
    </div>
  );
}

export default App;