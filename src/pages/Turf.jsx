// Turf.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Turf.css';

function Turf() {
  const [turfs, setTurfs] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);

  const userId = 1; // Replace with dynamic value if logged in

  const timeSlots = [
    '06:00 AM - 07:00 AM',
    '07:00 AM - 08:00 AM',
    '08:00 AM - 09:00 AM',
    '05:00 PM - 06:00 PM',
    '06:00 PM - 07:00 PM',
    '07:00 PM - 08:00 PM'
  ];

  useEffect(() => {
    axios.get('http://localhost:8080/api/turfs')
      .then(response => setTurfs(response.data))
      .catch(error => toast.error('Failed to load turfs'));
  }, []);

  const fetchBookedSlots = async (turfId, date) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/bookings`);
      const turfBookings = res.data.filter(
        b => b.turfId === turfId && b.bookingDate === date && b.status !== 'REJECTED'
      );
      const slots = turfBookings.map(b => b.timeSlot);
      setBookedSlots(slots);
    } catch {
      toast.error("Couldn't fetch booked slots");
    }
  };

  const handleBookNow = async () => {
    if (!bookingDate || !selectedSport || !selectedTimeSlot) {
      toast.error('Please fill all fields');
      return;
    }

    const bookingData = {
      userId,
      turfId: selectedTurf.id,
      bookingDate,
      sport: selectedSport,
      timeSlot: selectedTimeSlot,
    };

    try {
      await axios.post('http://localhost:8080/api/bookings', bookingData);
      toast.success('Turf Booked Successfully!');
      setBookingDate('');
      setSelectedSport('');
      setSelectedTimeSlot('');
      setSelectedTurf(null);
    } catch (err) {
      toast.error('Booking failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleTurfSelect = (turf) => {
    setSelectedTurf(turf);
    setBookingDate('');
    setSelectedSport('');
    setSelectedTimeSlot('');
    setBookedSlots([]);
  };

  const handleDateChange = async (date) => {
    setBookingDate(date);
    if (selectedTurf) {
      await fetchBookedSlots(selectedTurf.id, date);
    }
  };

  if (selectedTurf) {
    return (
      <div className="booking-form">
        <h2>Book {selectedTurf.name}</h2>

        <label>Select Date</label>
        <input
          type="date"
          value={bookingDate}
          onChange={(e) => handleDateChange(e.target.value)}
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
          {timeSlots.map((slot, idx) => (
            <option key={idx} value={slot} disabled={bookedSlots.includes(slot)}>
              {slot} {bookedSlots.includes(slot) ? '(Booked)' : ''}
            </option>
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
        <div key={index} className="turf-card" onClick={() => handleTurfSelect(turf)}>
          <img src={turf.imageUrl} alt={turf.name} />
          <h3>{turf.name}</h3>
          <p><strong>Address:</strong> {turf.location}</p>
          <p><strong>Contact:</strong> {turf.contact}</p>
          <p><strong>Price:</strong> ₹{turf.pricePerHour}/hour</p>
        </div>
      ))}
    </div>
  );
}

export default Turf;
