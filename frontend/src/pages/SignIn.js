import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import Nav from '../components/Nav';
import '../App.css';
import InputField from '../components/InputField'; 

const LoginPage = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Add a 2-second delay before navigating to the PersonalHome page
    setTimeout(() => {
      navigate('/personal-home'); // Redirect to the PersonalHome page after 2 seconds
    }, 1000); // 2000 milliseconds = 2 seconds
  };

    const handleSignUpClick = (e) => {
        e.preventDefault();
        navigate('/signup');
    };

  return (
    <div className="login-page">
      <Nav />
      <div className="login-container">
        <h1>Smart Memory</h1>
        <div className="login-box">
          <h2>Sign In</h2>
          {/* Set form autocomplete to "off" */}
          <form autoComplete="off" onSubmit={handleLogin}>
            {/* Email input field */}
            <InputField label="Email Address" type="email" placeholder="your email address" autoComplete="off" />
            {/* Password input field with autocomplete set to new-password */}
            <InputField label="Password" type="password" placeholder="your password" autoComplete="new-password" />
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <p className="signup-text">
            Don’t have an account? <a href="#" onClick={handleSignUpClick}>Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
