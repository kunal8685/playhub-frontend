// ✅ Updated Login.jsx with redirect to /turf after login
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [focused, setFocused] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      return toast.error('Username and password are required.');
    }
    try {
      const res = await axios.post('http://localhost:8080/api/users/login', form);
      toast.success('Login Successfully!');
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/turf');
    } catch (error) {
      toast.error('Login Failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleFocus = (field) => setFocused(field);
  const handleBlur = () => setFocused('');

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className={`input-group ${focused === 'username' ? 'focused' : ''}`}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" value={form.username} onChange={handleChange} onFocus={() => handleFocus('username')} onBlur={handleBlur} required />
          </div>
          <div className={`input-group ${focused === 'password' ? 'focused' : ''}`}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={form.password} onChange={handleChange} onFocus={() => handleFocus('password')} onBlur={handleBlur} required />
          </div>
          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" className="login-button">Log In</button>
        </form>
        <div className="login-footer">
          <p>Don't have an account? <a href="/register">Sign up</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
