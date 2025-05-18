// Contact.jsx
import React from 'react';
import './Contact.css';

function Contact() {
  return (
    <div className="contact">
      <h2>Contact Us</h2>
      <p>If you have any questions, feel free to reach out to us. We're here to help!</p>

      <div className="contact-details">
        <p><strong>📍 Address:</strong> Play Hub, Pune</p>
        <p><strong>✉️ Email:</strong> support@playhub.com</p>
        <p><strong>📞 Phone:</strong> +91 88884 08685</p>
        <p><strong>🔗 Follow us:</strong> 
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"> Instagram</a> | 
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"> Twitter</a> | 
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"> Facebook</a>
        </p>
      </div>
    </div>
  );
}

export default Contact;