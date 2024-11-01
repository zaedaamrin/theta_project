import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatHistory = () => {
  const navigate = useNavigate();

  const handleNewChatClick = () => {
    navigate('/chatpage'); // Update with the correct path to ChatPage
  };

  return (
    <div className="chat-history" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="history-content">
        {/* Placeholder for chat history */}
        <div className="history-item">Chat 1</div>
        <div className="history-item">Chat 2</div>
        <div className="history-item">Chat 3</div>
        <div className="history-item">Chat 4</div>
        <div className="history-item">Chat 5</div>
      </div>
      <div style={{ marginTop: 'auto' }}>
        <button 
          className="action-button"
          style={{
            backgroundColor: 'white',
            color: 'black',
            fontWeight: 'bold',
            borderRadius: '20px',
            border: 'none',
            padding: '10px 60px',
            cursor: 'pointer'
          }}
          onClick={handleNewChatClick}
        >
          New Chat
        </button>
      </div>
    </div>
  );
};

export default ChatHistory;
