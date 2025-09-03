// Serviço para fazer scraping dos dados do Stellar Expert

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
   * Busca dados do pool KALE/USDC via scraping
   */
  static async getPoolData(): Promise<PoolData> {
    try {
      console.log('🌐 [StellarExpertScraper] Fazendo requisição para API do Stellar Expert...');
      
      // Como não podemos fazer scraping direto do browser devido ao CORS,
      // vamos usar uma abordagem alternativa com a API do Stellar Expert
      const apiUrl = `https://api.stellar.expert/explorer/public/liquidity-pool/cf227a44e39d7cff8c927bc48c9b4c03b06ec76c9da8dde9ae6930888b583a68`;
      console.log('🔗 [StellarExpertScraper] URL da API:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('📡 [StellarExpertScraper] Status da resposta:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Falha ao buscar dados do pool: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📋 [StellarExpertScraper] Dados brutos da API:', data);
      
      // Extrair dados relevantes da resposta da API
      const reserves = data.reserves || [];
      console.log('💰 [StellarExpertScraper] Reservas encontradas:', reserves);
      
      const usdcReserve = reserves.find((r: any) => r.asset?.code === 'USDC');
      const kaleReserve = reserves.find((r: any) => r.asset?.code === 'KALE');
      
      console.log('💵 [StellarExpertScraper] Reserva USDC:', usdcReserve);
      console.log('🥬 [StellarExpertScraper] Reserva KALE:', kaleReserve);
      
      const usdcLiquidity = parseFloat(usdcReserve?.amount || '0');
      const kaleLiquidity = parseFloat(kaleReserve?.amount || '0');
      
      console.log('📊 [StellarExpertScraper] Liquidez USDC:', usdcLiquidity);
      console.log('📊 [StellarExpertScraper] Liquidez KALE:', kaleLiquidity);
      
      // Calcular preço KALE em USDC
      const kalePrice = usdcLiquidity > 0 && kaleLiquidity > 0 
        ? usdcLiquidity / kaleLiquidity 
        : 0;
      
      console.log('💎 [StellarExpertScraper] Preço KALE calculado:', kalePrice);
      
      // Validar se o preço calculado é razoável
      if (kalePrice <= 0 || kalePrice > 1) {
        console.warn('⚠️ [StellarExpertScraper] Preço KALE suspeito:', kalePrice, 'usando fallback');
        throw new Error(`Preço KALE inválido: ${kalePrice}`);
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
      
      console.log('✅ [StellarExpertScraper] Dados finais do pool:', poolData);
      return poolData;
    } catch (error) {
      console.error('❌ [StellarExpertScraper] Erro ao buscar dados do pool:', error);
      
      // Fallback: tentar scraping via proxy ou usar dados estáticos
      console.log('🔄 [StellarExpertScraper] Tentando fallback...');
      return this.getFallbackPoolData();
    }
  }
  
  /**
   * Tenta fazer scraping via proxy ou retorna dados estáticos como fallback
   */
  private static async getFallbackPoolData(): Promise<PoolData> {
    try {
      // Tentar usar um proxy CORS para fazer scraping
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(this.POOL_URL)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error('Proxy falhou');
      }
      
      const data = await response.json();
      const html = data.contents;
      
      // Fazer parsing do HTML para extrair dados
      const poolData = this.parsePoolDataFromHTML(html);
      return poolData;
    } catch (error) {
      console.error('Fallback também falhou:', error);
      
      // Retornar dados estáticos baseados na última consulta conhecida
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
   * Faz parsing dos dados do HTML
   */
  private static parsePoolDataFromHTML(html: string): PoolData {
    try {
      // Usar regex para extrair dados específicos do HTML
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
      console.error('Erro ao fazer parsing do HTML:', error);
      
      // Retornar dados padrão em caso de erro
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
   * Busca apenas o preço do KALE em USDC
   */
  static async getKalePrice(): Promise<number> {
    const poolData = await this.getPoolData();
    return poolData.kalePrice;
  }
}

export default StellarExpertScraper;