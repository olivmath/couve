// Test file to verify if scrapers are working

import StellarExpertScraper from './lib/stellarExpertScraper';
import LumaScraper from './lib/lumaScraper';
import PriceService from './lib/priceService';

// Function to test the Stellar Expert scraper
export async function testStellarExpertScraper() {
  console.log('🔍 Testing StellarExpertScraper...');
  
  try {
    const poolData = await StellarExpertScraper.getPoolData();
    console.log('✅ Pool Data:', poolData);
    
    const kalePrice = await StellarExpertScraper.getKalePrice();
    console.log('✅ KALE Price:', kalePrice);
    
    return { success: true, poolData, kalePrice };
  } catch (error) {
    console.error('❌ Error in StellarExpertScraper:', error);
    return { success: false, error };
  }
}

// Function to test the Luma scraper
export async function testLumaScraper() {
  console.log('🔍 Testing LumaScraper...');
  
  try {
    const events = await LumaScraper.getEvents();
    console.log('✅ Events:', events);
    
    return { success: true, events };
  } catch (error) {
    console.error('❌ Error in LumaScraper:', error);
    return { success: false, error };
  }
}

// Function to test the updated PriceService
export async function testPriceService() {
  console.log('🔍 Testing PriceService...');
  
  try {
    const kalePriceBRL = await PriceService.getKalePrice();
    console.log('✅ KALE Price BRL:', kalePriceBRL);
    
    const kalePriceUSD = await PriceService.getKalePriceUSD();
    console.log('✅ KALE Price USD:', kalePriceUSD);
    
    const kalePriceFromPool = await PriceService.getKalePriceFromPool();
    console.log('✅ KALE Price from Pool:', kalePriceFromPool);
    
    return { success: true, kalePriceBRL, kalePriceUSD, kalePriceFromPool };
  } catch (error) {
    console.error('❌ Error in PriceService:', error);
    return { success: false, error };
  }
}

// Main function to run all tests
export async function runAllTests() {
  console.log('🚀 Starting scraper tests...');
  
  const stellarTest = await testStellarExpertScraper();
  const lumaTest = await testLumaScraper();
  const priceTest = await testPriceService();
  
  console.log('📊 Test results:');
  console.log('- StellarExpertScraper:', stellarTest.success ? '✅' : '❌');
  console.log('- LumaScraper:', lumaTest.success ? '✅' : '❌');
  console.log('- PriceService:', priceTest.success ? '✅' : '❌');
  
  return {
    stellar: stellarTest,
    luma: lumaTest,
    price: priceTest
  };
}

// Run tests automatically if this file is imported
if (typeof window !== 'undefined') {
  // Run tests after 2 seconds to give the application time to load
  setTimeout(() => {
    runAllTests();
  }, 2000);
}