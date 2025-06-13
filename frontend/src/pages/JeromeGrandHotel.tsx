import React, { useState } from 'react';
import DateRangePicker from '../components/DateRangePicker';
import GuestSelector from '../components/GuestSelector';
import axios from 'axios';

interface Room {
  id: string;
  name: string;
  price: number;
  available: number;
  description?: string;
  images?: string[];
  amenities?: string[];
  maxOccupancy?: number;
}

interface AvailabilityResponse {
  hotel: string;
  rooms: Room[];
  success: boolean;
  message?: string;
}

const JeromeGrandHotel: React.FC = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  // Jerome Grand Hotel information
  const hotelInfo = {
    name: "Jerome Grand Hotel",
    location: "Jerome, Arizona",
    description: "Historic luxury hotel in the heart of Jerome's mining district. Experience old-world charm with modern amenities in this beautifully restored 1920s landmark.",
    rating: 4.2,
    features: ["Historic Property", "Restaurant", "Free WiFi", "Pet Friendly", "Parking Available"]
  };

  const handleDateChange = (newCheckIn: string, newCheckOut: string) => {
    setCheckIn(newCheckIn);
    setCheckOut(newCheckOut);
  };

  const handleGuestsChange = (newAdults: number, newChildren: number) => {
    setAdults(newAdults);
    setChildren(newChildren);
  };

  const searchRooms = async () => {
    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post<AvailabilityResponse>('http://localhost:5000/availability/check', {
        hotelId: 'jerome-grand',
        checkIn,
        checkOut,
        guests: adults + children
      });

      if (response.data.success) {
        setRooms(response.data.rooms);
        setSearched(true);
      } else {
        setError(response.data.message || 'Failed to fetch room availability');
      }
    } catch (err) {
      setError('Error connecting to server. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();

  return (
    <div className="container py-4">
      {/* Hotel Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h1 className="display-6 fw-bold text-primary mb-2">{hotelInfo.name}</h1>
              <p className="text-muted mb-3">📍 {hotelInfo.location}</p>
              <p className="lead mb-3">{hotelInfo.description}</p>
              <div className="d-flex flex-wrap gap-2">
                {hotelInfo.features.map((feature, index) => (
                  <span key={index} className="badge bg-light text-dark border">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">Search Available Rooms</h3>
            </div>
            <div className="card-body p-4">
              <form onSubmit={(e) => { e.preventDefault(); searchRooms(); }}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <DateRangePicker
                      checkIn={checkIn}
                      checkOut={checkOut}
                      onDateChange={handleDateChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <GuestSelector
                      adults={adults}
                      children={children}
                      onGuestsChange={handleGuestsChange}
                    />
                  </div>
                </div>
                
                {checkIn && checkOut && (
                  <div className="mt-3 p-3 bg-light rounded">
                    <strong>{nights} night{nights !== 1 ? 's' : ''}</strong> • {adults + children} guest{adults + children !== 1 ? 's' : ''}
                  </div>
                )}

                <div className="mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg px-5"
                    disabled={loading || !checkIn || !checkOut}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Searching...
                      </>
                    ) : (
                      'Search Rooms'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Room Results */}
      {searched && !loading && (
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">Available Rooms ({rooms.length})</h2>
            {rooms.length === 0 ? (
              <div className="alert alert-info">
                No rooms available for the selected dates. Please try different dates.
              </div>
            ) : (
              <div className="row g-4">
                {rooms.map((room) => (
                  <div key={room.id} className="col-md-6 col-lg-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title text-primary">{room.name}</h5>
                        <p className="card-text text-muted small mb-3">
                          {room.description || 'Comfortable accommodations with modern amenities'}
                        </p>
                        
                        <div className="mb-3">
                          <span className="badge bg-success me-2">
                            {room.available} available
                          </span>
                          {room.maxOccupancy && (
                            <span className="badge bg-light text-dark">
                              Max {room.maxOccupancy} guests
                            </span>
                          )}
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <strong className="h4 text-success">${room.price}</strong>
                            <small className="text-muted"> / night</small>
                          </div>
                          {nights > 0 && (
                            <div className="text-end">
                              <small className="text-muted">{nights} nights</small><br/>
                              <strong>${room.price * nights} total</strong>
                            </div>
                          )}
                        </div>

                        <button 
                          className="btn btn-primary w-100"
                          disabled={room.available === 0}
                        >
                          {room.available === 0 ? 'Sold Out' : 'Book Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JeromeGrandHotel; 