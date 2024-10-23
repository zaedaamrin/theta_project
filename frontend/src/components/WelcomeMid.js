import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../App.css';
import chatIcon from '../img/chat.svg'; 
import bookIcon from '../img/book.svg';
import navIcon from '../img/nav.svg';

const WelcomeMid = () => {
  const navigate = useNavigate(); 

  const handleStartClick = () => {
    setTimeout(() => {
      navigate('/signin');
    }, 1000);
  };

  return (
    <div className="intro-container">
      <div className="intro-content">
      <h2>My Smart Memory</h2>
      <p>My Smart Memory is a personal assistant that saves and interacts with web content efficiently.</p>
        <div className="intro-features">
          <div className="feature">
            <div style={{
              width: '140px',
              height: '140px',
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 20px auto'
            }}>
              <img src={navIcon} alt="Library Icon" style={{ width: '58%' }} />
            </div>
            <p style={{ fontWeight: 'bold' }}>Your personal content library</p>
            <p>Save and store important web content easily.</p>
          </div>
          
          <div className="feature">
            <div style={{
              width: '140px',
              height: '140px',
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 20px auto'
            }}>
              <img src={bookIcon} alt="Search Icon" style={{ width: '60%' }} />
            </div>
            <p style={{ fontWeight: 'bold' }}>Instant search results</p>
            <p>Quickly find answers within your saved content.</p>
          </div>
          
          <div className="feature">
            <div style={{
              width: '140px',
              height: '140px',
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 20px auto'
            }}>
              <img src={chatIcon} alt="Assistant Icon" style={{ width: '65%', marginTop:'10px'}} />
            </div>
            <p style={{ fontWeight: 'bold' }}>Tailored personal assistant</p>
            <p>Get customized answers based on your preferences.</p>
          </div>
        </div>
        <button className="start-button" onClick={handleStartClick}>Start</button> 
      </div>
    </div>
  );
};

export default WelcomeMid;
