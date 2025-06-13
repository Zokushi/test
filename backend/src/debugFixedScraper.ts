import { JeromeGrandScraperFixed } from './services/hotelChecker/jeromeGrandScraperFixed';
import { AvailabilityRequest } from './services/hotelChecker/types';
import * as fs from 'fs';
import * as path from 'path';

async function debugFixedScraper() {
  console.log('🔍 DEBUG: Fixed Jerome Grand Hotel Scraper');
  console.log('='.repeat(50));
  
  const scraper = new JeromeGrandScraperFixed();
  
  const testRequest: AvailabilityRequest = {
    checkIn: '2025-10-01',
    checkOut: '2025-10-02', 
    guests: 2
  };

  console.log(`📅 Testing dates: ${testRequest.checkIn} to ${testRequest.checkOut}`);
  console.log(`👥 Guests: ${testRequest.guests}`);
  console.log('');

  try {
    // Monkey patch the scraper to save HTML before parsing
    const originalCheckAvailability = scraper.checkAvailability;
    
    // @ts-ignore - accessing private method for debugging
    scraper.checkAvailability = async function(request: AvailabilityRequest) {
      console.log('🔧 DEBUG: Intercepting successful scraper response...');
      
      // Call the original method but intercept before parsing
      try {
        console.log(`🏨 Scraping Jerome Grand Hotel for ${request.checkIn} to ${request.checkOut}...`);
        
        // Establish session (from original method)
        // @ts-ignore
        await this.establishSession();
        
        // @ts-ignore
        const formData = this.buildFormData(request);
        // @ts-ignore
        const headers = this.getAjaxHeaders();
        
        console.log('📡 Making AJAX request...');

        const axios = require('axios');
        const response = await axios.post(
          'https://live.ipms247.com/booking/rmdetails',
          formData,
          { 
            headers,
            timeout: 30000,
            maxRedirects: 5
          }
        );

        console.log('✅ Got response, status:', response.status);
        console.log('📄 Response length:', response.data.length);
        
        // Save the successful HTML response
        const debugDir = path.join(__dirname, '..', '..', 'debug_responses');
        if (!fs.existsSync(debugDir)) {
          fs.mkdirSync(debugDir, { recursive: true });
        }
        
        const filename = `jerome_successful_${Date.now()}.html`;
        const filepath = path.join(debugDir, filename);
        
        fs.writeFileSync(filepath, response.data, 'utf8');
        console.log(`💾 Saved successful HTML response to: ${filepath}`);
        
        // Log some key sections for analysis
        console.log('\n🔍 LOOKING FOR DATA PATTERNS:');
        console.log('-'.repeat(50));
        
        // Check for resgrid
        if (response.data.includes('resgrid')) {
          console.log('✅ Found "resgrid" in response');
          const resgridMatch = response.data.match(/resgrid\s*=\s*(\[.*?\]);/s);
          if (resgridMatch) {
            console.log('✅ Found resgrid array pattern');
            console.log('📊 Resgrid content preview:', resgridMatch[1].substring(0, 200) + '...');
          } else {
            console.log('❌ Could not extract resgrid array');
          }
        } else {
          console.log('❌ No "resgrid" found in response');
        }
        
        // Check for room-related keywords
        const roomKeywords = ['room', 'price', 'available', 'inventory'];
        roomKeywords.forEach(keyword => {
          const count = (response.data.match(new RegExp(keyword, 'gi')) || []).length;
          console.log(`📝 "${keyword}" appears ${count} times`);
        });
        
        // Check for JavaScript variables
        const jsVars = ['var ', 'let ', 'const ', 'window.'];
        jsVars.forEach(jsVar => {
          const count = (response.data.match(new RegExp(jsVar, 'g')) || []).length;
          console.log(`🔧 "${jsVar}" appears ${count} times`);
        });
        
        console.log('-'.repeat(50));
        
        // Still try to parse with current logic
        // @ts-ignore
        const rooms = this.parseRoomData(response.data);
        console.log(`🏠 Current parser found ${rooms.length} rooms`);
        
        return {
          hotelId: 'jerome-grand',
          rooms,
          success: true,
          scrapedAt: new Date().toISOString(),
          debugInfo: {
            responseLength: response.data.length,
            hasResgrid: response.data.includes('resgrid'),
            savedToFile: filepath
          }
        };
        
      } catch (error: any) {
        console.error('❌ Debug scraping failed:', error.message);
        return {
          hotelId: 'jerome-grand',
          rooms: [],
          success: false,
          error: error.message,
          scrapedAt: new Date().toISOString()
        };
      }
    };
    
    const result = await scraper.checkAvailability(testRequest);
    
    console.log('\n🎉 DEBUG RESULTS:');
    console.log('='.repeat(30));
    console.log(`✅ Success: ${result.success}`);
    console.log(`🏠 Rooms Found: ${result.rooms.length}`);
    
    if (result.rooms.length > 0) {
      console.log('\n📋 Room Details:');
      result.rooms.forEach((room, i) => {
        console.log(`  ${i+1}. ${room.name} - $${room.price} (Available: ${room.available})`);
      });
    }
    
  } catch (error: any) {
    console.error('💥 Debug test failed:', error.message);
  }
}

// Run the debug test
debugFixedScraper().then(() => {
  console.log('\n🔍 Debug completed! Check the saved HTML file for parsing improvements.');
  process.exit(0);
}).catch(error => {
  console.error('\n💥 Debug crashed:', error);
  process.exit(1);
}); 