import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [focused, setFocused] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      return toast.error('All fields are required.');
    }
    if (!validateEmail(form.email)) {
      return toast.error('Invalid email format.');
    }
    if (!validatePassword(form.password)) {
      return toast.error('Password must be 8+ chars with 1 uppercase, 1 lowercase, 1 number, 1 special char.');
    }
    try {
      await axios.post('http://localhost:8080/api/users/register', form);
      toast.success('Registered Successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error('Registration Failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleFocus = (field) => setFocused(field);
  const handleBlur = () => setFocused('');

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Sign up to get started</p>
        </div>
        <form onSubmit={handleSubmit} className="register-form">
          <div className={`input-group ${focused === 'username' || form.username ? 'focused' : ''}`}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" value={form.username} onChange={handleChange} onFocus={() => handleFocus('username')} onBlur={handleBlur} required />
          </div>
          <div className={`input-group ${focused === 'email' || form.email ? 'focused' : ''}`}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" value={form.email} onChange={handleChange} onFocus={() => handleFocus('email')} onBlur={handleBlur} required />
          </div>
          <div className={`input-group ${focused === 'password' || form.password ? 'focused' : ''}`}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={form.password} onChange={handleChange} onFocus={() => handleFocus('password')} onBlur={handleBlur} required />
          </div>
          <button type="submit" className="register-button">Register</button>
        </form>
        <div className="register-footer">
          <p>Already have an account? <a href="/login">Log in</a></p>
        </div>
      </div>
    </div>
  );
}

export default Register;