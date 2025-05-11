import { useParams, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import type { Location } from '../types/Location';
import { getLocationById } from '../services/locationService';

const LocationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!id) return;

      try {
        const data = await getLocationById(parseInt(id));
        setLocation(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch location details:', err);
        setError('Failed to load location details. Please try again later.');
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

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
        <Link to="/" className="btn btn-primary mt-3">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="container mt-5 text-center">
        <h2>Location Not Found</h2>
        <Link to="/" className="btn btn-primary mt-3">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5 text-center">
      <h1>{location.name}</h1>
      <img
        src={location.img}
        alt={location.name}
        style={{ maxWidth: '400px', borderRadius: '1rem' }}
      />
      <p className="lead mt-3">{location.desc}</p>

      {/* Pricing and capacity information */}
      <div className="my-3 p-3 bg-dark rounded text-light">
        <div className="row">
          <div className="col-md-6">
            <h4 className="text-danger mb-3">Booking Details</h4>
            {location && (
              <p className="mb-2">
                <strong>Price:</strong> $50 per night
              </p>
            )}
            {location && (
              <p className="mb-2">
                <strong>Max Guests:</strong> 4 people
              </p>
            )}
          </div>
          <div className="col-md-6">
            <button className="btn btn-danger btn-lg mt-3" onClick={() => setShowModal(true)}>
              Book Now
            </button>
          </div>
        </div>
      </div>

      {(location.address || location.city || location.state || location.country) && (
        <p className="mt-2 text-secondary">
          <strong>Address:</strong>
          {location.address && ` ${location.address},`}
          {location.city && ` ${location.city},`}
          {location.state && ` ${location.state},`}
          {location.country && ` ${location.country}`}
        </p>
      )}
      {location.features && location.features.length > 0 && (
        <div className="my-3">
          <strong>Features:</strong>
          <div>
            {location.features.map((feature, idx) => (
              <span key={idx} className="badge bg-danger me-2 mb-1">
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
      {location.history && (
        <div className="my-3">
          <strong>History:</strong>
          <p className="mt-2">{location.history}</p>
        </div>
      )}
      {location.reviews && location.reviews.length > 0 && (
        <div className="my-4">
          <strong>Guest Reviews:</strong>
          <div className="mt-2">
            {location.reviews.map((review, idx) => (
              <div key={idx} className="border rounded p-2 mb-2 bg-dark bg-opacity-75 text-start">
                <div>
                  <span className="fw-bold">{review.user}</span>
                  <span className="ms-2 text-warning">
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </span>
                  <span className="ms-2 text-muted" style={{ fontSize: '0.9em' }}>
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <div>{review.comment}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {(location.website || location.contactEmail) && (
        <div className="my-3">
          {location.website && (
            <div>
              <a
                href={location.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-info btn-sm me-2"
              >
                Visit Website
              </a>
            </div>
          )}
          {location.contactEmail && (
            <div>
              <a
                href={`mailto:${location.contactEmail}`}
                className="btn btn-outline-light btn-sm mt-2"
              >
                Contact
              </a>
            </div>
          )}
        </div>
      )}
      <div className="d-flex justify-content-center mt-3" style={{ gap: '1rem' }}>
        <Link to="/" className="btn btn-secondary">
          Back to Home
        </Link>
      </div>
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ background: 'rgba(0,0,0,0.7)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <h5 className="modal-title">Book Your Stay</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Your Name</label>
                    <input type="text" className="form-control" placeholder="Enter your name" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Check-in Date</label>
                    <input type="date" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Check-out Date</label>
                    <input type="date" className="form-control" />
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger w-100"
                    onClick={() => setShowModal(false)}
                  >
                    (Mock) Book Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDetails;
