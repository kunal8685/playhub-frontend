import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import turf1 from '../images/turf1.jpg';
import turf2 from '../images/turf2.jpg';
import turf3 from '../images/turf3.jpg';
import './Turf.css';

function Turf() {
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  const turfs = [
    {
      name: 'SportZone Turf',
      address: 'Camp, Pune',
      number: '+91 9876543210',
      price: '₹1000/hour',
      image: turf1
    },
    {
      name: 'PlayField Arena',
      address: 'Ravet, Pune',
      number: '+91 9123456780',
      price: '₹1200/hour',
      image: turf2
    },
    {
      name: 'Champion Turf',
      address: 'Wakad, Pune',
      number: '+91 9988776655',
      price: '₹900/hour',
      image: turf3
    }
  ];

  const timeSlots = [
    '06:00 AM - 07:00 AM',
    '07:00 AM - 08:00 AM',
    '08:00 AM - 09:00 AM',
    '05:00 PM - 06:00 PM',
    '06:00 PM - 07:00 PM',
    '07:00 PM - 08:00 PM'
  ];

  const handleBookNow = () => {
    if (!bookingDate || !selectedSport || !selectedTimeSlot) {
      toast.error('Please fill all fields before booking.');
      return;
    }

    // Simulate successful booking
    toast.success('Turf Booked Successfully!');
    // Reset
    setBookingDate('');
    setSelectedSport('');
    setSelectedTimeSlot('');
    setSelectedTurf(null);
  };

  if (selectedTurf) {
    return (
      <div className="booking-form">
        <h2>Book {selectedTurf.name}</h2>

        <label>Select Date</label>
        <input
          type="date"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
        />

        <label>Select Sport</label>
        <select
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
        >
          <option value="">-- Select Sport --</option>
          <option value="Football">Football</option>
          <option value="Cricket">Cricket</option>
        </select>

        <label>Select Time Slot</label>
        <select
          value={selectedTimeSlot}
          onChange={(e) => setSelectedTimeSlot(e.target.value)}
        >
          <option value="">-- Select Time Slot --</option>
          {timeSlots.map((slot, index) => (
            <option key={index} value={slot}>{slot}</option>
          ))}
        </select>

        <button onClick={handleBookNow}>Book Now</button>
        <button className="back-btn" onClick={() => setSelectedTurf(null)}>Back to Turfs</button>
      </div>
    );
  }

  return (
    <div className="turf-list">
      {turfs.map((turf, index) => (
        <div key={index} className="turf-card" onClick={() => setSelectedTurf(turf)}>
          <img src={turf.image} alt={turf.name} />
          <h3>{turf.name}</h3>
          <p><strong>Address:</strong> {turf.address}</p>
          <p><strong>Contact:</strong> {turf.number}</p>
          <p><strong>Price:</strong> {turf.price}</p>
        </div>
      ))}
    </div>
  );
}

export default Turf;
