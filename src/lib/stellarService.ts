import { Keypair, Networks, Account, TransactionBuilder, Operation, Asset, Horizon } from '@stellar/stellar-sdk';
import { NetworkType } from '../stores/useWalletStore';

export interface StellarAccount {
  publicKey: string;
  secretKey: string;
  keypair: Keypair;
}

export class StellarService {
  /**
   * Returns the Horizon server based on the selected network
   */
  static getHorizonServer(networkType: NetworkType): Horizon.Server {
    return networkType === 'mainnet' 
      ? new Horizon.Server('https://horizon.stellar.org')
      : new Horizon.Server('https://horizon-testnet.stellar.org');
  }

  /**
   * Returns the network passphrase based on the selected network
   */
  static getNetworkPassphrase(networkType: NetworkType): string {
    return networkType === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET;
  }
  /**
   * Generates a deterministic Stellar keypair based on the user ID (async version)
   * This ensures that the same user always has the same account
   */
  static async generateKeypairFromUserId(userId: string): Promise<StellarAccount> {
    // Create a deterministic seed based on userId
    const encoder = new TextEncoder();
    const data = encoder.encode(`stellar-seed-${userId}`);
    
    // Use crypto.subtle to generate a 32-byte seed
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
   * Synchronous version using a simpler approach
   */
  static generateKeypairFromUserIdSync(userId: string): StellarAccount {
    // Create a simple seed based on userId
    // In production, consider using a more robust hash library
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    // Expand the hash to 32 bytes
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
   * Checks if an account exists on the Stellar network
   */
  static async accountExists(publicKey: string, networkType: NetworkType = 'testnet'): Promise<boolean> {
    try {
      const server = this.getHorizonServer(networkType);
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
   * Requests faucet for an account on testnet
   * Only works on testnet
   */
  static async requestFaucet(publicKey: string, networkType: NetworkType = 'testnet'): Promise<boolean> {
    if (networkType === 'mainnet') {
      console.error('Faucet not available on mainnet');
      return false;
    }

    try {
      const response = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
      );
      
      if (response.ok) {
        console.log('Faucet requested successfully for:', publicKey);
        return true;
      } else {
        console.error('Error requesting faucet:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error requesting faucet:', error);
      return false;
    }
  }

  /**
   * Gets the balance of an account
   */
  static async getAccountBalance(publicKey: string, networkType: NetworkType = 'testnet'): Promise<number> {
    try {
      const server = this.getHorizonServer(networkType);
      const account = await server.loadAccount(publicKey);
      const xlmBalance = account.balances.find(
        (balance: any) => balance.asset_type === 'native'
      );
      return xlmBalance ? parseFloat(xlmBalance.balance) : 0;
    } catch (error) {
      console.error('Error getting balance:', error);
      return 0;
    }
  }

  /**
   * Creates and funds a new Stellar account
   * Returns true if the account was created successfully or already existed
   */
  static async createAndFundAccount(userId: string, networkType: NetworkType = 'testnet'): Promise<StellarAccount | null> {
    try {
      // Generate deterministic keypair
      const stellarAccount = this.generateKeypairFromUserIdSync(userId);
      
      // Check if account already exists
      const exists = await this.accountExists(stellarAccount.publicKey, networkType);
      
      if (!exists) {
        if (networkType === 'mainnet') {
          console.error('Cannot create account automatically on mainnet. Account must be funded manually.');
          return null;
        }
        
        // Request faucet to create and fund the account (testnet only)
        const faucetSuccess = await this.requestFaucet(stellarAccount.publicKey, networkType);
        
        if (!faucetSuccess) {
          console.error('Failed to request faucet');
          return null;
        }
        
        // Wait a bit for the transaction to be processed
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Check if the account was created
        const accountCreated = await this.accountExists(stellarAccount.publicKey, networkType);
        if (!accountCreated) {
          console.error('Account was not created after faucet');
          return null;
        }
        
        console.log('New Stellar account created:', stellarAccount.publicKey);
      } else {
        console.log('Stellar account already exists:', stellarAccount.publicKey);
      }
      
      return stellarAccount;
    } catch (error) {
      console.error('Error creating Stellar account:', error);
      return null;
    }
  }

  /**
   * Saves account data to localStorage
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
   * Retrieves account data from localStorage
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
      console.error('Error loading account from storage:', error);
      return null;
    }
  }

  /**
   * Removes account data from localStorage
   */
  static removeAccountFromStorage(userId: string): void {
    localStorage.removeItem(`stellar-account-${userId}`);
  }
}

export default StellarService;