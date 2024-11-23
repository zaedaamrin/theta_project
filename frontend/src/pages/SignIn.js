import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import '../App.css';
import InputField from '../components/InputField';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      // Send a login request to the backend
      const response = await fetch('http://localhost:8000/api/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store the userId in local storage
        localStorage.setItem('userId', data.user.userId); // Assuming 'userId' is part of the user object

        console.log('Login successful:', data);
        setError(''); // Clear any previous errors

        // Navigate to the personal home page
        navigate('/personal-home');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Invalid email or password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error('Login error:', err);
    }
  };

  const handleSignUpClick = () => {
    navigate('/signup'); // Navigate to the signup page
  };

  return (
    <div className="login-page">
      <Nav />
      <div className="login-container">
        <h1>Log In to Smart Memory</h1>
        <div className="login-box">
          <form autoComplete="off" onSubmit={handleLogin}>
            <InputField
              label="Email Address"
              type="email"
              placeholder="Enter email address"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
              label="Password"
              type="password"
              placeholder="Enter password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="login-button">
              Log In
            </button>
          </form>
          {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
          <p className="signup-text">
            Don’t have an account?{' '}
            <a href="#" onClick={handleSignUpClick}>
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
