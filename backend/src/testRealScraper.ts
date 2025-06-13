import { JeromeGrandScraper } from './services/hotelChecker/jeromeGrandScraper';
import { AvailabilityRequest } from './services/hotelChecker/types';

async function testJeromeGrandScraper() {
  console.log('🎯 Testing Real Jerome Grand Hotel Scraper');
  console.log('='.repeat(50));
  
  const scraper = new JeromeGrandScraper();
  
  const testRequest: AvailabilityRequest = {
    checkIn: '2025-10-01',
    checkOut: '2025-10-02', 
    guests: 2
  };

  console.log(`📅 Testing dates: ${testRequest.checkIn} to ${testRequest.checkOut}`);
  console.log(`👥 Guests: ${testRequest.guests}`);
  console.log('');

  try {
    const result = await scraper.checkAvailability(testRequest);
    
    console.log('🎉 SCRAPER RESULTS:');
    console.log('='.repeat(30));
    console.log(`✅ Success: ${result.success}`);
    console.log(`🏨 Hotel ID: ${result.hotelId}`);
    console.log(`🏠 Rooms Found: ${result.rooms.length}`);
    console.log(`🕐 Scraped At: ${result.scrapedAt}`);
    
    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
    }
    
    console.log('');
    console.log('🏠 ROOM DETAILS:');
    console.log('-'.repeat(40));
    
    result.rooms.forEach((room, index) => {
      console.log(`\n${index + 1}. ${room.name}`);
      console.log(`   💰 Price: $${room.price}`);
      console.log(`   ✅ Available: ${room.available}`);
      console.log(`   📦 Inventory: ${room.inventoryCount || 'N/A'}`);
      if (room.description) {
        console.log(`   📝 Description: ${room.description.substring(0, 100)}...`);
      }
      if (room.amenities && room.amenities.length > 0) {
        console.log(`   🎯 Amenities: ${room.amenities.join(', ')}`);
      }
    });
    
    if (result.rooms.length === 0) {
      console.log('⚠️  No rooms found - this might mean:');
      console.log('   - No availability for these dates');
      console.log('   - Scraping didn\'t work as expected');
      console.log('   - Hotel changed their HTML structure');
    }
    
  } catch (error: any) {
    console.error('💥 Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testJeromeGrandScraper().then(() => {
  console.log('\n✨ Test completed!');
  process.exit(0);
}).catch(error => {
  console.error('\n💥 Test crashed:', error);
  process.exit(1);
}); 