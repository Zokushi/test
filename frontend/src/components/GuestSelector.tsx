import React from 'react';

interface GuestSelectorProps {
  adults: number;
  children: number;
  onGuestsChange: (adults: number, children: number) => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({
  adults,
  children,
  onGuestsChange
}) => {
  const handleAdultsChange = (newAdults: number) => {
    if (newAdults >= 1 && newAdults <= 8) {
      onGuestsChange(newAdults, children);
    }
  };

  const handleChildrenChange = (newChildren: number) => {
    if (newChildren >= 0 && newChildren <= 6) {
      onGuestsChange(adults, newChildren);
    }
  };

  return (
    <div className="row g-3">
      <div className="col-md-6">
        <label htmlFor="adults" className="form-label fw-semibold">
          Adults
        </label>
        <div className="input-group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => handleAdultsChange(adults - 1)}
            disabled={adults <= 1}
          >
            -
          </button>
          <input
            type="number"
            id="adults"
            className="form-control text-center"
            value={adults}
            min="1"
            max="8"
            onChange={(e) => handleAdultsChange(parseInt(e.target.value) || 1)}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => handleAdultsChange(adults + 1)}
            disabled={adults >= 8}
          >
            +
          </button>
        </div>
        <small className="text-muted">Age 18+</small>
      </div>
      <div className="col-md-6">
        <label htmlFor="children" className="form-label fw-semibold">
          Children
        </label>
        <div className="input-group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => handleChildrenChange(children - 1)}
            disabled={children <= 0}
          >
            -
          </button>
          <input
            type="number"
            id="children"
            className="form-control text-center"
            value={children}
            min="0"
            max="6"
            onChange={(e) => handleChildrenChange(parseInt(e.target.value) || 0)}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => handleChildrenChange(children + 1)}
            disabled={children >= 6}
          >
            +
          </button>
        </div>
        <small className="text-muted">Age 0-17</small>
      </div>
    </div>
  );
};

export default GuestSelector; 