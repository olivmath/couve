import { Keypair, Networks, Account, TransactionBuilder, Operation, Asset, Horizon } from '@stellar/stellar-sdk';

// Configuração para testnet
const server = new Horizon.Server('https://horizon-testnet.stellar.org');
const networkPassphrase = Networks.TESTNET;

export interface StellarAccount {
  publicKey: string;
  secretKey: string;
  keypair: Keypair;
}

export class StellarService {
  /**
   * Gera um keypair Stellar determinístico baseado no ID do usuário (versão async)
   * Isso garante que o mesmo usuário sempre tenha a mesma conta
   */
  static async generateKeypairFromUserId(userId: string): Promise<StellarAccount> {
    // Criar uma seed determinística baseada no userId
    const encoder = new TextEncoder();
    const data = encoder.encode(`stellar-seed-${userId}`);
    
    // Usar crypto.subtle para gerar uma seed de 32 bytes
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const seed = new Uint8Array(hashBuffer);
    const keypair = Keypair.fromRawEd25519Seed(seed);
    
    return {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
      keypair
    };
  }

  /**
   * Versão síncrona usando uma abordagem mais simples
   */
  static generateKeypairFromUserIdSync(userId: string): StellarAccount {
    // Criar uma seed simples baseada no userId
    // Em produção, considere usar uma biblioteca de hash mais robusta
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Expandir o hash para 32 bytes
    const seed = new Uint8Array(32);
    const hashStr = Math.abs(hash).toString().padStart(10, '0') + userId;
    
    for (let i = 0; i < 32; i++) {
      seed[i] = hashStr.charCodeAt(i % hashStr.length) % 256;
    }
    
    const keypair = Keypair.fromRawEd25519Seed(seed);
    
    return {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
      keypair
    };
  }

  /**
   * Verifica se uma conta existe na rede Stellar
   */
  static async accountExists(publicKey: string): Promise<boolean> {
    try {
      await server.loadAccount(publicKey);
      return true;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Solicita faucet para uma conta na testnet
   */
  static async requestFaucet(publicKey: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
      );
      
      if (response.ok) {
        console.log('Faucet solicitado com sucesso para:', publicKey);
        return true;
      } else {
        console.error('Erro ao solicitar faucet:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Erro ao solicitar faucet:', error);
      return false;
    }
  }

  /**
   * Obtém o saldo de uma conta
   */
  static async getAccountBalance(publicKey: string): Promise<number> {
    try {
      const account = await server.loadAccount(publicKey);
      const xlmBalance = account.balances.find(
        (balance: any) => balance.asset_type === 'native'
      );
      return xlmBalance ? parseFloat(xlmBalance.balance) : 0;
    } catch (error) {
      console.error('Erro ao obter saldo:', error);
      return 0;
    }
  }

  /**
   * Cria e financia uma nova conta Stellar
   * Retorna true se a conta foi criada com sucesso ou já existia
   */
  static async createAndFundAccount(userId: string): Promise<StellarAccount | null> {
    try {
      // Gerar keypair determinístico
      const stellarAccount = this.generateKeypairFromUserIdSync(userId);
      
      // Verificar se a conta já existe
      const exists = await this.accountExists(stellarAccount.publicKey);
      
      if (!exists) {
        // Solicitar faucet para criar e financiar a conta
        const faucetSuccess = await this.requestFaucet(stellarAccount.publicKey);
        
        if (!faucetSuccess) {
          console.error('Falha ao solicitar faucet');
          return null;
        }
        
        // Aguardar um pouco para a transação ser processada
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Verificar se a conta foi criada
        const accountCreated = await this.accountExists(stellarAccount.publicKey);
        if (!accountCreated) {
          console.error('Conta não foi criada após faucet');
          return null;
        }
        
        console.log('Nova conta Stellar criada:', stellarAccount.publicKey);
      } else {
        console.log('Conta Stellar já existe:', stellarAccount.publicKey);
      }
      
      return stellarAccount;
    } catch (error) {
      console.error('Erro ao criar conta Stellar:', error);
      return null;
    }
  }

  /**
   * Salva os dados da conta no localStorage
   */
  static saveAccountToStorage(userId: string, account: StellarAccount): void {
    const accountData = {
      userId,
      publicKey: account.publicKey,
      secretKey: account.secretKey,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(`stellar-account-${userId}`, JSON.stringify(accountData));
  }

  /**
   * Recupera os dados da conta do localStorage
   */
  static loadAccountFromStorage(userId: string): StellarAccount | null {
    try {
      const stored = localStorage.getItem(`stellar-account-${userId}`);
      if (!stored) return null;
      
      const accountData = JSON.parse(stored);
      const keypair = Keypair.fromSecret(accountData.secretKey);
      
      return {
        publicKey: accountData.publicKey,
        secretKey: accountData.secretKey,
        keypair
      };
    } catch (error) {
      console.error('Erro ao carregar conta do storage:', error);
      return null;
    }
  }

  /**
   * Remove os dados da conta do localStorage
   */
  static removeAccountFromStorage(userId: string): void {
    localStorage.removeItem(`stellar-account-${userId}`);
  }
}

export default StellarService;