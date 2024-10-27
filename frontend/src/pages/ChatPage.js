import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../components/Nav';
import Profile from '../components/PersonalProfile';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea'; 
import '../App.css';

const ChatPage = () => {
  const location = useLocation();
  const urlList = location.state?.urlList || [];
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Welcome to Smart Memory Chat!' },
  ]);

  return (
    <div className="chatpage">
      <Nav />
      <div className="chatpage-container">
        <Sidebar urlList={urlList} />
        <Profile />
        <ChatArea messages={messages} setMessages={setMessages} /> 
      </div>
    </div>
  );
};

export default ChatPage;
