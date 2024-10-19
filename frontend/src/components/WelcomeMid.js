import React from 'react';
import '../App.css';
import chatbot from '../img/chatbot.svg';  

const WelcomeMid = () => {
  return (
    <div className="welcome-mid">
      <div className="welcome-content">
        <h2>My Smart Memory</h2>
        <p>My Smart Memory is a personal assistant that saves and interacts with web content efficiently.</p>
        <button className="start-button">Start</button>
      </div>
      <img src={chatbot} alt="Chatbot Icon" className="chatbot-image" /> {/* add img */}
    </div>
  );
};

export default WelcomeMid;
