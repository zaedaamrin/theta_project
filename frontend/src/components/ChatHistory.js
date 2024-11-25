import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatHistory = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('User ID not found. Please log in again.');
          setError('User ID not found. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:8000/api/${userId}/chats`);
        if (response.ok) {
          const data = await response.json();
          setChatHistory(data.chats);
        } else {
          console.error('Failed to fetch chat history:', response.status, response.statusText);
          setError('Failed to load chat history.');
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setError('An error occurred while fetching chat history.');
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  const handleNewChatClick = () => {
    navigate('/chatpage');
  };

  return (
    <div className="chat-history">
      <div className="history-content">
        {loading ? (
          <p>Loading chat history...</p>
        ) : error ? (
          <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>
        ) : chatHistory.length > 0 ? (
          chatHistory.map((chat, index) => (
            <div key={chat.chatId} className="history-item">
              {index + 1}.{' '}
              <a
                href={`/chatpage`}
                className="source-link"
              >
                {chat.title || `Chat ${index + 1}`}
              </a>
            </div>
          ))
        ) : (
          <p>No chat history available.</p>
        )}
      </div>
      <div style={{ marginTop: 'auto', padding: '20px' }}>
        <button
          className="action-button"
          style={{
            backgroundColor: 'black',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '20px',
            border: 'none',
            padding: '10px 60px',
            cursor: 'pointer',
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
