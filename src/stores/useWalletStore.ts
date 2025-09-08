import { create } from 'zustand';
import { parsePixPayload, isValidPixPayload, formatRecipientName, PixKeyType, detectPixKeyType } from '../lib/pixParser';
import { StellarAccount } from '../lib/stellarService';
import PriceService from '../lib/priceService';
export type ViewType = 'home' | 'send' | 'deposit' | 'history' | 'success' | 'profile' | 'debugger' | 'security' | 'settings' | 'qr_scanner' | 'pix_key_input' | 'amount_input' | 'confirmation' | 'signin' | 'signup';

export type NetworkType = 'testnet' | 'mainnet';

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
  // State
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
  networkType: NetworkType;
  
  // Actions
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
  setNetworkType: (network: NetworkType) => void;
  updateKalePrice: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  // Initial state
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
  networkType: 'testnet',
  transactions: [
    { id: '1', type: 'pix_sent', amount: -21.00, date: '2025-08-28', description: 'Green Organic Market' },
    { id: '2', type: 'pix_sent', amount: -8.40, date: '2025-08-27', description: 'Producer Fair' },
    { id: '3', type: 'harvest', amount: 500.00, date: '2025-08-26', description: 'Harvest Reward' },
    { id: '4', type: 'pix_sent', amount: -6.30, date: '2025-08-26', description: 'Seed Store' }
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
  setNetworkType: (networkType) => set({ networkType }),

  
  // Update KALE price in BRL and USD
  updateKalePrice: async () => {
    try {
      console.log('🔄 [WalletStore] Starting KALE price update...');
      
      const [priceBRL, priceUSD] = await Promise.all([
        PriceService.getKalePrice(),
        PriceService.getKalePriceUSD()
      ]);
      
      console.log('💰 [WalletStore] Prices obtained - BRL:', priceBRL, 'USD:', priceUSD);
      
      // Validate if prices are valid before updating
      if (typeof priceBRL === 'number' && priceBRL > 0 && 
          typeof priceUSD === 'number' && priceUSD > 0) {
        set({ kaleToBRL: priceBRL, kaleToUSD: priceUSD });
        console.log('✅ [WalletStore] Prices updated in store');
      } else {
        console.warn('⚠️ [WalletStore] Invalid prices received, keeping current values:', { priceBRL, priceUSD });
      }
    } catch (error) {
      console.error('❌ [WalletStore] Error updating KALE price:', error);
      // Don't update prices in case of error, keep current values
    }
  },
  
  // Actions
  handleSendPIX: () => {
    const { paymentData } = get();
    if (!paymentData) return;
    
    set({ isProcessing: true });
    
    // Simulate PIX processing
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
    // Try to parse PIX QR Code
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
      // Fallback for simple QR codes (PIX key only)
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
        alert('Invalid PIX QR Code');
      }
    }
  },
  
  handlePastePixKey: async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      
      // First, try to parse as complete PIX payload
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
      
      // Fallback for simple PIX key
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
        alert('Invalid PIX code or PIX key in clipboard');
      }
    } catch (error) {
      alert('Error accessing clipboard');
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