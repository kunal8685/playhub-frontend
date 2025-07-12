// ✅ Full Turf.jsx with login restriction, working Razorpay integration, and professional headline
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
  const [bookingCost, setBookingCost] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const availableStartTimes = ['06:00 AM', '07:00 AM', '08:00 AM', '05:00 PM', '06:00 PM', '07:00 PM'];
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
      const res = await axios.get('http://localhost:8080/api/bookings');
      const turfBookings = res.data.filter(
        b => b.turfId === turfId && b.bookingDate === date && b.status !== 'REJECTED'
      );
      const slots = turfBookings.map(b => b.timeSlot);
      setBookedSlots(slots);
    } catch {
      toast.error("Couldn't fetch booked slots");
    }
  };

  const isTimeSlotBooked = (startTimeToCheck) =>
    bookedSlots.some(slot => slot.startsWith(startTimeToCheck));

  const calculateEndTime = (start, duration) => {
    const [time, period] = start.split(' ');
    let [hr, min] = time.split(':').map(Number);
    if (period === 'PM' && hr !== 12) hr += 12;
    if (period === 'AM' && hr === 12) hr = 0;
    let minutes = hr * 60 + min + parseFloat(duration) * 60;
    let newHr = Math.floor(minutes / 60) % 24;
    const newMin = minutes % 60;
    const ampm = newHr >= 12 ? 'PM' : 'AM';
    if (newHr > 12) newHr -= 12;
    if (newHr === 0) newHr = 12;
    return `${newHr}:${newMin < 10 ? '0' : ''}${newMin} ${ampm}`;
  };

  const handlePayment = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("You must be logged in to book.");
      return;
    }
    const userId = user.id;

    if (!bookingDate || !selectedSport || !startTime || !bookingDuration) {
      toast.error('Please fill all fields');
      return;
    }

    setIsProcessing(true);
    try {
      const orderRes = await axios.post('http://localhost:8080/api/payment/createOrder', {
        amount: bookingCost * 100,
      });

      const { orderId, amount, currency, key } = orderRes.data;

      const options = {
        key,
        amount,
        currency,
        name: 'PlayHub Turf Booking',
        description: `Booking at ${selectedTurf.name}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post('http://localhost:8080/api/payment/verifyPayment', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });

            if (verifyRes.data.valid) {
              const endTime = calculateEndTime(startTime, bookingDuration);
              const bookingData = {
                userId,
                turfId: selectedTurf.id,
                bookingDate,
                sport: selectedSport,
                timeSlot: `${startTime} - ${endTime}`,
                paymentId: response.razorpay_payment_id,
                amount: bookingCost
              };
              await axios.post('http://localhost:8080/api/bookings', bookingData);
              toast.success('✅ Payment & Booking Successful!');
              resetForm();
            } else {
              toast.error('❌ Payment verification failed!');
            }
          } catch (err) {
            toast.error('❌ Error saving booking after payment');
          }
          setIsProcessing(false);
        },
        prefill: {
          name: user.username,
          email: user.email || 'user@example.com',
          contact: '9999999999'
        },
        theme: { color: '#3399cc' },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.info('Payment Cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        toast.error('❌ Payment failed');
        setIsProcessing(false);
      });
      rzp.open();

    } catch (err) {
      toast.error('❌ Failed to create payment order');
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setSelectedTurf(null);
    setBookingDate('');
    setSelectedSport('');
    setStartTime('');
    setBookingDuration('1 hour');
  };

  const handleTurfSelect = (turf) => {
    setSelectedTurf(turf);
    setBookingDate('');
    setSelectedSport('');
    setStartTime('');
    setBookingDuration('1 hour');
    setBookedSlots([]);
  };

  const handleDateChange = async (date) => {
    setBookingDate(date);
    if (selectedTurf) await fetchBookedSlots(selectedTurf.id, date);
  };

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

        {startTime && bookingDuration && (
          <div className="time-summary">
            Time Slot: {startTime} - {calculateEndTime(startTime, bookingDuration)}
          </div>
        )}

        {bookingCost > 0 && (
          <div className="cost-summary">
            <strong>Total Cost: ₹{bookingCost}</strong>
          </div>
        )}

        <button onClick={handlePayment} disabled={isProcessing || !bookingDate || !selectedSport || !startTime} className={isProcessing ? 'processing' : ''}>
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
        <button className="back-btn" onClick={() => setSelectedTurf(null)}>Back</button>
      </div>
    );
  }

  return (
    <div>
      <div className="main-headline">
        <h1>Book your <span className="highlight">turf</span>, play your game</h1>
        <p>Discover premium turfs in your area and book your perfect game time</p>
      </div>
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
    </div>
  );
}

export default Turf;