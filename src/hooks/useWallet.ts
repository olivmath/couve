import { useState } from 'react';

export type ViewType = 'home' | 'send' | 'deposit' | 'history' | 'success' | 'profile';

export interface Transaction {
  id: string;
  type: 'pix_sent' | 'harvest';
  amount: number;
  date: string;
  description: string;
}

export const useWallet = () => {
  const [balance, setBalance] = useState(1247.89);
  const [pixAmount, setPixAmount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [isProcessing, setIsProcessing] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');

  // Taxa de conversão KALE -> BRL (simulada)
  const kaleToBRL = 0.42;

  const transactions: Transaction[] = [
    { id: '1', type: 'pix_sent', amount: -21.00, date: '2025-08-28', description: 'Mercado Orgânico Verde' },
    { id: '2', type: 'pix_sent', amount: -8.40, date: '2025-08-27', description: 'Feira do Produtor' },
    { id: '3', type: 'harvest', amount: 500.00, date: '2025-08-26', description: 'Harvest Reward' },
    { id: '4', type: 'pix_sent', amount: -6.30, date: '2025-08-26', description: 'Loja de Sementes' }
  ];

  const handleSendPIX = () => {
    if (!pixAmount || !pixKey) return;
    
    setIsProcessing(true);
    
    // Simular processamento PIX
    setTimeout(() => {
      const kaleAmount = parseFloat(pixAmount) / kaleToBRL;
      setBalance(balance - kaleAmount);
      setIsProcessing(false);
      setCurrentView('success');
      setPixAmount('');
      setPixKey('');
    }, 2000);
  };

  const navigateToView = (view: ViewType) => {
    setCurrentView(view);
  };

  const canSendPIX = () => {
    if (!pixAmount || !pixKey) return false;
    const kaleAmount = parseFloat(pixAmount) / kaleToBRL;
    return kaleAmount <= balance;
  };

  return {
    // State
    balance,
    pixAmount,
    pixKey,
    currentView,
    isProcessing,
    qrCodeData,
    kaleToBRL,
    transactions,
    
    // Actions
    setPixAmount,
    setPixKey,
    handleSendPIX,
    navigateToView,
    canSendPIX,
    
    // Setters
    setBalance,
    setIsProcessing,
    setQrCodeData,
    setCurrentView: navigateToView
  };
};