// Service for scraping Stellar Expert data

interface PoolData {
  totalValueLocked: number;
  usdcLiquidity: number;
  kaleLiquidity: number;
  kalePrice: number;
  poolFee: number;
  trades: number;
  participants: number;
}

export class StellarExpertScraper {
  private static readonly POOL_URL = 'https://stellar.expert/explorer/public/liquidity-pool/cf227a44e39d7cff8c927bc48c9b4c03b06ec76c9da8dde9ae6930888b583a68';
  
  /**
   * Fetches KALE/USDC pool data via scraping
   */
  static async getPoolData(): Promise<PoolData> {
    try {
      console.log('🌐 [StellarExpertScraper] Making request to Stellar Expert API...');
      
      // Since we can't do direct scraping from browser due to CORS,
      // we'll use an alternative approach with Stellar Expert API
      const apiUrl = `https://api.stellar.expert/explorer/public/liquidity-pool/cf227a44e39d7cff8c927bc48c9b4c03b06ec76c9da8dde9ae6930888b583a68`;
      console.log('🔗 [StellarExpertScraper] API URL:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('📡 [StellarExpertScraper] Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch pool data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📋 [StellarExpertScraper] Raw API data:', data);
      
      // Extract relevant data from API response
      const reserves = data.reserves || [];
      console.log('💰 [StellarExpertScraper] Reserves found:', reserves);
      
      const usdcReserve = reserves.find((r: any) => r.asset?.code === 'USDC');
      const kaleReserve = reserves.find((r: any) => r.asset?.code === 'KALE');
      
      console.log('💵 [StellarExpertScraper] Reserva USDC:', usdcReserve);
      console.log('🥬 [StellarExpertScraper] Reserva KALE:', kaleReserve);
      
      const usdcLiquidity = parseFloat(usdcReserve?.amount || '0');
      const kaleLiquidity = parseFloat(kaleReserve?.amount || '0');
      
      console.log('📊 [StellarExpertScraper] USDC Liquidity:', usdcLiquidity);
      console.log('📊 [StellarExpertScraper] KALE Liquidity:', kaleLiquidity);
      
      // Calculate KALE price in USDC
      const kalePrice = usdcLiquidity > 0 && kaleLiquidity > 0 
        ? usdcLiquidity / kaleLiquidity 
        : 0;
      
      console.log('💎 [StellarExpertScraper] Calculated KALE price:', kalePrice);
      
      // Validate if calculated price is reasonable
      if (kalePrice <= 0 || kalePrice > 1) {
        console.warn('⚠️ [StellarExpertScraper] Suspicious KALE price:', kalePrice, 'using fallback');
        throw new Error(`Invalid KALE price: ${kalePrice}`);
      }
      
      const poolData = {
        totalValueLocked: data.total_value_locked || 0,
        usdcLiquidity,
        kaleLiquidity,
        kalePrice,
        poolFee: data.fee || 0.003, // 0.3%
        trades: data.trades_count || 0,
        participants: data.accounts_count || 0
      };
      
      console.log('✅ [StellarExpertScraper] Final pool data:', poolData);
      return poolData;
    } catch (error) {
      console.error('❌ [StellarExpertScraper] Error fetching pool data:', error);
      
      // Fallback: try scraping via proxy or use static data
      console.log('🔄 [StellarExpertScraper] Trying fallback...');
      return this.getFallbackPoolData();
    }
  }
  
  /**
   * Tries scraping via proxy or returns static data as fallback
   */
  private static async getFallbackPoolData(): Promise<PoolData> {
    try {
      // Try using a CORS proxy for scraping
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(this.POOL_URL)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error('Proxy failed');
      }
      
      const data = await response.json();
      const html = data.contents;
      
      // Parse HTML to extract data
      const poolData = this.parsePoolDataFromHTML(html);
      return poolData;
    } catch (error) {
      console.error('Fallback also failed:', error);
      
      // Return static data based on last known query
      return {
        totalValueLocked: 3557,
        usdcLiquidity: 1776,
        kaleLiquidity: 4615941,
        kalePrice: 1776 / 4615941, // ~0.000385
        poolFee: 0.003,
        trades: 21013,
        participants: 4
      };
    }
  }
  
  /**
   * Parses data from HTML
   */
  private static parsePoolDataFromHTML(html: string): PoolData {
    try {
      // Use regex to extract specific data from HTML
      const tvlMatch = html.match(/Total value locked:[^~]*~([\d,]+)\s*USD/);
      const usdcMatch = html.match(/([\d,]+(?:\.\d+)?)\s*USDC/);
      const kaleMatch = html.match(/([\d,]+(?:\.\d+)?)\s*KALE/);
      const tradesMatch = html.match(/Trades:([\d,]+)/);
      const participantsMatch = html.match(/Participants:([\d,]+)/);
      
      const tvl = tvlMatch ? parseFloat(tvlMatch[1].replace(/,/g, '')) : 3557;
      const usdcLiquidity = usdcMatch ? parseFloat(usdcMatch[1].replace(/,/g, '')) : 1776;
      const kaleLiquidity = kaleMatch ? parseFloat(kaleMatch[1].replace(/,/g, '')) : 4615941;
      const trades = tradesMatch ? parseInt(tradesMatch[1].replace(/,/g, '')) : 21013;
      const participants = participantsMatch ? parseInt(participantsMatch[1].replace(/,/g, '')) : 4;
      
      const kalePrice = usdcLiquidity > 0 && kaleLiquidity > 0 
        ? usdcLiquidity / kaleLiquidity 
        : 0.000385;
      
      return {
        totalValueLocked: tvl,
        usdcLiquidity,
        kaleLiquidity,
        kalePrice,
        poolFee: 0.003,
        trades,
        participants
      };
    } catch (error) {
      console.error('Error parsing HTML:', error);
      
      // Return default data in case of error
      return {
        totalValueLocked: 3557,
        usdcLiquidity: 1776,
        kaleLiquidity: 4615941,
        kalePrice: 0.000385,
        poolFee: 0.003,
        trades: 21013,
        participants: 4
      };
    }
  }
  
  /**
   * Fetches only the KALE price in USDC
   */
  static async getKalePrice(): Promise<number> {
    const poolData = await this.getPoolData();
    return poolData.kalePrice;
  }
}

export default StellarExpertScraper;