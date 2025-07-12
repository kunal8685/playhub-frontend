// Payment.jsx
import React, { useState } from 'react';
import axios from 'axios';

function Payment() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handlePayment = async () => {
    try {
      const response = await axios.post('http://localhost:8080/createOrder', {
        name,
        amount: parseInt(amount) * 100, // Convert to paise
      });

      const orderId = response.data.id;
      const options = {
        key: 'rzp_test_XmwnchQOeOtvgY',
        amount: response.data.amount,
        currency: response.data.currency,
        name: 'Your Company Name',
        description: 'Test Transaction',
        order_id: orderId,
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post('http://localhost:8080/verify', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (verifyResponse.data) {
              window.location.href = 'http://localhost:8080/payment-success';
            } else {
              window.location.href = 'http://localhost:8080/payment-failure';
            }
          } catch (error) {
            console.error(error);
          }
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
}

export default Payment;