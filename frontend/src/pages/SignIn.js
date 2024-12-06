import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import '../App.css';
import InputField from '../components/InputField';
import { Oval } from 'react-loader-spinner';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      setLoading(true);
      // Send a login request to the backend
      const response = await fetch('https://backend-theta-project.onrender.com/api/users/signin', {
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
        setLoading(false);

        console.log('Login successful:', data);
        setError(''); // Clear any previous errors

        // Navigate to the personal home page
        navigate('/personal-home');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Invalid email or password.');
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
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
            <button type="submit" className="login-button spinner-container">
              <span className="button-content">
                {loading && (
                  <Oval
                    height={15}
                    width={15}
                    color="#ffffff"
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#454545"
                    strokeWidth={4}
                    strokeWidthSecondary={4}
                    style={{ marginRight: '8px' }} // Add some spacing between spinner and text
                  />
                )}
                Log In
              </span>
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
