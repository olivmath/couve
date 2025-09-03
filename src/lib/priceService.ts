// Importar o scraper do Stellar Expert
import StellarExpertScraper from './stellarExpertScraper';
import { getKaleConfig } from './kaleConfig';

// Função para obter configuração da rede atual
// Como este é um serviço estático, vamos usar mainnet como padrão
const getNetworkConfig = () => {
  return getKaleConfig('mainnet');
};

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
      console.log('🔍 [PriceService] Iniciando busca do preço KALE em BRL...');
      
      // 1. Buscar preço KALE/USDC via scraping dinâmico
      const kaleToUsdPrice = await this.getKalePriceFromPool();
      console.log('💰 [PriceService] Preço KALE/USD do pool:', kaleToUsdPrice);
      
      // Validar preço USD
      if (!kaleToUsdPrice || kaleToUsdPrice <= 0) {
        console.error('❌ [PriceService] Preço KALE/USD inválido:', kaleToUsdPrice);
        throw new Error(`Preço KALE/USD inválido: ${kaleToUsdPrice}`);
      }
      
      // 2. Buscar preço USD/BRL
      const usdToBrlPrice = await this.getUsdToBrlPrice();
      console.log('💱 [PriceService] Taxa USD/BRL:', usdToBrlPrice);
      
      // Validar taxa USD/BRL
      if (!usdToBrlPrice || usdToBrlPrice <= 0) {
        console.error('❌ [PriceService] Taxa USD/BRL inválida:', usdToBrlPrice);
        throw new Error(`Taxa USD/BRL inválida: ${usdToBrlPrice}`);
      }
      
      // 3. Calcular KALE -> BRL
      const kaleToBrlPrice = kaleToUsdPrice * usdToBrlPrice;
      console.log('🥬 [PriceService] Preço final KALE/BRL:', kaleToBrlPrice);
      
      // Validar preço final
      if (!kaleToBrlPrice || kaleToBrlPrice <= 0) {
        console.error('❌ [PriceService] Preço final KALE/BRL inválido:', kaleToBrlPrice);
        throw new Error(`Preço final KALE/BRL inválido: ${kaleToBrlPrice}`);
      }
      
      return kaleToBrlPrice;
    } catch (error) {
      console.error('❌ [PriceService] Erro ao buscar preço do KALE:', error);
      // Fallback para preço simulado em BRL
      const fallbackPrice = 0.42; // ~0.000385 USD * 5.5 USD/BRL
      console.log('🔄 [PriceService] Usando preço fallback:', fallbackPrice);
      return fallbackPrice;
    }
  }

  /**
   * Busca o preço KALE/XLM usando StellarExpert API
   */
  static async getKaleToXlmPrice(): Promise<number> {
    try {
      const config = getNetworkConfig();
      // Usar StellarExpert API para buscar dados do mercado KALE/XLM
      const response = await fetch(
        `https://api.stellar.expert/explorer/public/asset/${config.ASSET_CODE}-${config.ISSUER}/markets`
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
      console.log('🏊 [PriceService] Buscando dados do pool KALE/USDC...');
      
      // Buscar dados dinâmicos do pool via scraping
      const poolData = await StellarExpertScraper.getPoolData();
      console.log('📊 [PriceService] Dados do pool obtidos:', poolData);
      
      // Validar dados do pool
      if (!poolData || typeof poolData.kalePrice !== 'number' || poolData.kalePrice <= 0) {
        console.error('❌ [PriceService] Dados do pool inválidos:', poolData);
        throw new Error(`Dados do pool inválidos: ${JSON.stringify(poolData)}`);
      }
      
      // Retornar o preço calculado dinamicamente
      console.log('💎 [PriceService] Preço KALE do pool:', poolData.kalePrice);
      return poolData.kalePrice;
    } catch (error) {
      console.error('❌ [PriceService] Erro ao buscar preço do pool:', error);
      const fallbackPrice = 0.000385; // Fallback
      console.log('🔄 [PriceService] Usando preço fallback do pool:', fallbackPrice);
      return fallbackPrice;
    }
  }

  /**
   * Busca o preço do KALE em USD usando dados dinâmicos do pool
   */
  static async getKalePriceUSD(): Promise<number> {
    try {
      console.log('🔍 [PriceService] Iniciando busca do preço KALE em USD...');
      
      // Usar dados dinâmicos do pool KALE/USDC diretamente
      const kalePrice = await this.getKalePriceFromPool();
      console.log('💰 [PriceService] Preço KALE/USD obtido:', kalePrice);
      
      // Validar preço
      if (!kalePrice || kalePrice <= 0) {
        console.error('❌ [PriceService] Preço KALE/USD inválido:', kalePrice);
        throw new Error(`Preço KALE/USD inválido: ${kalePrice}`);
      }
      
      // O preço já está em USDC, que é aproximadamente igual a USD
      return kalePrice;
    } catch (error) {
      console.error('❌ [PriceService] Erro ao buscar preço do KALE em USD:', error);
      // Fallback para preço simulado em USD
      const fallbackPrice = 0.000385;
      console.log('🔄 [PriceService] Usando preço fallback USD:', fallbackPrice);
      return fallbackPrice;
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