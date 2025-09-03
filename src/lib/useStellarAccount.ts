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
 * Hook personalizado para gerenciar conta Stellar integrada com Stack Auth
 */
export const useStellarAccount = (): UseStellarAccountReturn => {
  const user = useUser();
  const { networkType } = useWalletStore();
  const [stellarAccount, setStellarAccount] = useState<StellarAccount | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState(0);

  /**
   * Atualiza o saldo da conta
   */
  const refreshBalance = async () => {
    if (!stellarAccount) return;
    
    try {
      const newBalance = await StellarService.getAccountBalance(stellarAccount.publicKey, networkType);
      setBalance(newBalance);
    } catch (err) {
      console.error('Erro ao atualizar saldo:', err);
    }
  };

  /**
   * Cria uma nova conta Stellar para o usuário
   */
  const createAccount = async () => {
    if (!user?.id) {
      setError('Usuário não autenticado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Tentar carregar conta existente do storage primeiro
      let account = StellarService.loadAccountFromStorage(user.id);
      
      if (!account) {
        // Se não existe no storage, criar nova conta
        account = await StellarService.createAndFundAccount(user.id, networkType);
        
        if (!account) {
          throw new Error('Falha ao criar conta Stellar');
        }
        
        // Salvar no storage para persistência
        StellarService.saveAccountToStorage(user.id, account);
      }
      
      setStellarAccount(account);
      
      // Atualizar saldo
      await refreshBalance();
      
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta Stellar');
      console.error('Erro ao criar conta:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Carrega a conta quando o usuário faz login ou quando a rede muda
   */
  useEffect(() => {
    if (user?.id) {
      // Tentar carregar conta existente do storage
      const storedAccount = StellarService.loadAccountFromStorage(user.id);
      
      if (storedAccount) {
        setStellarAccount(storedAccount);
        refreshBalance();
      } else {
        // Se não existe conta, criar automaticamente
        createAccount();
      }
    }
  }, [user?.id]);

  /**
   * Atualiza o saldo quando a rede muda
   */
  useEffect(() => {
    if (stellarAccount) {
      refreshBalance();
    }
  }, [networkType, stellarAccount]);

  /**
   * Limpa a conta quando o usuário faz logout
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