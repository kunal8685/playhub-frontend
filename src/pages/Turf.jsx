import React from 'react';
import turf1 from '../images/turf1.jpg';
import turf2 from '../images/turf2.jpg';
import turf3 from '../images/turf3.jpg';
import './Turf.css';

function Turf() {
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

  return (
    <div className="turf-list">
      {turfs.map((turf, index) => (
        <div key={index} className="turf-card">
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
