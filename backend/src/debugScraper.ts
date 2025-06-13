import { JeromeGrandScraper } from './services/hotelChecker/jeromeGrandScraper';
import { AvailabilityRequest } from './services/hotelChecker/types';
import * as fs from 'fs';
import * as path from 'path';

async function debugJeromeGrandScraper() {
  console.log('🔍 DEBUG: Jerome Grand Hotel Scraper');
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
    // Temporarily modify the scraper to save HTML
    const originalCheckAvailability = scraper.checkAvailability.bind(scraper);
    
    scraper.checkAvailability = async function(request: AvailabilityRequest) {
      console.log('🔧 DEBUG MODE: Intercepting scraper...');
      
      // Copy the private methods by accessing them
      const axios = require('axios');
      const baseUrl = 'https://live.ipms247.com';
      const hotelId = '10246';
      
      // Build form data (copy from scraper logic)
      const checkInFormatted = `10-01-2025`;
      const checkOutFormatted = `10-02-2025`;
      
      const formData = new URLSearchParams({
        'checkin': checkInFormatted,
        'gridcolumn': '1',
        'adults': request.guests.toString(),
        'child': '0',
        'nonights': '1',
        'ShowSelectedNights': 'true',
        'DefaultSelectedNights': '1',
        'calendarDateFormat': 'mm-dd-yy',
        'rooms': '1',
        'promotion': '',
        'ArrivalDt': request.checkIn,
        'HotelId': hotelId,
        'isLogin': 'lf',
        'selectedLang': '',
        'modifysearch': 'false',
        'promotioncode': '',
        'layoutView': '2',
        'ShowMinNightsMatchedRatePlan': 'false',
        'LayoutTheme': '2',
        'ShowPromotionalRate': 'false'
      });

      const headers = {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://live.ipms247.com',
        'Pragma': 'no-cache',
        'Referer': 'https://live.ipms247.com/booking/book-rooms-jeromegrandhotel',
        'Sec-Ch-Ua': '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
      };
      
      console.log('📡 Making debug request...');
      
      const response = await axios.post(
        `${baseUrl}/booking/rmdetails`,
        formData,
        { 
          headers,
          timeout: 30000,
          maxRedirects: 5
        }
      );
      
      console.log('✅ Got response, status:', response.status);
      console.log('📄 Response length:', response.data.length);
      
      // Save the HTML response to a file
      const debugDir = path.join(__dirname, '..', '..', 'debug_responses');
      if (!fs.existsSync(debugDir)) {
        fs.mkdirSync(debugDir, { recursive: true });
      }
      
      const filename = `jerome_debug_${Date.now()}.html`;
      const filepath = path.join(debugDir, filename);
      
      fs.writeFileSync(filepath, response.data, 'utf8');
      console.log(`💾 Saved HTML response to: ${filepath}`);
      
      // Also log first 500 characters
      console.log('🔍 First 500 characters of response:');
      console.log('-'.repeat(50));
      console.log(response.data.substring(0, 500));
      console.log('-'.repeat(50));
      
      // Check if it looks like an error page
      if (response.data.includes('error') || response.data.includes('Error') || response.data.includes('not found')) {
        console.log('⚠️  Response contains error keywords!');
      }
      
      // Check if it looks like a redirect
      if (response.data.includes('redirect') || response.data.includes('location.href')) {
        console.log('⚠️  Response looks like a redirect!');
      }
      
      return {
        hotelId: 'jerome-grand',
        rooms: [],
        success: false,
        error: 'Debug mode - check saved HTML file',
        scrapedAt: new Date().toISOString()
      };
    };
    
    const result = await scraper.checkAvailability(testRequest);
    
    console.log('\n🎉 DEBUG RESULTS:');
    console.log('='.repeat(30));
    console.log(`✅ Success: ${result.success}`);
    console.log(`❌ Error: ${result.error}`);
    console.log(`🕐 Scraped At: ${result.scrapedAt}`);
    
  } catch (error: any) {
    console.error('💥 Debug test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the debug test
debugJeromeGrandScraper().then(() => {
  console.log('\n🔍 Debug test completed! Check the saved HTML file.');
  process.exit(0);
}).catch(error => {
  console.error('\n💥 Debug test crashed:', error);
  process.exit(1);
}); 