import React, { useState, useEffect } from 'react';
import { useWalletStore } from '../stores/useWalletStore';
import PriceService from '../lib/priceService';
import StellarExpertScraper from '../lib/stellarExpertScraper';

const PriceDebugger: React.FC = () => {
  const { kaleToBRL, kaleToUSD, updateKalePrice } = useWalletStore();
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const testPriceServices = async () => {
    setIsLoading(true);
    const results: any = {};
    
    try {
      console.log('🔍 [PriceDebugger] Iniciando testes de preços...');
      
      // Testar conectividade com a API do Stellar Expert
      console.log('🌐 [PriceDebugger] Testando conectividade com Stellar Expert API...');
      try {
        const testResponse = await fetch('https://api.stellar.expert/explorer/public/liquidity-pool/cf227a44e39d7cff8c927bc48c9b4c03b06ec76c9da8dde9ae6930888b583a68');
        results.apiConnectivity = {
          status: testResponse.status,
          ok: testResponse.ok,
          statusText: testResponse.statusText
        };
        console.log('🌐 [PriceDebugger] Status da API:', results.apiConnectivity);
      } catch (apiError) {
        results.apiConnectivity = { error: apiError };
        console.error('❌ [PriceDebugger] Erro de conectividade:', apiError);
      }
      
      // Testar StellarExpertScraper
      console.log('📡 [PriceDebugger] Testando StellarExpertScraper...');
      const poolData = await StellarExpertScraper.getPoolData();
      results.poolData = poolData;
      console.log('✅ [PriceDebugger] Pool data:', poolData);
      
      // Testar PriceService.getKalePriceFromPool
      console.log('🏊 [PriceDebugger] Testando getKalePriceFromPool...');
      const kalePriceFromPool = await PriceService.getKalePriceFromPool();
      results.kalePriceFromPool = kalePriceFromPool;
      console.log('✅ [PriceDebugger] Preço do pool:', kalePriceFromPool);
      
      // Testar PriceService.getKalePriceUSD
      console.log('💵 [PriceDebugger] Testando getKalePriceUSD...');
      const kalePriceUSD = await PriceService.getKalePriceUSD();
      results.kalePriceUSD = kalePriceUSD;
      console.log('✅ [PriceDebugger] Preço USD:', kalePriceUSD);
      
      // Testar PriceService.getUsdToBrlPrice
      console.log('🇧🇷 [PriceDebugger] Testando getUsdToBrlPrice...');
      const usdToBrlPrice = await PriceService.getUsdToBrlPrice();
      results.usdToBrlPrice = usdToBrlPrice;
      console.log('✅ [PriceDebugger] Taxa USD/BRL:', usdToBrlPrice);
      
      // Testar PriceService.getKalePrice (BRL)
      console.log('🥬 [PriceDebugger] Testando getKalePrice (BRL)...');
      const kalePriceBRL = await PriceService.getKalePrice();
      results.kalePriceBRL = kalePriceBRL;
      console.log('✅ [PriceDebugger] Preço BRL:', kalePriceBRL);
      
      // Calcular preços manualmente para comparação
      results.manualCalculation = {
        kaleUSD: kalePriceFromPool,
        usdBRL: usdToBrlPrice,
        kaleBRL: kalePriceFromPool * usdToBrlPrice
      };
      
      setDebugInfo(results);
      
    } catch (error) {
      console.error('❌ [PriceDebugger] Erro nos testes:', error);
      results.error = error;
      setDebugInfo(results);
    } finally {
      setIsLoading(false);
    }
  };

  const testUpdateKalePrice = async () => {
    console.log('🔄 [PriceDebugger] Testando updateKalePrice...');
    console.log('📊 [PriceDebugger] Preços antes:', { kaleToBRL, kaleToUSD });
    
    await updateKalePrice();
    
    // Aguardar um pouco para o estado atualizar
    setTimeout(() => {
      console.log('📊 [PriceDebugger] Preços depois:', { kaleToBRL, kaleToUSD });
    }, 100);
  };

  useEffect(() => {
    // Executar teste inicial
    testPriceServices();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-red-200 mb-4">
      <h3 className="text-lg font-bold text-red-600 mb-3">🐛 Price Debugger</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-semibold text-gray-700">Store Values:</h4>
          <p className="text-sm">KALE → BRL: {kaleToBRL}</p>
          <p className="text-sm">KALE → USD: {kaleToUSD}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-700">Actions:</h4>
          <button 
            onClick={testPriceServices}
            disabled={isLoading}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm mr-2 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Services'}
          </button>
          <button 
            onClick={testUpdateKalePrice}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm"
          >
            Update Prices
          </button>
        </div>
      </div>
      
      {debugInfo && Object.keys(debugInfo).length > 0 && (
        <div className="bg-gray-100 p-3 rounded text-xs">
          <h4 className="font-semibold mb-2">Debug Results:</h4>
          <pre className="whitespace-pre-wrap overflow-auto max-h-40">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default PriceDebugger;