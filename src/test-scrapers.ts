// Arquivo de teste para verificar se os scrapers estão funcionando

import StellarExpertScraper from './lib/stellarExpertScraper';
import LumaScraper from './lib/lumaScraper';
import PriceService from './lib/priceService';

// Função para testar o scraper do Stellar Expert
export async function testStellarExpertScraper() {
  console.log('🔍 Testando StellarExpertScraper...');
  
  try {
    const poolData = await StellarExpertScraper.getPoolData();
    console.log('✅ Pool Data:', poolData);
    
    const kalePrice = await StellarExpertScraper.getKalePrice();
    console.log('✅ KALE Price:', kalePrice);
    
    return { success: true, poolData, kalePrice };
  } catch (error) {
    console.error('❌ Erro no StellarExpertScraper:', error);
    return { success: false, error };
  }
}

// Função para testar o scraper do Luma
export async function testLumaScraper() {
  console.log('🔍 Testando LumaScraper...');
  
  try {
    const events = await LumaScraper.getEvents();
    console.log('✅ Events:', events);
    
    return { success: true, events };
  } catch (error) {
    console.error('❌ Erro no LumaScraper:', error);
    return { success: false, error };
  }
}

// Função para testar o PriceService atualizado
export async function testPriceService() {
  console.log('🔍 Testando PriceService...');
  
  try {
    const kalePriceBRL = await PriceService.getKalePrice();
    console.log('✅ KALE Price BRL:', kalePriceBRL);
    
    const kalePriceUSD = await PriceService.getKalePriceUSD();
    console.log('✅ KALE Price USD:', kalePriceUSD);
    
    const kalePriceFromPool = await PriceService.getKalePriceFromPool();
    console.log('✅ KALE Price from Pool:', kalePriceFromPool);
    
    return { success: true, kalePriceBRL, kalePriceUSD, kalePriceFromPool };
  } catch (error) {
    console.error('❌ Erro no PriceService:', error);
    return { success: false, error };
  }
}

// Função principal para executar todos os testes
export async function runAllTests() {
  console.log('🚀 Iniciando testes dos scrapers...');
  
  const stellarTest = await testStellarExpertScraper();
  const lumaTest = await testLumaScraper();
  const priceTest = await testPriceService();
  
  console.log('📊 Resultados dos testes:');
  console.log('- StellarExpertScraper:', stellarTest.success ? '✅' : '❌');
  console.log('- LumaScraper:', lumaTest.success ? '✅' : '❌');
  console.log('- PriceService:', priceTest.success ? '✅' : '❌');
  
  return {
    stellar: stellarTest,
    luma: lumaTest,
    price: priceTest
  };
}

// Executar testes automaticamente se este arquivo for importado
if (typeof window !== 'undefined') {
  // Executar testes após 2 segundos para dar tempo da aplicação carregar
  setTimeout(() => {
    runAllTests();
  }, 2000);
}