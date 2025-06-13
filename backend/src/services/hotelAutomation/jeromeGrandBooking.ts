import puppeteer from 'puppeteer';
import { AvailabilityRequest } from '../hotelChecker/types';

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

export interface BookingAutomationResult {
  success: boolean;
  step: string;
  message: string;
  screenshots?: string[];
  finalUrl?: string;
  error?: string;
}

export class JeromeGrandBookingAutomation {
  private baseUrl = 'https://live.ipms247.com';

  async simulateBookingProcess(
    request: AvailabilityRequest, 
    roomId: string,
    formData: BookingFormData
  ): Promise<BookingAutomationResult> {
    
    let browser;
    const screenshots: string[] = [];
    
    try {
      console.log('🚀 Starting Jerome Grand booking automation...');
      
      // Launch browser
      browser = await puppeteer.launch({ 
        headless: false, // Set to false to see what's happening
        defaultViewport: { width: 1280, height: 720 }
      });
      
      const page = await browser.newPage();
      
      // Step 1: Navigate to booking page
      console.log('📍 Step 1: Navigating to booking page...');
      await page.goto(`${this.baseUrl}/booking/book-rooms-jeromegrandhotel`);
      await page.waitForSelector('input[name="checkin"]', { timeout: 10000 });
      
      // Take screenshot
      const screenshot1 = `booking_step1_${Date.now()}.png`;
      await page.screenshot({ path: `./debug_responses/${screenshot1}` as `${string}.png` });
      screenshots.push(screenshot1);
      
      // Step 2: Fill in dates and guest info
      console.log('📅 Step 2: Filling in check-in/check-out dates...');
      
      // Format dates for their input (MM-DD-YYYY)
      const checkInFormatted = this.formatDateForForm(request.checkIn);
      const checkOutFormatted = this.formatDateForForm(request.checkOut);
      
      // Fill date inputs
      await page.evaluate((checkIn, checkOut, adults) => {
        const checkInInput = document.querySelector('input[name="checkin"]') as HTMLInputElement;
        const checkOutInput = document.querySelector('input[name="checkout"]') as HTMLInputElement;
        const adultsSelect = document.querySelector('select[name="adults"]') as HTMLSelectElement;
        
        if (checkInInput) checkInInput.value = checkIn;
        if (checkOutInput) checkOutInput.value = checkOut;
        if (adultsSelect) adultsSelect.value = adults.toString();
        
      }, checkInFormatted, checkOutFormatted, request.guests);
      
      // Click "Check Availability"
      await page.click('button[type="submit"], input[type="submit"]');
      await page.waitForSelector('.vres-card, .room-item', { timeout: 15000 });
      
      // Take screenshot of available rooms
      const screenshot2 = `booking_step2_rooms_${Date.now()}.png`;
      await page.screenshot({ path: `./debug_responses/${screenshot2}` as `${string}.png` });
      screenshots.push(screenshot2);
      
      // Step 3: Find and click the specific room "Add Room" button
      console.log(`🏠 Step 3: Looking for room ID ${roomId} to add...`);
      
      const roomButtonClicked = await page.evaluate((targetRoomId) => {
        // Look for Add Room buttons and find the one for our target room
        const addRoomButtons = document.querySelectorAll('.vres-btn, .ad-rm, [id*="addroombut"]');
        
        for (const button of addRoomButtons) {
          // Find the room container this button belongs to
          const roomContainer = button.closest('.vres-card, .inner-row, .room-item');
          if (roomContainer) {
            const roomText = roomContainer.textContent || '';
            // You'd need to implement room matching logic here based on the roomId
            // For now, just click the first available "Add Room" button
            if (button.textContent?.includes('Add Room')) {
              (button as HTMLElement).click();
              return true;
            }
          }
        }
        return false;
      }, roomId);
      
      if (!roomButtonClicked) {
        throw new Error(`Could not find or click Add Room button for room ${roomId}`);
      }
      
      // Wait for next step (billing/booking form)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Take screenshot after clicking Add Room
      const screenshot3 = `booking_step3_after_add_${Date.now()}.png`;
      await page.screenshot({ path: `./debug_responses/${screenshot3}` as `${string}.png` });
      screenshots.push(screenshot3);
      
      // Step 4: Fill out booking form (if we reach billing page)
      console.log('📝 Step 4: Checking if booking form appeared...');
      
      const currentUrl = page.url();
      console.log(`📍 Current URL: ${currentUrl}`);
      
      // Check if we're on a booking/billing page
      const isOnBookingForm = currentUrl.includes('billing') || 
                             currentUrl.includes('booking') || 
                             await page.$('input[name="firstName"], input[name="email"]') !== null;
      
      if (isOnBookingForm) {
        console.log('✅ Reached booking form! (Stopping here for safety)');
        // We'll stop here for safety - don't actually submit booking
        
        const finalScreenshot = `booking_final_form_${Date.now()}.png`;
        await page.screenshot({ path: `./debug_responses/${finalScreenshot}` as `${string}.png` });
        screenshots.push(finalScreenshot);
        
        return {
          success: true,
          step: 'booking_form_reached',
          message: 'Successfully navigated to booking form. Stopped for safety.',
          screenshots,
          finalUrl: currentUrl
        };
      } else {
        return {
          success: true,
          step: 'room_selected',
          message: 'Room added but booking form not yet reached. May need additional steps.',
          screenshots,
          finalUrl: currentUrl
        };
      }
      
    } catch (error: any) {
      console.error('❌ Booking automation failed:', error.message);
      
      return {
        success: false,
        step: 'error',
        message: error.message,
        screenshots,
        error: error.message
      };
      
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }
  
  private formatDateForForm(dateString: string): string {
    // Convert YYYY-MM-DD to MM/DD/YYYY for form inputs
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
  }
} 