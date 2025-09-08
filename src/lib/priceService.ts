// Import the Stellar Expert scraper
import StellarExpertScraper from './stellarExpertScraper';
import { getKaleConfig } from './kaleConfig';

// Function to get current network configuration
// Since this is a static service, we'll use mainnet as default
const getNetworkConfig = () => {
  return getKaleConfig('mainnet');
};

// Interface for price data
interface PriceData {
  price: number;
  timestamp: number;
}

export class PriceService {

  /**
   * Fetches KALE price in BRL using dynamic pool data
   * Uses real data from KALE/USDC pool on Stellar Expert
   */
  static async getKalePrice(): Promise<number> {
    try {
      console.log('🔍 [PriceService] Starting KALE price search in BRL...');
      
      // 1. Fetch KALE/USDC price via dynamic scraping
      const kaleToUsdPrice = await this.getKalePriceFromPool();
      console.log('💰 [PriceService] KALE/USD price from pool:', kaleToUsdPrice);
      
      // Validate USD price
      if (!kaleToUsdPrice || kaleToUsdPrice <= 0) {
        console.error('❌ [PriceService] Invalid KALE/USD price:', kaleToUsdPrice);
        throw new Error(`Invalid KALE/USD price: ${kaleToUsdPrice}`);
      }
      
      // 2. Fetch USD/BRL price
      const usdToBrlPrice = await this.getUsdToBrlPrice();
      console.log('💱 [PriceService] USD/BRL rate:', usdToBrlPrice);
      
      // Validate USD/BRL rate
      if (!usdToBrlPrice || usdToBrlPrice <= 0) {
        console.error('❌ [PriceService] Invalid USD/BRL rate:', usdToBrlPrice);
        throw new Error(`Invalid USD/BRL rate: ${usdToBrlPrice}`);
      }
      
      // 3. Calculate KALE -> BRL
      const kaleToBrlPrice = kaleToUsdPrice * usdToBrlPrice;
      console.log('🥬 [PriceService] Final KALE/BRL price:', kaleToBrlPrice);
      
      // Validate final price
      if (!kaleToBrlPrice || kaleToBrlPrice <= 0) {
        console.error('❌ [PriceService] Invalid final KALE/BRL price:', kaleToBrlPrice);
        throw new Error(`Invalid final KALE/BRL price: ${kaleToBrlPrice}`);
      }
      
      return kaleToBrlPrice;
    } catch (error) {
      console.error('❌ [PriceService] Error fetching KALE price:', error);
      // Fallback to simulated price in BRL
      const fallbackPrice = 0.42; // ~0.000385 USD * 5.5 USD/BRL
      console.log('🔄 [PriceService] Using fallback price:', fallbackPrice);
      return fallbackPrice;
    }
  }

  /**
   * Fetches KALE/XLM price using StellarExpert API
   */
  static async getKaleToXlmPrice(): Promise<number> {
    try {
      const config = getNetworkConfig();
      // Use StellarExpert API to fetch KALE/XLM market data
      const response = await fetch(
        `https://api.stellar.expert/explorer/public/asset/${config.ASSET_CODE}-${config.ISSUER}/markets`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch KALE market data');
      }
      
      const data = await response.json();
      
      // Look for KALE/XLM pair
      const kaleXlmMarket = data._embedded?.records?.find((market: any) => 
        market.counter_asset_type === 'native' // XLM is the native asset
      );
      
      if (kaleXlmMarket && kaleXlmMarket.last_price) {
        return parseFloat(kaleXlmMarket.last_price);
      }
      
      // Fallback: calculate based on known liquidity pool
      return this.getKalePriceFromPool();
    } catch (error) {
      console.error('Error fetching KALE/XLM price:', error);
      return this.getKalePriceFromPool();
    }
  }

  /**
   * Fetches XLM/BRL price
   * Currently uses conversion via USD (XLM/USD * USD/BRL)
   */
  static async getXlmToBrlPrice(): Promise<number> {
    try {
      // Fetch XLM/USD via CoinGecko or similar
      const xlmUsdResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd'
      );
      
      if (!xlmUsdResponse.ok) {
        throw new Error('Failed to fetch XLM/USD price');
      }
      
      const xlmUsdData = await xlmUsdResponse.json();
      const xlmToUsd = xlmUsdData.stellar?.usd || 0.1; // Fallback
      
      // Fetch USD/BRL
      const usdToBrl = await this.getUsdToBrlPrice();
      
      return xlmToUsd * usdToBrl;
    } catch (error) {
      console.error('Error fetching XLM/BRL price:', error);
      // Fallback: XLM ≈ $0.1 * 5.5 BRL/USD = 0.55 BRL
      return 0.55;
    }
  }

  /**
   * Fetches USD/BRL price using external API
   */
  static async getUsdToBrlPrice(): Promise<number> {
    try {
      // Use CoinGecko to fetch USD/BRL
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=brl'
      );
      
      if (!response.ok) {
        // Try alternative API
        const altResponse = await fetch(
          'https://api.exchangerate-api.com/v4/latest/USD'
        );
        
        if (altResponse.ok) {
          const altData = await altResponse.json();
          return altData.rates?.BRL || 5.5;
        }
        
        throw new Error('Failed to fetch USD/BRL price');
      }
      
      const data = await response.json();
      const usdToBrl = data.usd?.brl || 5.5; // Fallback
      
      return usdToBrl;
    } catch (error) {
      console.error('Error fetching USD/BRL price:', error);
      // Fallback to approximate current rate
      return 5.5; // Approximate USD/BRL rate
    }
  }

  /**
   * Fetches KALE price using liquidity pool data
   * Based on KALE/USDC pool information
   */
  static async getKalePriceFromPool(): Promise<number> {
    try {
      console.log('🏊 [PriceService] Fetching KALE/USDC pool data...');
      
      // Fetch dynamic pool data via scraping
      const poolData = await StellarExpertScraper.getPoolData();
      console.log('📊 [PriceService] Pool data obtained:', poolData);
      
      // Validate pool data
      if (!poolData || typeof poolData.kalePrice !== 'number' || poolData.kalePrice <= 0) {
        console.error('❌ [PriceService] Invalid pool data:', poolData);
        throw new Error(`Invalid pool data: ${JSON.stringify(poolData)}`);
      }
      
      // Return dynamically calculated price
      console.log('💎 [PriceService] KALE price from pool:', poolData.kalePrice);
      return poolData.kalePrice;
    } catch (error) {
      console.error('❌ [PriceService] Error fetching pool price:', error);
      const fallbackPrice = 0.000385; // Fallback
      console.log('🔄 [PriceService] Using pool fallback price:', fallbackPrice);
      return fallbackPrice;
    }
  }

  /**
   * Fetches KALE price in USD using dynamic pool data
   */
  static async getKalePriceUSD(): Promise<number> {
    try {
      console.log('🔍 [PriceService] Starting KALE price search in USD...');
      
      // Use dynamic KALE/USDC pool data directly
      const kalePrice = await this.getKalePriceFromPool();
      console.log('💰 [PriceService] KALE/USD price obtained:', kalePrice);
      
      // Validate price
      if (!kalePrice || kalePrice <= 0) {
        console.error('❌ [PriceService] Invalid KALE/USD price:', kalePrice);
        throw new Error(`Invalid KALE/USD price: ${kalePrice}`);
      }
      
      // Price is already in USDC, which is approximately equal to USD
      return kalePrice;
    } catch (error) {
      console.error('❌ [PriceService] Error fetching KALE price in USD:', error);
      // Fallback to simulated price in USD
      const fallbackPrice = 0.000385;
      console.log('🔄 [PriceService] Using USD fallback price:', fallbackPrice);
      return fallbackPrice;
    }
  }

  /**
   * Converts KALE value to USD
   */
  static async convertKaleToUSD(kaleAmount: number): Promise<number> {
    const price = await this.getKalePriceUSD();
    return kaleAmount * price;
  }

  /**
   * Converts USD value to KALE
   */
  static async convertUSDToKale(usdAmount: number): Promise<number> {
    const price = await this.getKalePrice();
    return usdAmount / price;
  }

  /**
   * Formats price for display
   */
  static formatPrice(price: number): string {
    if (price < 0.001) {
      return price.toFixed(6);
    } else if (price < 1) {
      return price.toFixed(4);
    } else {
      return price.toFixed(2);
    }
  }
}

export default PriceService;