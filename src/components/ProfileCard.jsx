// ProfileCard.jsx
import React from 'react';
import './Profile.css';

function ProfileCard({ user }) {
  return (
    <div className="profile-card">
      <div className="profile-icon">
        <img src="/images/Profile.jpeg" alt="user" />
      </div>
      <div className="profile-info">
        <h2>{user.username}</h2>
        <p>Email: {user.email}</p>
        <p>Mobile: {user.mobileNumber || 'N/A'}</p>
        <p>Gender: {user.gender || 'N/A'}</p>
        <p>DOB: {user.dob || 'N/A'}</p>
        <p>Location: {user.location || 'N/A'}</p>
      </div>
    </div>
  );
}

export default ProfileCard;