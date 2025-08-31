import React from 'react';
import SendView from './components/views/SendView';
import DepositView from './components/views/DepositView';
import HistoryView from './components/views/HistoryView';
import SuccessView from './components/views/SuccessView';
import ProfileView from './components/views/ProfileView';
import QRScannerView from './components/views/QRScannerView';
import PixKeyInputView from './components/views/PixKeyInputView';
import AmountInputView from './components/views/AmountInputView';
import ConfirmationView from './components/views/ConfirmationView';
import { BottomNavigation } from './components/BottomNavigation';
import { useWalletStore } from './stores/useWalletStore';
import HomeView from './components/views/HomeView';

function App() {
  const {
    currentView,
  } = useWalletStore();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'send':
        return <SendView />;
      case 'deposit':
        return <DepositView />;
      case 'history':
        return <HistoryView />;
      case 'profile':
        return <ProfileView />;
      case 'qr_scanner':
        return <QRScannerView />;
      case 'pix_key_input':
        return <PixKeyInputView />;
      case 'amount_input':
         return <AmountInputView />;
      case 'confirmation':
          return <ConfirmationView />;
      case 'success':
        return <SuccessView />;
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
        <BottomNavigation />
      )}
      
      <div className="p-4 text-center text-xs text-gray-500 pb-20">
        <p>🥬 Demo KALE Farmer Wallet</p>
        <p>Powered by Stellar • Proof-of-Teamwork</p>
      </div>
    </div>
  );
}

export default App;