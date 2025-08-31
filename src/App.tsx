import React from 'react';
import { useUser } from '@stackframe/stack';
import SendView from './components/views/SendView';
import DepositView from './components/views/DepositView';
import HistoryView from './components/views/HistoryView';
import SuccessView from './components/views/SuccessView';
import ProfileView from './components/views/ProfileView';
import QRScannerView from './components/views/QRScannerView';
import PixKeyInputView from './components/views/PixKeyInputView';
import AmountInputView from './components/views/AmountInputView';
import ConfirmationView from './components/views/ConfirmationView';
import AuthView from './components/views/AuthView';
import ProtectedRoute from './components/ProtectedRoute';
import { BottomNavigation } from './components/BottomNavigation';
import { useWalletStore } from './stores/useWalletStore';
import HomeView from './components/views/HomeView';

function App() {
  const user = useUser();
  const {
    currentView,
    navigateToView,
  } = useWalletStore();

  // Debug: Log do estado de autenticação
  React.useEffect(() => {
    console.log('Auth Debug:', { user: !!user, currentView, userEmail: user?.primaryEmail });
  }, [user, currentView]);

  // Gerencia redirecionamento baseado no estado de autenticação
  React.useEffect(() => {
    if (!user && currentView !== 'signin' && currentView !== 'signup') {
      console.log('Redirecting to signin - user not authenticated');
      navigateToView('signin');
    } else if (user && (currentView === 'signin' || currentView === 'signup')) {
      console.log('Redirecting to home - user authenticated');
      navigateToView('home');
    }
  }, [user, currentView, navigateToView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <ProtectedRoute><HomeView /></ProtectedRoute>;
      case 'send':
        return <ProtectedRoute><SendView /></ProtectedRoute>;
      case 'deposit':
        return <ProtectedRoute><DepositView /></ProtectedRoute>;
      case 'history':
        return <ProtectedRoute><HistoryView /></ProtectedRoute>;
      case 'profile':
        return <ProtectedRoute><ProfileView /></ProtectedRoute>;
      case 'qr_scanner':
        return <ProtectedRoute><QRScannerView /></ProtectedRoute>;
      case 'pix_key_input':
        return <ProtectedRoute><PixKeyInputView /></ProtectedRoute>;
      case 'amount_input':
         return <ProtectedRoute><AmountInputView /></ProtectedRoute>;
      case 'confirmation':
          return <ProtectedRoute><ConfirmationView /></ProtectedRoute>;
      case 'success':
        return <ProtectedRoute><SuccessView /></ProtectedRoute>;
      case 'signin':
        return <AuthView mode="signin" />;
      case 'signup':
        return <AuthView mode="signup" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-gradient-to-b from-green-50 to-white min-h-screen relative">
      <div className="p-4">
        {renderCurrentView()}
      </div>
      
      {/* Show bottom navigation only on main views and when authenticated */}
      {user && ['home', 'history', 'profile'].includes(currentView) && (
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