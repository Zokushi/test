const axios = require('axios');

async function testJeromeGrandAPI() {
  try {
    console.log('🏨 Testing Jerome Grand Hotel API...');
    
    // Form data from your network tab
    const formData = new URLSearchParams({
      'checkin': '06-05-2025',
      'gridcolumn': '1',
      'adults': '1',
      'child': '0',
      'nonights': '1',
      'ShowSelectedNights': 'true',
      'DefaultSelectedNights': '1',
      'calendarDateFormat': 'mm-dd-yy',
      'rooms': '1',
      'promotion': '',
      'ArrivalDt': '2025-06-05',
      'HotelId': '10246',
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

    const response = await axios.post('https://live.ipms247.com/booking/rmdetails', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    console.log('✅ Response Status:', response.status);
    console.log('📄 Response Length:', response.data.length, 'characters');
    
    // Look for the room data in the response
    if (response.data.includes('resgrid')) {
      console.log('🎯 Found resgrid data in response!');
      
      // Extract just the resgrid array
      const resgridMatch = response.data.match(/var resgrid=(\[.*?\]);/s);
      if (resgridMatch) {
        const roomData = JSON.parse(resgridMatch[1]);
        console.log('🏨 Found', roomData[0].length, 'rooms:');
        
        roomData[0].forEach((room, index) => {
          console.log(`${index + 1}. ${room.display_name} - $${room.day_base_1}/night - ${room.MulRoomInventory} available`);
        });
      }
    } else {
      console.log('❌ No room data found in response');
      console.log('First 500 characters:', response.data.substring(0, 500));
    }

  } catch (error) {
    console.error('❌ API Call failed:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testJeromeGrandAPI(); 