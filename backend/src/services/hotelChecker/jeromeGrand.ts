import { AvailabilityRequest, AvailabilityResponse, Room } from './types';

export class JeromeGrandChecker {
  async checkAvailability(request: AvailabilityRequest): Promise<AvailabilityResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data for available rooms
    const rooms: Room[] = [
      {
        id: 'jr-101',
        name: 'Classic Queen Room',
        price: 199,
        available: true
      },
      {
        id: 'jr-102',
        name: 'Deluxe King Room',
        price: 249,
        available: true
      },
      {
        id: 'jr-103',
        name: 'Suite with View',
        price: 349,
        available: false
      }
    ];

    return {
      hotelId: 'jerome-grand',
      rooms: rooms
    };
  }
} 