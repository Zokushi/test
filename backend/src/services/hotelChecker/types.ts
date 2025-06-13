// Input type for availability check
export interface AvailabilityRequest {
  checkIn: string;  // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
}

// Response type for available rooms
export interface Room {
  id: string;
  name: string;
  price: number;
  available: boolean;
  description?: string;
  amenities?: string[];
  inventoryCount?: number;
  images?: string[];
}

// Response type with success tracking
export interface AvailabilityResponse {
  hotelId: string;
  rooms: Room[];
  success: boolean;
  error?: string;
  scrapedAt?: string;
  sourceHtmlPath?: string;
  totalRoomsFound?: number;
  roomsAfterFiltering?: number;
}

export interface HotelChecker {
  checkAvailability(request: AvailabilityRequest): Promise<AvailabilityResponse>;
} 