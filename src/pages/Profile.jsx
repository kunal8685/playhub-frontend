// ✅ Profile.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getLoggedInUser } from '../utils/auth';
import './Profile.css';
import ProfileCard from '../components/ProfileCard';

function Profile() {
  const [user, setUser] = useState(getLoggedInUser());
  const [transactions, setTransactions] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:8080/api/bookings/user/${user.id}`).then(res => setBookings(res.data));
      axios.get(`http://localhost:8080/api/wallet/transactions/${user.id}`).then(res => setTransactions(res.data));
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="profile-page">
      <ProfileCard user={user} />

      <section className="profile-section">
        <h3>📅 Booking History</h3>
        {bookings.length === 0 ? <p>No bookings yet.</p> : (
          <ul>
            {bookings.map(b => (
              <li key={b.id}>
                Turf {b.turfId} on {b.bookingDate} at {b.timeSlot} ({b.status})
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="profile-section">
        <h3>💳 Transactions</h3>
        {transactions.length === 0 ? <p>No transactions yet.</p> : (
          <ul>
            {transactions.map(t => (
              <li key={t.id}>Rs. {t.amount} - {t.type} ({t.timestamp})</li>
            ))}
          </ul>
        )}
      </section>

      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;