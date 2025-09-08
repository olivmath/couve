import { useState, useEffect } from 'react';
import { useUser } from '@stackframe/stack';
import StellarService, { StellarAccount } from './stellarService';
import { useWalletStore } from '../stores/useWalletStore';

export interface UseStellarAccountReturn {
  stellarAccount: StellarAccount | null;
  isLoading: boolean;
  error: string | null;
  balance: number;
  refreshBalance: () => Promise<void>;
  createAccount: () => Promise<void>;
}

/**
 * Custom hook to manage Stellar account integrated with Stack Auth
 */
export const useStellarAccount = (): UseStellarAccountReturn => {
  const user = useUser();
  const { networkType } = useWalletStore();
  const [stellarAccount, setStellarAccount] = useState<StellarAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);

  /**
   * Updates the account balance
   */
  const refreshBalance = async () => {
    if (!stellarAccount) return;
    
    try {
      const newBalance = await StellarService.getAccountBalance(stellarAccount.publicKey, networkType);
      setBalance(newBalance);
    } catch (err) {
      console.error('Error updating balance:', err);
    }
  };

  /**
   * Creates a new Stellar account for the user
   */
  const createAccount = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Try to load existing account from storage first
      let account = StellarService.loadAccountFromStorage(user.id);
      
      if (!account) {
        // If it doesn't exist in storage, create new account
        account = await StellarService.createAndFundAccount(user.id, networkType);
        
        if (!account) {
          throw new Error('Failed to create Stellar account');
        }
        
        // Save to storage for persistence
        StellarService.saveAccountToStorage(user.id, account);
      }
      
      setStellarAccount(account);
      
      // Update balance
      await refreshBalance();
      
    } catch (err: any) {
      setError(err.message || 'Error creating Stellar account');
      console.error('Error creating account:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Loads the account when user logs in or when network changes
   */
  useEffect(() => {
    if (user?.id) {
      // Try to load existing account from storage
      const storedAccount = StellarService.loadAccountFromStorage(user.id);
      
      if (storedAccount) {
        setStellarAccount(storedAccount);
        refreshBalance();
      } else {
        // If no account exists, create automatically
        createAccount();
      }
    }
  }, [user?.id]);

  /**
   * Updates balance when network changes
   */
  useEffect(() => {
    if (stellarAccount) {
      refreshBalance();
    }
  }, [networkType, stellarAccount]);

  /**
   * Clears account when user logs out
   */
  useEffect(() => {
    if (!user) {
      setStellarAccount(null);
      setBalance(0);
      setError(null);
    }
  }, [user]);

  return {
    stellarAccount,
    isLoading,
    error,
    balance,
    refreshBalance,
    createAccount
  };
};

export default useStellarAccount;