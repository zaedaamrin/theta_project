import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../App.css'; 
import chatIcon from '../img/chat.svg'; 
import bookIcon from '../img/book.svg';
import navIcon from '../img/nav.svg';

const Intro = () => {
  const navigate = useNavigate();
  const handleChatClick = () => {
    setTimeout(() => {
      navigate('/signin'); 
    }, 1000);
  };

  return (
    <div className="intro-container">
      <div className="intro-content" >
        <input
          className="intro-input" 
          type="text" 
          placeholder="  Simply copy and paste the web page you want to save, then press Enter to store it instantly." 
          style={{ borderRadius: '20px'}} 
        />
        <div className="intro-features" style={{ marginTop: '36px' }}>
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
        <button 
          className="start-button" 
          onClick={handleChatClick} 
          style={{ marginTop: '40px' }} 
        >
          Chat
        </button>
      </div>
    </div>
  );
};

export default Intro;
