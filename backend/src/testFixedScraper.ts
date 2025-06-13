import { JeromeGrandScraperFixed } from './services/hotelChecker/jeromeGrandScraperFixed';
import { AvailabilityRequest } from './services/hotelChecker/types';

async function testFixedScraper() {
  console.log('🎯 Testing FIXED Jerome Grand Hotel Scraper');
  console.log('='.repeat(50));
  
  const scraper = new JeromeGrandScraperFixed();
  
  const testRequest: AvailabilityRequest = {
    checkIn: '2025-12-01',
    checkOut: '2025-12-05', 
    guests: 2
  };

  // Calculate nights dynamically
  const checkInDate = new Date(testRequest.checkIn);
  const checkOutDate = new Date(testRequest.checkOut);
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

  console.log(`📅 Testing dates: ${testRequest.checkIn} to ${testRequest.checkOut}`);
  console.log(`👥 Guests: ${testRequest.guests}`);
  console.log(`🌙 Nights: ${nights} (calculated dynamically)`);
  console.log('');
  console.log('🔧 IMPROVEMENTS IN THIS VERSION:');
  console.log('  ✅ Session management with cookies');
  console.log('  ✅ Proper AJAX headers (X-Requested-With)');
  console.log('  ✅ Complete form data with all fields');
  console.log('  ✅ Correct Sec-Fetch headers for CORS');
  console.log('');

  try {
    const result = await scraper.checkAvailability(testRequest);
    
    console.log('🎉 FIXED SCRAPER RESULTS:');
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
      console.log(`   💰 Price: $${room.price} per night`);
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
      console.log('⚠️  Still no rooms found. Next steps to debug:');
      console.log('   1. Check if session establishment worked');
      console.log('   2. Save HTML response to see what we\'re getting');
      console.log('   3. Compare with your working browser request');
    } else {
      console.log('🎉 SUCCESS! We got room data from Jerome Grand Hotel!');
      console.log('');
      console.log('🔍 VERIFICATION STEPS:');
      console.log('   1. Visit: https://live.ipms247.com/booking/book-rooms-jeromegrandhotel');
      console.log('   2. Enter: Check-in Oct 5, 2025 → Check-out Oct 7, 2025');
      console.log('   3. Select: 2 Adults, 0 Children, 1 Room');
      console.log('   4. Compare results with what we scraped above');
      console.log('');
      console.log('📊 QUICK SUMMARY:');
      const availableRooms = result.rooms.filter(room => room.available);
      const totalInventory = result.rooms.reduce((sum, room) => sum + (room.inventoryCount || 0), 0);
      console.log(`   • Available room types: ${availableRooms.length}/${result.rooms.length}`);
      console.log(`   • Total rooms available: ${totalInventory}`);
      console.log(`   • Price range: $${Math.min(...result.rooms.map(r => r.price))} - $${Math.max(...result.rooms.map(r => r.price))} per night`);
    }
    
  } catch (error: any) {
    console.error('💥 Test failed with error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testFixedScraper().then(() => {
  console.log('\n✨ Fixed scraper test completed!');
  process.exit(0);
}).catch(error => {
  console.error('\n💥 Test crashed:', error);
  process.exit(1);
}); 