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
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookingDuration, setBookingDuration] = useState('1 hour');
  const [startTime, setStartTime] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('wallet');
  const [walletBalance, setWalletBalance] = useState(1500); // Mock wallet balance
  const [bookingCost, setBookingCost] = useState(0);
  const userId = 1; // Replace with dynamic user ID if needed

  const availableStartTimes = [
    '06:00 AM', '07:00 AM', '08:00 AM',
    '05:00 PM', '06:00 PM', '07:00 PM'
  ];

  const durationOptions = ['1 hour', '1.5 hours', '2 hours'];

  useEffect(() => {
    axios.get('http://localhost:8080/api/turfs')
      .then(res => setTurfs(res.data))
      .catch(() => toast.error('Failed to load turfs'));
  }, []);

  useEffect(() => {
    if (selectedTurf && bookingDuration) {
      const cost = selectedTurf.pricePerHour * parseFloat(bookingDuration);
      setBookingCost(cost);
    }
  }, [selectedTurf, bookingDuration]);

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

  const isTimeSlotBooked = (startTimeToCheck) => {
    return bookedSlots.some(slot => slot.startsWith(startTimeToCheck));
  };

  const calculateEndTime = (start, duration) => {
    const [time, period] = start.split(' ');
    let [hr, min] = time.split(':').map(Number);
    if (period === 'PM' && hr !== 12) hr += 12;
    if (period === 'AM' && hr === 12) hr = 0;
    let minutes = hr * 60 + min;
    minutes += parseFloat(duration) * 60;
    let newHr = Math.floor(minutes / 60) % 24;
    const newMin = minutes % 60;
    const ampm = newHr >= 12 ? 'PM' : 'AM';
    if (newHr > 12) newHr -= 12;
    if (newHr === 0) newHr = 12;
    return `${newHr}:${newMin < 10 ? '0' : ''}${newMin} ${ampm}`;
  };

  const handleBookNow = () => {
    if (!bookingDate || !selectedSport || !startTime || !bookingDuration) {
      toast.error('Please fill all fields');
      return;
    }
    setShowPayment(true);
  };

  const handlePayment = async () => {
    if (selectedPaymentMethod === 'wallet' && walletBalance < bookingCost) {
      toast.error('Insufficient wallet balance');
      return;
    }

    const endTime = calculateEndTime(startTime, bookingDuration);
    const bookingData = {
      userId,
      turfId: selectedTurf.id,
      bookingDate,
      sport: selectedSport,
      timeSlot: `${startTime} - ${endTime}`,
      paymentMethod: selectedPaymentMethod,
      amount: bookingCost
    };

    try {
      await axios.post('http://localhost:8080/api/bookings', bookingData);
      
      // Update wallet balance if paid via wallet
      if (selectedPaymentMethod === 'wallet') {
        setWalletBalance(prev => prev - bookingCost);
      }
      
      toast.success('Turf Booked Successfully!');
      resetForm();
    } catch (err) {
      toast.error('Booking failed!');
    }
  };

  const resetForm = () => {
    setSelectedTurf(null);
    setBookingDate('');
    setSelectedSport('');
    setStartTime('');
    setBookingDuration('1 hour');
    setShowPayment(false);
    setSelectedPaymentMethod('wallet');
  };

  const handleTurfSelect = (turf) => {
    setSelectedTurf(turf);
    setBookingDate('');
    setSelectedSport('');
    setStartTime('');
    setBookingDuration('1 hour');
    setBookedSlots([]);
    setShowPayment(false);
  };

  const handleDateChange = async (date) => {
    setBookingDate(date);
    if (selectedTurf) await fetchBookedSlots(selectedTurf.id, date);
  };

  const goBackToBooking = () => {
    setShowPayment(false);
  };

  // Payment Interface
  if (showPayment) {
    return (
      <div className="booking-form">
        <h2>Payment - {selectedTurf.name}</h2>
        
        {/* Booking Summary */}
        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <div className="summary-row">
            <span>Date:</span>
            <span>{bookingDate}</span>
          </div>
          <div className="summary-row">
            <span>Sport:</span>
            <span>{selectedSport}</span>
          </div>
          <div className="summary-row">
            <span>Time:</span>
            <span>{startTime} - {calculateEndTime(startTime, bookingDuration)}</span>
          </div>
          <div className="summary-row">
            <span>Duration:</span>
            <span>{bookingDuration}</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount:</span>
            <span>₹{bookingCost}</span>
          </div>
        </div>

        {/* Payment Options */}
        <div className="payment-options">
          <h3>All Payment Options</h3>
          
          {/* Wallet Payment */}
          <div className={`payment-method ${selectedPaymentMethod === 'wallet' ? 'selected' : ''}`} 
               onClick={() => setSelectedPaymentMethod('wallet')}>
            <div className="payment-method-content">
              <div className="payment-icon wallet-icon">💳</div>
              <div className="payment-details">
                <span className="payment-name">Wallet</span>
                <span className="payment-balance">Balance: ₹{walletBalance}</span>
              </div>
              <div className="payment-arrow">›</div>
            </div>
          </div>

          {/* UPI Payment */}
          <div className={`payment-method ${selectedPaymentMethod === 'upi' ? 'selected' : ''}`} 
               onClick={() => setSelectedPaymentMethod('upi')}>
            <div className="payment-method-content">
              <div className="payment-icon upi-icon">📱</div>
              <div className="payment-details">
                <span className="payment-name">UPI</span>
                <div className="payment-apps">
                  <span className="app-icon">🟢</span>
                  <span className="app-icon">🔵</span>
                  <span className="app-icon">🟣</span>
                  <span className="app-icon">🟡</span>
                </div>
              </div>
              <div className="payment-arrow">›</div>
            </div>
          </div>

          {/* Cards Payment */}
          <div className={`payment-method ${selectedPaymentMethod === 'cards' ? 'selected' : ''}`} 
               onClick={() => setSelectedPaymentMethod('cards')}>
            <div className="payment-method-content">
              <div className="payment-icon cards-icon">💳</div>
              <div className="payment-details">
                <span className="payment-name">Cards</span>
                <div className="payment-cards">
                  <span className="card-icon visa">VISA</span>
                  <span className="card-icon master">MC</span>
                  <span className="card-icon rupay">💳</span>
                </div>
              </div>
              <div className="payment-arrow">›</div>
            </div>
          </div>

          {/* Net Banking */}
          <div className={`payment-method ${selectedPaymentMethod === 'netbanking' ? 'selected' : ''}`} 
               onClick={() => setSelectedPaymentMethod('netbanking')}>
            <div className="payment-method-content">
              <div className="payment-icon netbanking-icon">🏦</div>
              <div className="payment-details">
                <span className="payment-name">Netbanking</span>
                <div className="payment-banks">
                  <span className="bank-icon">🏦</span>
                  <span className="bank-icon">🟠</span>
                  <span className="bank-icon">🔴</span>
                  <span className="bank-icon">🟢</span>
                </div>
              </div>
              <div className="payment-arrow">▽</div>
            </div>
          </div>
        </div>

        {/* Payment Security */}
        <div className="payment-security">
          <span className="security-text">Secured by</span>
          <span className="razorpay-text">Razorpay</span>
          <span className="terms-text">• Account & Terms</span>
        </div>

        <div className="privacy-notice">
          <span>By proceeding, I agree to Razorpay's</span>
          <br />
          <span className="privacy-link">Privacy Notice</span>
        </div>

        {/* Amount and Continue */}
        <div className="payment-footer">
          <div className="amount-section">
            <span className="amount">₹{bookingCost}</span>
            <span className="view-details">View Details ⌄</span>
          </div>
          <button className="continue-btn" onClick={handlePayment}>
            Continue
          </button>
        </div>

        <button className="back-btn" onClick={goBackToBooking}>Back to Booking</button>
      </div>
    );
  }

  // Booking Form
  if (selectedTurf) {
    return (
      <div className="booking-form">
        <h2>Book {selectedTurf.name}</h2>
        <label>Select Date</label>
        <input type="date" value={bookingDate} onChange={e => handleDateChange(e.target.value)} />

        <label>Select Sport</label>
        <select value={selectedSport} onChange={e => setSelectedSport(e.target.value)}>
          <option value="">-- Select Sport --</option>
          <option value="Football">Football</option>
          <option value="Cricket">Cricket</option>
        </select>

        <label>Start Time</label>
        <select value={startTime} onChange={e => setStartTime(e.target.value)}>
          <option value="">-- Select Time --</option>
          {availableStartTimes.map((time, i) => (
            <option key={i} value={time} disabled={isTimeSlotBooked(time)}>
              {time} {isTimeSlotBooked(time) ? ' (Booked)' : ''}
            </option>
          ))}
        </select>

        <label>Duration</label>
        <select value={bookingDuration} onChange={e => setBookingDuration(e.target.value)}>
          {durationOptions.map((d, i) => (
            <option key={i} value={d}>{d}</option>
          ))}
        </select>

        <div className="time-summary">
          {startTime && bookingDuration && (
            <>Time Slot: {startTime} - {calculateEndTime(startTime, bookingDuration)}</>
          )}
        </div>

        {bookingCost > 0 && (
          <div className="cost-summary">
            <strong>Total Cost: ₹{bookingCost}</strong>
          </div>
        )}

        <button onClick={handleBookNow}>Book Now</button>
        <button className="back-btn" onClick={() => setSelectedTurf(null)}>Back</button>
      </div>
    );
  }

  // Turf List
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