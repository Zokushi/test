import React from 'react';

interface DateRangePickerProps {
  checkIn: string;
  checkOut: string;
  onDateChange: (checkIn: string, checkOut: string) => void;
  minDate?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  checkIn,
  checkOut,
  onDateChange,
  minDate = new Date().toISOString().split('T')[0] // Today as default min date
}) => {
  const handleCheckInChange = (date: string) => {
    onDateChange(date, checkOut);
    
    // If check-out is before new check-in, adjust check-out
    if (checkOut && new Date(checkOut) <= new Date(date)) {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      onDateChange(date, nextDay.toISOString().split('T')[0]);
    }
  };

  const handleCheckOutChange = (date: string) => {
    onDateChange(checkIn, date);
  };

  return (
    <div className="row g-3">
      <div className="col-md-6">
        <label htmlFor="checkin" className="form-label fw-semibold">
          Check-in Date
        </label>
        <input
          type="date"
          id="checkin"
          className="form-control form-control-lg"
          value={checkIn}
          min={minDate}
          onChange={(e) => handleCheckInChange(e.target.value)}
          required
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="checkout" className="form-label fw-semibold">
          Check-out Date
        </label>
        <input
          type="date"
          id="checkout"
          className="form-control form-control-lg"
          value={checkOut}
          min={checkIn || minDate}
          onChange={(e) => handleCheckOutChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default DateRangePicker; 