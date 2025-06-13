import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { AvailabilityRequest, AvailabilityResponse, Room } from './types';

export class JeromeGrandScraperFixed {
  private baseUrl = 'https://live.ipms247.com';
  private hotelId = '10246';
  private sessionCookies = '';

  private getAjaxHeaders() {
    const timestamp = Date.now();
    return {
      'Accept': 'text/html, */*; q=0.01',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Connection': 'keep-alive',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'DNT': '1',
      'Origin': 'https://live.ipms247.com',
      'Priority': 'u=1, i',
      'Referer': 'https://live.ipms247.com/booking/book-rooms-jeromegrandhotel',
      'Sec-Ch-Ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"macOS"',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
      'X-Requested-With': 'XMLHttpRequest',
      'X-Cache-Bust': timestamp.toString(),
      'Cookie': this.sessionCookies
    };
  }

  private formatDateForRequest(dateString: string): string {
    // Convert YYYY-MM-DD to MM-DD-YYYY format for their API
    const [year, month, day] = dateString.split('-');
    return `${month}-${day}-${year}`;
  }

  private buildFormData(request: AvailabilityRequest) {
    const checkInFormatted = this.formatDateForRequest(request.checkIn);
    
    // Calculate number of nights
    const checkInDate = new Date(request.checkIn);
    const checkOutDate = new Date(request.checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const formData = new URLSearchParams({
      'checkin': checkInFormatted,
      'gridcolumn': '1',
      'adults': request.guests.toString(),
      'child': '0',
      'nonights': nights.toString(),
      'ShowSelectedNights': 'true',
      'DefaultSelectedNights': nights.toString(),
      'calendarDateFormat': 'mm-dd-yy',
      'rooms': '1',
      'promotion': '',
      'ArrvalDt': request.checkIn, // Note: they have a typo "ArrvalDt" not "ArrivalDt"
      'HotelId': this.hotelId,
      'isLogin': 'lf',
      'selectedLang': '',
      'modifysearch': 'false',
      'promotioncode': '',
      'layoutView': '2',
      'ShowMinNightsMatchedRatePlan': 'false',
      'LayoutTheme': '2',
      'w_showadult': 'false',
      'w_showchild_bb': 'false',
      'ShowMoreLessOpt': '',
      'w_showchild': 'true',
      'ischeckavailabilityclicked': '1'
    });

    return formData;
  }

  private async establishSession(): Promise<void> {
    try {
      console.log('🔐 Establishing FRESH session with Jerome Grand...');
      
      // Clear any existing cookies
      this.sessionCookies = '';
      
      // First, visit the booking page to get session cookies
      const sessionResponse = await axios.get(
        `${this.baseUrl}/booking/book-rooms-jeromegrandhotel?_t=${Date.now()}`, // Cache bust
        {
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Connection': 'keep-alive',
            'Sec-Ch-Ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"macOS"',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'
          },
          timeout: 30000,
          maxRedirects: 5
        }
      );

      // Extract cookies from the response
      const setCookies = sessionResponse.headers['set-cookie'];
      if (setCookies) {
        this.sessionCookies = setCookies
          .map(cookie => cookie.split(';')[0])
          .join('; ');
        console.log('✅ Got FRESH session cookies:', this.sessionCookies.substring(0, 100) + '...');
      } else {
        console.log('⚠️  No session cookies received');
      }
      
    } catch (error: any) {
      console.error('❌ Failed to establish session:', error.message);
      throw error;
    }
  }

  private parseRoomData(html: string): Room[] {
    const $ = cheerio.load(html);
    const rooms: Room[] = [];

    // Look for the resgrid array in the HTML
    const scriptTags = $('script');
    let resgridData: any[] = [];

    scriptTags.each((i, script) => {
      const content = $(script).html();
      if (content && content.includes('resgrid')) {
        // Extract the resgrid array using regex
        const resgridMatch = content.match(/resgrid\s*=\s*(\[.*?\]);/s);
        if (resgridMatch) {
          try {
            resgridData = JSON.parse(resgridMatch[1]);
            console.log(`📊 Successfully parsed resgrid with ${resgridData.length} arrays`);
            
            // The structure is resgrid = [[...rooms...]]
            if (resgridData.length > 0 && Array.isArray(resgridData[0])) {
              resgridData = resgridData[0]; // Get the first (and only) array of rooms
              console.log(`🏠 Found ${resgridData.length} rooms in resgrid[0]`);
            }
          } catch (e) {
            console.error('Failed to parse resgrid data:', e);
          }
        }
      }
    });

    // Parse each room from resgrid data using CORRECT property names
    resgridData.forEach((roomData: any, index: number) => {
      if (roomData && typeof roomData === 'object') {
        const room: Room = {
          id: `jr-${index + 1}`,
          name: roomData.display_name || roomData.roomtype || `Room ${index + 1}`,
          price: parseFloat(roomData.day_base_1) || parseFloat(roomData.o_day_base_1) || 0,
          available: (parseInt(roomData.day_1) || 0) > 0,
          description: roomData.webdescription || '',
          amenities: [], // We can parse amenities later if needed
          inventoryCount: parseInt(roomData.day_1) || 0,
          images: roomData.roomimg ? [roomData.roomimg] : []
        };
        
        console.log(`  📋 Parsed room: ${room.name} - $${room.price} (${room.inventoryCount} available)`);
        rooms.push(room);
      }
    });

    // If no resgrid data found, try parsing from HTML structure (fallback)
    if (rooms.length === 0) {
      console.log('⚠️  No resgrid data found, trying HTML fallback parsing...');
      $('.room-item, .roomtype-item, [class*="room"]').each((i, element) => {
        const $room = $(element);
        const name = $room.find('.room-name, .roomtype-name, h3, h4').first().text().trim();
        const priceText = $room.find('[class*="price"], .amount').first().text();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

        if (name) {
          rooms.push({
            id: `jr-parsed-${i + 1}`,
            name,
            price,
            available: true, // Assume available if shown
            description: $room.find('.description, .room-desc').first().text().trim() || '',
            amenities: [],
            inventoryCount: 1,
            images: []
          });
        }
      });
    }

    return rooms;
  }

  async checkAvailability(request: AvailabilityRequest): Promise<AvailabilityResponse> {
    try {
      console.log(`🏨 Scraping Jerome Grand Hotel for ${request.checkIn} to ${request.checkOut}...`);
      console.log(`🕐 Current timestamp: ${new Date().toISOString()}`);
      
      // First establish a session
      await this.establishSession();
      
      const formData = this.buildFormData(request);
      const headers = this.getAjaxHeaders();
      
      console.log('📡 Making FRESH AJAX request with form data:');
      console.log(JSON.stringify(Object.fromEntries(formData), null, 2));
      console.log('📋 Key form parameters:');
      console.log(`  • Check-in (formatted): ${formData.get('checkin')}`);
      console.log(`  • Check-out date: ${formData.get('ArrvalDt')}`);
      console.log(`  • Nights: ${formData.get('nonights')}`);
      console.log(`  • Adults: ${formData.get('adults')}`);
      console.log(`  • Hotel ID: ${formData.get('HotelId')}`);

      const response = await axios.post(
        `${this.baseUrl}/booking/rmdetails?_t=${Date.now()}`, // Cache bust the URL too
        formData,
        { 
          headers,
          timeout: 30000,
          maxRedirects: 5
        }
      );

      console.log('✅ Got response, status:', response.status);
      console.log('📄 Response length:', response.data.length);
      console.log(`🕐 Response received at: ${new Date().toISOString()}`);

      // Save the full HTML response as source of truth
      const debugDir = path.join(__dirname, '..', '..', '..', '..', 'debug_responses');
      if (!fs.existsSync(debugDir)) {
        fs.mkdirSync(debugDir, { recursive: true });
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `jerome_${request.checkIn}_to_${request.checkOut}_${timestamp}.html`;
      const filepath = path.join(debugDir, filename);
      
      fs.writeFileSync(filepath, response.data, 'utf8');
      console.log(`💾 Saved full HTML source of truth: ${filepath}`);

      // Parse the room data from HTML response
      const allRooms = this.parseRoomData(response.data);
      
      // Filter rooms - only show those with 2+ inventory to avoid edge cases
      const availableRooms = allRooms.filter(room => {
        const hasGoodInventory = (room.inventoryCount || 0) >= 2;
        const isActuallyAvailable = room.available;
        return hasGoodInventory && isActuallyAvailable;
      });
      
      const filteredOutCount = allRooms.length - availableRooms.length;
      
      console.log(`🏠 Found ${allRooms.length} total rooms`);
      console.log(`🔍 Filtered to ${availableRooms.length} rooms (removed ${filteredOutCount} with low inventory)`);
      
      availableRooms.forEach(room => {
        console.log(`  - ${room.name}: $${room.price} (Available: ${room.available}, Inventory: ${room.inventoryCount})`);
      });

      return {
        hotelId: 'jerome-grand',
        rooms: availableRooms, // Return filtered rooms
        success: true,
        scrapedAt: new Date().toISOString(),
        sourceHtmlPath: filepath,
        totalRoomsFound: allRooms.length,
        roomsAfterFiltering: availableRooms.length
      };

    } catch (error: any) {
      console.error('❌ Scraping failed:', error.message);
      
      return {
        hotelId: 'jerome-grand',
        rooms: [],
        success: false,
        error: error.message,
        scrapedAt: new Date().toISOString()
      };
    }
  }
} 