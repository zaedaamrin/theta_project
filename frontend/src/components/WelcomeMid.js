
import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../App.css';
import chatbot from '../img/chatbot.svg';  

const WelcomeMid = () => {
  const navigate = useNavigate(); 

  const handleStartClick = () => {
    setTimeout(() => {
      navigate('/signin');
    }, 1000);
  };

  return (
    <div className="welcome-mid">
      <div className="welcome-content">
        <h2>My Smart Memory</h2>
        <p>My Smart Memory is a personal assistant that saves and interacts with web content efficiently.</p>
        <button className="start-button" onClick={handleStartClick}>Start</button> 
        

      </div>
      <img src={chatbot} alt="Chatbot Icon" className="chatbot-image" /> 
    </div>
  );
};

export default WelcomeMid;

