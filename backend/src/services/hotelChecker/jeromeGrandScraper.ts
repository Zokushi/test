import axios from 'axios';
import * as cheerio from 'cheerio';
import { AvailabilityRequest, AvailabilityResponse, Room } from './types';

export class JeromeGrandScraper {
  private baseUrl = 'https://live.ipms247.com';
  private hotelId = '10246';

  private getHeaders() {
    return {
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
  }

  private formatDateForRequest(dateString: string): string {
    // Convert YYYY-MM-DD to MM-DD-YYYY format for their API
    const [year, month, day] = dateString.split('-');
    return `${month}-${day}-${year}`;
  }

  private buildFormData(request: AvailabilityRequest) {
    const checkInFormatted = this.formatDateForRequest(request.checkIn);
    const checkOutFormatted = this.formatDateForRequest(request.checkOut);
    
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
      'ArrivalDt': request.checkIn,
      'HotelId': this.hotelId,
      'isLogin': 'lf',
      'selectedLang': '',
      'modifysearch': 'false',
      'promotioncode': '',
      'layoutView': '2',
      'ShowMinNightsMatchedRatePlan': 'false',
      'LayoutTheme': '2',
      'ShowPromotionalRate': 'false'
    });

    return formData;
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
          } catch (e) {
            console.error('Failed to parse resgrid data:', e);
          }
        }
      }
    });

    // Parse each room from resgrid data
    resgridData.forEach((roomData: any, index: number) => {
      if (roomData && typeof roomData === 'object') {
        rooms.push({
          id: `jr-${index + 1}`,
          name: roomData.RoomTypeName || `Room ${index + 1}`,
          price: parseFloat(roomData.TotalAmount) || 0,
          available: roomData.InventoryCount > 0,
          description: roomData.RoomTypeDescription || '',
          amenities: roomData.RoomTypeAmenities || [],
          inventoryCount: roomData.InventoryCount || 0,
          images: roomData.RoomTypeImages || []
        });
      }
    });

    // If no resgrid data found, try parsing from HTML structure
    if (rooms.length === 0) {
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
      
      const formData = this.buildFormData(request);
      const headers = this.getHeaders();
      
      console.log('📡 Making request with form data:', Object.fromEntries(formData));

      const response = await axios.post(
        `${this.baseUrl}/booking/rmdetails`,
        formData,
        { 
          headers,
          timeout: 30000,
          maxRedirects: 5
        }
      );

      console.log('✅ Got response, status:', response.status);
      console.log('📄 Response length:', response.data.length);

      // Parse the room data from HTML response
      const rooms = this.parseRoomData(response.data);
      
      console.log(`🏠 Found ${rooms.length} rooms`);
      rooms.forEach(room => {
        console.log(`  - ${room.name}: $${room.price} (Available: ${room.available})`);
      });

      return {
        hotelId: 'jerome-grand',
        rooms,
        success: true,
        scrapedAt: new Date().toISOString()
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