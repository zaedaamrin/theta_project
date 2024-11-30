import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../components/Nav';
import Profile from '../components/PersonalProfile';
import Sidebar from '../components/Sidebar';
import ExistingChat from '../components/ExistingChat';
import URLSubmission from '../components/URLSubmission';
import '../App.css';

const ChatHistoryPage = () => {
  const location = useLocation();
  const urlList = location.state?.urlList || [];
  const [messages, setMessages] = useState([]); // Initialize messages without the welcome message
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="chatpage">
      <Nav />
      <div className="chatpage-container">
        <Sidebar urlList={urlList} onOpenModal={handleOpenModal} />
        <Profile />
        <ExistingChat messages={messages} setMessages={setMessages} />
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={handleCloseModal} className="close-button">×</button>
            <URLSubmission onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistoryPage;
