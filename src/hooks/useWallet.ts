import { useState } from 'react';
import { parsePixPayload, isValidPixPayload, formatRecipientName } from '../lib/pixParser';

export type ViewType = 'home' | 'send' | 'deposit' | 'history' | 'success' | 'profile' | 'qr_scanner' | 'pix_key_input' | 'amount_input' | 'confirmation';

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
  const [paymentData, setPaymentData] = useState<{pixKey: string; amount: string; recipientName?: string} | null>(null);

  // Taxa de conversão KALE -> BRL (simulada)
  const kaleToBRL = 0.42;

  const transactions: Transaction[] = [
    { id: '1', type: 'pix_sent', amount: -21.00, date: '2025-08-28', description: 'Mercado Orgânico Verde' },
    { id: '2', type: 'pix_sent', amount: -8.40, date: '2025-08-27', description: 'Feira do Produtor' },
    { id: '3', type: 'harvest', amount: 500.00, date: '2025-08-26', description: 'Harvest Reward' },
    { id: '4', type: 'pix_sent', amount: -6.30, date: '2025-08-26', description: 'Loja de Sementes' }
  ];

  const handleSendPIX = () => {
    if (!paymentData) return;
    
    setIsProcessing(true);
    
    // Simular processamento PIX
    setTimeout(() => {
      const kaleAmount = parseFloat(paymentData.amount) / kaleToBRL;
      setBalance(balance - kaleAmount);
      setIsProcessing(false);
      setCurrentView('success');
      setPixAmount(paymentData.amount);
      setPixKey(paymentData.pixKey);
      setPaymentData(null);
    }, 2000);
  };

  const startQRScan = () => {
    setCurrentView('qr_scanner');
  };

  const startPixKeyInput = () => {
    setCurrentView('pix_key_input');
  };

  const handleQRScanSuccess = (qrData: string) => {
    // Tentar fazer parsing do QR Code PIX
    const pixData = parsePixPayload(qrData);
    
    if (pixData) {
      setPaymentData({ 
        pixKey: pixData.pixKey, 
        amount: pixData.amount,
        recipientName: formatRecipientName(pixData.recipientName)
      });
      setCurrentView('confirmation');
    } else {
      // Fallback para QR codes simples (apenas chave PIX)
      if (isValidPixKey(qrData)) {
        setPaymentData({ pixKey: qrData, amount: '50.00' });
        setCurrentView('confirmation');
      } else {
        alert('QR Code PIX inválido');
      }
    }
  };

  const handlePastePixKey = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      
      // Primeiro, tentar fazer parsing como payload PIX completo
      if (isValidPixPayload(clipboardText)) {
        const pixData = parsePixPayload(clipboardText);
        if (pixData) {
          setPaymentData({ 
            pixKey: pixData.pixKey, 
            amount: pixData.amount,
            recipientName: formatRecipientName(pixData.recipientName)
          });
          setCurrentView('confirmation');
          return;
        }
      }
      
      // Fallback para chave PIX simples
      if (isValidPixKey(clipboardText)) {
        const amount = '25.00'; // Valor padrão para chave PIX simples
        setPaymentData({ pixKey: clipboardText, amount });
        setCurrentView('confirmation');
      } else {
        alert('Código PIX ou chave PIX inválida na área de transferência');
      }
    } catch (error) {
      alert('Erro ao acessar área de transferência');
    }
  };

  const handlePixKeySubmit = (pixKey: string) => {
    setPixKey(pixKey);
    setCurrentView('amount_input');
  };

  const handleAmountSubmit = (amount: string) => {
    if (pixKey) {
      setPaymentData({ pixKey, amount });
      setCurrentView('confirmation');
    }
  };

  const isValidPixKey = (key: string): boolean => {
    if (!key) return false;
    
    const cleanKey = key.replace(/[^a-zA-Z0-9@.-]/g, '');
    
    // CPF (11 dígitos)
    if (/^\d{11}$/.test(cleanKey)) return true;
    
    // CNPJ (14 dígitos)
    if (/^\d{14}$/.test(cleanKey)) return true;
    
    // Email
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanKey)) return true;
    
    // Telefone (10 ou 11 dígitos com DDD)
    if (/^\d{10,11}$/.test(cleanKey)) return true;
    
    // Chave aleatória (32 caracteres)
    if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(cleanKey)) return true;
    
    return false;
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
    paymentData,
    
    // Actions
    setPixAmount,
    setPixKey,
    handleSendPIX,
    navigateToView,
    canSendPIX,
    startQRScan,
    startPixKeyInput,
    handleQRScanSuccess,
    handlePastePixKey,
    handlePixKeySubmit,
    handleAmountSubmit,
    isValidPixKey,
    
    // Setters
    setBalance,
    setIsProcessing,
    setQrCodeData,
    setCurrentView: navigateToView,
    setPaymentData
  };
};