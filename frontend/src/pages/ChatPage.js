// import React, { useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import Nav from '../components/Nav';
// import Profile from '../components/PersonalProfile';
// import Sidebar from '../components/Sidebar';
// import ChatArea from '../components/ChatArea';
// import URLSubmission from '../components/URLSubmission'; 
// import '../App.css';

// const ChatPage = () => {
//   const location = useLocation();
//   const urlList = location.state?.urlList || [];
//   const [messages, setMessages] = useState([
//     { type: 'bot', text: 'Welcome to Smart Memory Chat!' },
//   ]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleOpenModal = () => setIsModalOpen(true);
//   const handleCloseModal = () => setIsModalOpen(false);

//   return (
//     <div className="chatpage">
//       <Nav />
//       <div className="chatpage-container">
//         <Sidebar urlList={urlList} onOpenModal={handleOpenModal} />
//         <Profile />
//         <ChatArea messages={messages} setMessages={setMessages} />
//       </div>

//       {isModalOpen && (
//         <div className="modal-overlay" onClick={handleCloseModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <button onClick={handleCloseModal} className="close-button">×</button> {/* Close button */}
//             <URLSubmission onClose={handleCloseModal} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatPage;


import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../components/Nav';
import Profile from '../components/PersonalProfile';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import URLSubmission from '../components/URLSubmission';
import '../App.css';

const ChatPage = () => {
  const location = useLocation();
  const urlList = location.state?.urlList || [];
  const [messages, setMessages] = useState(() => {
    // Initialize messages from localStorage
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [{ type: 'bot', text: 'Welcome to Smart Memory Chat!' }];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    // Save messages to localStorage whenever they change
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  return (
    <div className="chatpage">
      <Nav />
      <div className="chatpage-container">
        <Sidebar urlList={urlList} onOpenModal={handleOpenModal} />
        <Profile />
        <ChatArea messages={messages} setMessages={setMessages} />
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={handleCloseModal} className="close-button">×</button> {/* Close button */}
            <URLSubmission onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;

