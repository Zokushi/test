import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Link } from 'react-router-dom';
import { getLocations } from '../services/locationService';
import type { Location } from '../types/Location';

const dummyFeaturedLocation = {
  name: 'No Featured Location',
  img: 'https://via.placeholder.com/300x200?text=No+Image',
  desc: 'Check back soon for a new featured haunted destination!',
  id: 0,
};

const Landing: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations();
        setLocations(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        setError('Failed to load locations. Please try again later.');
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Select first 3 locations for the carousel
  const carouselLocations = locations.slice(0, 3);

  // Find a featured location
  const featuredLocation = locations.find((loc) => loc.isFeatured === true);

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Google Fonts for Creepster and Montserrat */}
      {/* Fog overlay for spooky effect */}
      <div className="fog-overlay" />
      <div className="container mt-5">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="display-3 fw-bold text-danger">Cursed Compass</h1>
          <p className="lead text-secondary">
            Your guide to haunted vacations, cryptid sightings, and supernatural getaways.
          </p>
          <a href="#explore" className="btn btn-lg btn-primary mt-3">
            Explore Spooky Destinations
          </a>
        </div>

        {/* Featured Hotel Section */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-10">
            <div className="card bg-gradient shadow-lg border-0" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
              <div className="card-body p-5">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="text-white">
                      <span className="badge bg-warning text-dark mb-2">✨ Featured Hotel</span>
                      <h2 className="display-5 fw-bold text-warning mb-3">Jerome Grand Hotel</h2>
                      <p className="lead mb-3">
                        Historic luxury in the heart of Jerome's mining district. Experience old-world charm 
                        with modern amenities in this beautifully restored 1920s landmark.
                      </p>
                      <div className="row mb-4">
                        <div className="col-6">
                          <div className="text-center">
                            <h4 className="text-success mb-1">$220+</h4>
                            <small className="text-muted">per night</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="text-center">
                            <h4 className="text-info mb-1">9</h4>
                            <small className="text-muted">room types</small>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex gap-2 flex-wrap mb-3">
                        <span className="badge bg-light text-dark">Historic Property</span>
                        <span className="badge bg-light text-dark">Restaurant</span>
                        <span className="badge bg-light text-dark">Free WiFi</span>
                        <span className="badge bg-light text-dark">Pet Friendly</span>
                      </div>
                      <Link 
                        to="/hotels/jerome-grand" 
                        className="btn btn-warning btn-lg px-4"
                      >
                        🏨 Book Now - Live Availability
                      </Link>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <img 
                      src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80" 
                      alt="Jerome Grand Hotel" 
                      className="img-fluid rounded shadow"
                      style={{ maxHeight: '350px', width: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Carousel Section */}
        {carouselLocations.length > 0 ? (
          <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            autoPlay
            interval={5000}
            className="mb-5"
          >
            {carouselLocations.map((location) => (
              <div key={location.id}>
                <img
                  src={location.img}
                  alt={location.name}
                  style={{ maxHeight: '320px', objectFit: 'cover', borderRadius: '0.5rem' }}
                />
                <div className="legend bg-dark bg-opacity-75 rounded p-2">
                  <h5>{location.name}</h5>
                  <p>{location.desc}</p>
                  <Link to={`/location/${location.id}`} className="btn btn-danger btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="alert alert-info mb-5">No locations available for the carousel.</div>
        )}
        {/* Example Card Section */}
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card gothic-card bg-dark text-white mb-3">
              <div className="card-header">Featured Location</div>
              <div className="card-body text-center">
                <img
                  src={(featuredLocation || dummyFeaturedLocation).img}
                  alt={(featuredLocation || dummyFeaturedLocation).name}
                  style={{ maxWidth: '300px', borderRadius: '1rem' }}
                />
                <h5 className="card-title mt-3 gothic-silver-text">
                  {(featuredLocation || dummyFeaturedLocation).name}
                </h5>
                <p className="card-text">{(featuredLocation || dummyFeaturedLocation).desc}</p>
                {featuredLocation ? (
                  <Link to={`/location/${featuredLocation.id}`} className="btn btn-danger">
                    View Details
                  </Link>
                ) : (
                  <button className="btn btn-secondary" disabled>
                    No Details Available
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Grid of 6 Locations */}
        <div className="haunt-grid-bg py-4 px-2 my-4 rounded-4">
          <div className="row">
            {locations.slice(0, 6).map((location) => (
              <div className="col-md-4 mb-4" key={location.id}>
                <div className="card haunt-card bg-dark text-white h-100 shadow">
                  <img
                    src={location.img}
                    className="card-img-top"
                    alt={location.name}
                    style={{ maxHeight: '180px', objectFit: 'cover' }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{location.name}</h5>
                    <p className="card-text">{location.desc}</p>
                    <Link
                      to={`/location/${location.id}`}
                      className="btn btn-danger mt-auto align-self-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
