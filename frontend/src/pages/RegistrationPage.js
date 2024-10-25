import React from 'react';
import Nav from '../components/Nav';
import '../App.css';
import InputField from '../components/InputField'; 

const RegistrationPage = () => {
  return (
    <div className="Registrationpage">
      <Nav />
      <div className="registration-container">
        <h1>Smart Memory</h1>
        <div className="registration-box">
          <h2>Account Registration</h2>

          <form autoComplete="off">
            <InputField label="Create your username" type="username" placeholder="enter username" autoComplete="off" />
            <InputField label="Enter your email address" type="email" placeholder="your email address" autoComplete="off" />
            <InputField label="Create your password" type="password" placeholder="enter password" autoComplete="off" />
            <InputField label="Confirm your password" type="password" placeholder="confirm password" autoComplete="off" />
            
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
