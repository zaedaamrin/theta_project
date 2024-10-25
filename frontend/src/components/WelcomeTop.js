import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../App.css';

const WelcomeTop = () => {
    const navigate = useNavigate(); 
  
    const handleSignInClick = () => {
      navigate('/signin'); 
    };

    const handleSignUpClick = () => {
        navigate('/signup'); 
      };

  return (
    <div>
        <button
            className="welcome-login-button"
            onClick={handleSignInClick}>
            Log In
        </button>

        <button
            className="welcome-signup-button"
            onClick={handleSignUpClick}>
            Sign Up
        </button>
    </div>


    

    
  );
};

export default WelcomeTop;