import { create } from 'zustand';
import { parsePixPayload, isValidPixPayload, formatRecipientName } from '../lib/pixParser';

export type ViewType = 'home' | 'send' | 'deposit' | 'history' | 'success' | 'profile' | 'qr_scanner' | 'pix_key_input' | 'amount_input' | 'confirmation';

export interface Transaction {
  id: string;
  type: 'pix_sent' | 'harvest';
  amount: number;
  date: string;
  description: string;
}

interface PaymentData {
  pixKey: string;
  amount: string;
  recipientName?: string;
}

interface WalletState {
  // Estado
  balance: number;
  pixAmount: string;
  pixKey: string;
  currentView: ViewType;
  isProcessing: boolean;
  qrCodeData: string;
  kaleToBRL: number;
  transactions: Transaction[];
  paymentData: PaymentData | null;
  
  // Ações
  setPixAmount: (amount: string) => void;
  setPixKey: (key: string) => void;
  handleSendPIX: () => void;
  navigateToView: (view: ViewType) => void;
  canSendPIX: () => boolean;
  startQRScan: () => void;
  startPixKeyInput: () => void;
  handleQRScanSuccess: (qrData: string) => void;
  handlePastePixKey: () => Promise<void>;
  handlePixKeySubmit: (pixKey: string) => void;
  handleAmountSubmit: (amount: string) => void;
  isValidPixKey: (key: string) => boolean;
  
  // Setters
  setBalance: (balance: number) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setQrCodeData: (data: string) => void;
  setCurrentView: (view: ViewType) => void;
  setPaymentData: (data: PaymentData | null) => void;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  // Estado inicial
  balance: 1247.89,
  pixAmount: '',
  pixKey: '',
  currentView: 'home',
  isProcessing: false,
  qrCodeData: '',
  kaleToBRL: 0.42,
  paymentData: null,
  transactions: [
    { id: '1', type: 'pix_sent', amount: -21.00, date: '2025-08-28', description: 'Mercado Orgânico Verde' },
    { id: '2', type: 'pix_sent', amount: -8.40, date: '2025-08-27', description: 'Feira do Produtor' },
    { id: '3', type: 'harvest', amount: 500.00, date: '2025-08-26', description: 'Harvest Reward' },
    { id: '4', type: 'pix_sent', amount: -6.30, date: '2025-08-26', description: 'Loja de Sementes' }
  ],
  
  // Setters
  setBalance: (balance) => set({ balance }),
  setPixAmount: (pixAmount) => set({ pixAmount }),
  setPixKey: (pixKey) => set({ pixKey }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setQrCodeData: (qrCodeData) => set({ qrCodeData }),
  setCurrentView: (currentView) => set({ currentView }),
  setPaymentData: (paymentData) => set({ paymentData }),
  
  // Ações
  handleSendPIX: () => {
    const { paymentData } = get();
    if (!paymentData) return;
    
    set({ isProcessing: true });
    
    // Simular processamento PIX
    setTimeout(() => {
      const { balance, kaleToBRL } = get();
      const kaleAmount = parseFloat(paymentData.amount) / kaleToBRL;
      
      set({
        balance: balance - kaleAmount,
        isProcessing: false,
        currentView: 'success',
        pixAmount: paymentData.amount,
        pixKey: paymentData.pixKey,
        paymentData: null
      });
    }, 2000);
  },
  
  navigateToView: (view) => set({ currentView: view }),
  
  startQRScan: () => set({ currentView: 'qr_scanner' }),
  
  startPixKeyInput: () => set({ currentView: 'pix_key_input' }),
  
  handleQRScanSuccess: (qrData) => {
    // Tentar fazer parsing do QR Code PIX
    const pixData = parsePixPayload(qrData);
    
    if (pixData) {
      set({
        paymentData: { 
          pixKey: pixData.pixKey, 
          amount: pixData.amount,
          recipientName: formatRecipientName(pixData.recipientName)
        },
        currentView: 'confirmation'
      });
    } else {
      // Fallback para QR codes simples (apenas chave PIX)
      if (get().isValidPixKey(qrData)) {
        set({
          paymentData: { pixKey: qrData, amount: '50.00' },
          currentView: 'confirmation'
        });
      } else {
        alert('QR Code PIX inválido');
      }
    }
  },
  
  handlePastePixKey: async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      
      // Primeiro, tentar fazer parsing como payload PIX completo
      if (isValidPixPayload(clipboardText)) {
        const pixData = parsePixPayload(clipboardText);
        if (pixData) {
          set({
            paymentData: { 
              pixKey: pixData.pixKey, 
              amount: pixData.amount,
              recipientName: formatRecipientName(pixData.recipientName)
            },
            currentView: 'confirmation'
          });
          return;
        }
      }
      
      // Fallback para chave PIX simples
      if (get().isValidPixKey(clipboardText)) {
        const amount = '25.00'; // Valor padrão para chave PIX simples
        set({
          paymentData: { pixKey: clipboardText, amount },
          currentView: 'confirmation'
        });
      } else {
        alert('Código PIX ou chave PIX inválida na área de transferência');
      }
    } catch (error) {
      alert('Erro ao acessar área de transferência');
    }
  },
  
  handlePixKeySubmit: (pixKey) => {
    set({
      pixKey,
      currentView: 'amount_input'
    });
  },
  
  handleAmountSubmit: (amount) => {
    const { pixKey } = get();
    if (pixKey) {
      set({
        paymentData: { pixKey, amount },
        currentView: 'confirmation'
      });
    }
  },
  
  isValidPixKey: (key) => {
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
  },
  
  canSendPIX: () => {
    const { pixAmount, pixKey, balance, kaleToBRL } = get();
    if (!pixAmount || !pixKey) return false;
    const kaleAmount = parseFloat(pixAmount) / kaleToBRL;
    return kaleAmount <= balance;
  }
}));