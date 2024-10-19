import React from 'react';
import Nav from '../components/Nav';
import '../App.css';
import InputField from '../components/InputField'; 

const LoginPage = () => {
  return (
    <div className="login-page">
        <Nav />
      <div className="login-container">
        <h1>Smart Memory</h1>
        <div className="login-box">
          <h2>Sign In</h2>
          <form>
            <InputField label="Email Address" type="email" placeholder="your email address" />
            <InputField label="Password" type="password" placeholder="your password" />
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
          <p className="signup-text">
            Don’t have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;