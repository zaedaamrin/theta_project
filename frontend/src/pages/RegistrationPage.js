

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import '../App.css';
import InputField from '../components/InputField';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // useEffect to clear input fields on component mount
  useEffect(() => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }, []);

  const isEmailValid = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const isPasswordValid = (password) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return passwordPattern.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Front-end input validation
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!isEmailValid(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isPasswordValid(password)) {
      setError("Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one special character (!, @, #, $, %, ^, &, *).");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError('');

    const requestData = {
      username,
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:8000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("Registration successful! Redirecting to sign-in page...");
        setTimeout(() => {
          navigate('/signin');
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="Registrationpage">
      <Nav />
      <div className="registration-container">
        <h1>Register to Start Chats</h1>

        <div className="registration-box">
          <form autoComplete="off" onSubmit={handleSubmit}>
            <InputField 
              label="Create your username" 
              type="text" 
              placeholder="Enter username" 
              autoComplete="off"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
            <InputField 
              label="Enter your email address" 
              type="email" 
              placeholder="Enter email address" 
              autoComplete="off"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <InputField 
              label="Create your password" 
              type="password" 
              placeholder="Enter password" 
              autoComplete="new-password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <InputField 
              label="Confirm your password" 
              type="password" 
              placeholder="Confirm password" 
              autoComplete="new-password"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />

            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
            {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}
            
            <button type="submit" className="register-button">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
