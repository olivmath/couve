import { create } from 'zustand';
import { parsePixPayload, isValidPixPayload, formatRecipientName, PixKeyType, detectPixKeyType } from '../lib/pixParser';
import { StellarAccount } from '../lib/stellarService';
import PriceService from '../lib/priceService';
export type ViewType = 'home' | 'send' | 'deposit' | 'history' | 'success' | 'profile' | 'qr_scanner' | 'pix_key_input' | 'amount_input' | 'confirmation' | 'signin' | 'signup';

export interface Transaction {
  id: string;
  type: 'pix_sent' | 'harvest';
  amount: number;
  date: string;
  description: string;
}

interface PaymentData {
  pixKey: string;
  pixKeyType: PixKeyType;
  amount: string;
  recipientName?: string;
}

interface WalletState {
  // Estado
  balance: number;
  stellarBalance: number;
  stellarAccount: StellarAccount | null;
  pixAmount: string;
  pixKey: string;
  pixKeyType: PixKeyType;
  currentView: ViewType;
  isProcessing: boolean;
  qrCodeData: string;
  kaleToBRL: number;
  kaleToUSD: number;
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
  handlePixKeySubmit: (pixKey: string, pixKeyType: PixKeyType) => void;
  handleAmountSubmit: (amount: string) => void;
  isValidPixKey: (key: string, type: PixKeyType) => boolean;
  detectPixKeyType: (key: string) => PixKeyType;
  
  // Setters
  setBalance: (balance: number) => void;
  setStellarBalance: (balance: number) => void;
  setStellarAccount: (account: StellarAccount | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setQrCodeData: (data: string) => void;
  setCurrentView: (view: ViewType) => void;
  setPaymentData: (data: PaymentData | null) => void;
  updateKalePrice: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  // Estado inicial
  balance: 0,
  stellarBalance: 0,
  stellarAccount: null,
  pixAmount: '',
  pixKey: '',
  pixKeyType: 'UUID',
  currentView: 'signin',
  isProcessing: false,
  qrCodeData: '',
  kaleToBRL: 0.42,
  kaleToUSD: 0.000385,
  paymentData: null,
  transactions: [
    { id: '1', type: 'pix_sent', amount: -21.00, date: '2025-08-28', description: 'Mercado Orgânico Verde' },
    { id: '2', type: 'pix_sent', amount: -8.40, date: '2025-08-27', description: 'Feira do Produtor' },
    { id: '3', type: 'harvest', amount: 500.00, date: '2025-08-26', description: 'Harvest Reward' },
    { id: '4', type: 'pix_sent', amount: -6.30, date: '2025-08-26', description: 'Loja de Sementes' }
  ],
  
  // Setters
  setBalance: (balance) => set({ balance }),
  setStellarBalance: (stellarBalance) => set({ stellarBalance }),
  setStellarAccount: (stellarAccount) => set({ stellarAccount }),
  setPixAmount: (pixAmount) => set({ pixAmount }),
  setPixKey: (pixKey) => set({ pixKey }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setQrCodeData: (qrCodeData) => set({ qrCodeData }),
  setCurrentView: (currentView) => set({ currentView }),
  setPaymentData: (paymentData) => set({ paymentData }),

  
  // Atualizar preço do KALE em BRL e USD
  updateKalePrice: async () => {
    try {
      console.log('🔄 [WalletStore] Iniciando atualização de preços do KALE...');
      
      const [priceBRL, priceUSD] = await Promise.all([
        PriceService.getKalePrice(),
        PriceService.getKalePriceUSD()
      ]);
      
      console.log('💰 [WalletStore] Preços obtidos - BRL:', priceBRL, 'USD:', priceUSD);
      
      set({ kaleToBRL: priceBRL, kaleToUSD: priceUSD });
      
      console.log('✅ [WalletStore] Preços atualizados no store');
    } catch (error) {
      console.error('❌ [WalletStore] Erro ao atualizar preço do KALE:', error);
    }
  },
  
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
          pixKeyType: pixData.pixKeyType,
          amount: pixData.amount,
          recipientName: formatRecipientName(pixData.recipientName)
        },
        currentView: 'confirmation'
      });
    } else {
      // Fallback para QR codes simples (apenas chave PIX)
      const detectedType = detectPixKeyType(qrData);
      if (get().isValidPixKey(qrData, detectedType)) {
        set({
          paymentData: { 
            pixKey: qrData, 
            pixKeyType: detectedType,
            amount: '50.00' 
          },
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
              pixKeyType: pixData.pixKeyType,
              amount: pixData.amount,
              recipientName: formatRecipientName(pixData.recipientName)
            },
            currentView: 'confirmation'
          });
          return;
        }
      }
      
      // Fallback para chave PIX simples
      const detectedType = detectPixKeyType(clipboardText);
      if (get().isValidPixKey(clipboardText, detectedType)) {
        set({
          paymentData: { 
            pixKey: clipboardText,
            pixKeyType: detectedType,
            amount: '25.00'
          },
          currentView: 'confirmation'
        });
      } else {
        alert('Código PIX ou chave PIX inválida na área de transferência');
      }
    } catch (error) {
      alert('Erro ao acessar área de transferência');
    }
  },
  
  handlePixKeySubmit: (pixKey, pixKeyType) => {
    set({
      pixKey,
      pixKeyType,
      currentView: 'amount_input'
    });
  },
  
  handleAmountSubmit: (amount) => {
    const { pixKey, pixKeyType } = get();
    if (pixKey) {
      set({
        paymentData: { 
          pixKey,
          pixKeyType,
          amount 
        },
        currentView: 'confirmation'
      });
    }
  },

  detectPixKeyType: detectPixKeyType,
  
  isValidPixKey: (key: string, type: PixKeyType) => {
    if (!key || !type) return false;
    
    const cleanKey = key.replace(/[^a-zA-Z0-9@.-]/g, '');
    
    switch (type) {
      case 'CPF':
        return /^\d{11}$/.test(cleanKey);
      case 'CNPJ':
        return /^\d{14}$/.test(cleanKey);
      case 'EMAIL':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanKey);
      case 'PHONE':
        return /^\d{10,11}$/.test(cleanKey);
      case 'UUID':
        return /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(cleanKey);
      default:
        return false;
    }
  },
  
  canSendPIX: () => {
    const { pixAmount, pixKey, balance, kaleToBRL } = get();
    if (!pixAmount || !pixKey) return false;
    const kaleAmount = parseFloat(pixAmount) / kaleToBRL;
    return kaleAmount <= balance;
  }
}));