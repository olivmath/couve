// Configuração para Stellar Pubnet
const KALE_ASSET_CODE = 'KALE';
const KALE_ISSUER = 'GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE';
const HORIZON_SERVER = 'https://horizon.stellar.org';

// Importar o scraper do Stellar Expert
import StellarExpertScraper from './stellarExpertScraper';

// Interface para dados de preço
interface PriceData {
  price: number;
  timestamp: number;
}

export class PriceService {

  /**
   * Busca o preço do KALE em BRL usando dados dinâmicos do pool
   * Usa dados reais do pool KALE/USDC no Stellar Expert
   */
  static async getKalePrice(): Promise<number> {
    try {
      // 1. Buscar preço KALE/USDC via scraping dinâmico
      const kaleToUsdPrice = await this.getKalePriceFromPool();
      
      // 2. Buscar preço USD/BRL
      const usdToBrlPrice = await this.getUsdToBrlPrice();
      
      // 3. Calcular KALE -> BRL
      const kaleToBrlPrice = kaleToUsdPrice * usdToBrlPrice;
      
      return kaleToBrlPrice;
    } catch (error) {
      console.error('Erro ao buscar preço do KALE:', error);
      // Fallback para preço simulado em BRL
      return 0.42; // ~0.000385 USD * 5.5 USD/BRL
    }
  }

  /**
   * Busca o preço KALE/XLM usando StellarExpert API
   */
  static async getKaleToXlmPrice(): Promise<number> {
    try {
      // Usar StellarExpert API para buscar dados do mercado KALE/XLM
      const response = await fetch(
        `https://api.stellar.expert/explorer/public/asset/${KALE_ASSET_CODE}-${KALE_ISSUER}/markets`
      );
      
      if (!response.ok) {
        throw new Error('Falha ao buscar dados do mercado KALE');
      }
      
      const data = await response.json();
      
      // Procurar pelo par KALE/XLM
      const kaleXlmMarket = data._embedded?.records?.find((market: any) => 
        market.counter_asset_type === 'native' // XLM é o ativo nativo
      );
      
      if (kaleXlmMarket && kaleXlmMarket.last_price) {
        return parseFloat(kaleXlmMarket.last_price);
      }
      
      // Fallback: calcular baseado no pool de liquidez conhecido
      return this.getKalePriceFromPool();
    } catch (error) {
      console.error('Erro ao buscar preço KALE/XLM:', error);
      return this.getKalePriceFromPool();
    }
  }

  /**
   * Busca o preço XLM/BRL
   * Por enquanto usa conversão via USD (XLM/USD * USD/BRL)
   */
  static async getXlmToBrlPrice(): Promise<number> {
    try {
      // Buscar XLM/USD via CoinGecko ou similar
      const xlmUsdResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=stellar&vs_currencies=usd'
      );
      
      if (!xlmUsdResponse.ok) {
        throw new Error('Falha ao buscar preço XLM/USD');
      }
      
      const xlmUsdData = await xlmUsdResponse.json();
      const xlmToUsd = xlmUsdData.stellar?.usd || 0.1; // Fallback
      
      // Buscar USD/BRL
      const usdToBrl = await this.getUsdToBrlPrice();
      
      return xlmToUsd * usdToBrl;
    } catch (error) {
      console.error('Erro ao buscar preço XLM/BRL:', error);
      // Fallback: XLM ≈ $0.1 * 5.5 BRL/USD = 0.55 BRL
      return 0.55;
    }
  }

  /**
   * Busca o preço USD/BRL usando API externa
   */
  static async getUsdToBrlPrice(): Promise<number> {
    try {
      // Usar CoinGecko para buscar USD/BRL
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=usd&vs_currencies=brl'
      );
      
      if (!response.ok) {
        // Tentar API alternativa
        const altResponse = await fetch(
          'https://api.exchangerate-api.com/v4/latest/USD'
        );
        
        if (altResponse.ok) {
          const altData = await altResponse.json();
          return altData.rates?.BRL || 5.5;
        }
        
        throw new Error('Falha ao buscar preço USD/BRL');
      }
      
      const data = await response.json();
      const usdToBrl = data.usd?.brl || 5.5; // Fallback
      
      return usdToBrl;
    } catch (error) {
      console.error('Erro ao buscar preço USD/BRL:', error);
      // Fallback para taxa aproximada atual
      return 5.5; // Taxa aproximada USD/BRL
    }
  }

  /**
   * Busca o preço do KALE usando dados do pool de liquidez
   * Baseado nas informações do pool KALE/USDC
   */
  static async getKalePriceFromPool(): Promise<number> {
    try {
      // Buscar dados dinâmicos do pool via scraping
      const poolData = await StellarExpertScraper.getPoolData();
      
      // Retornar o preço calculado dinamicamente
      return poolData.kalePrice;
    } catch (error) {
      console.error('Erro ao buscar preço do pool:', error);
      return 0.000385; // Fallback
    }
  }

  /**
   * Busca o preço do KALE em USD usando dados dinâmicos do pool
   */
  static async getKalePriceUSD(): Promise<number> {
    try {
      // Usar dados dinâmicos do pool KALE/USDC diretamente
      const kalePrice = await this.getKalePriceFromPool();
      
      // O preço já está em USDC, que é aproximadamente igual a USD
      return kalePrice;
    } catch (error) {
      console.error('Erro ao buscar preço do KALE em USD:', error);
      // Fallback para preço simulado em USD
      return 0.000385;
    }
  }

  /**
   * Converte valor em KALE para USD
   */
  static async convertKaleToUSD(kaleAmount: number): Promise<number> {
    const price = await this.getKalePriceUSD();
    return kaleAmount * price;
  }

  /**
   * Converte valor em USD para KALE
   */
  static async convertUSDToKale(usdAmount: number): Promise<number> {
    const price = await this.getKalePrice();
    return usdAmount / price;
  }

  /**
   * Formata o preço para exibição
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