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

        const response = await fetch(`https://backend-theta-project.onrender.com/api/${userId}/chats`);
        if (response.ok) {
          const data = await response.json();
          setChatHistory(data.chats || []);
        } else {
          console.error('Failed to fetch chat history:', response.status, response.statusText);
          setError('Click New Chat to start chatting...');
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

  const handleDeleteChat = async (chatId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found. Please log in again.');
      setError('User ID not found. Please log in again.');
      return;
    }

    try {
      const response = await fetch(`https://backend-theta-project.onrender.com/api/${userId}/chats/${chatId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setChatHistory((prevChats) => prevChats.filter((chat) => chat.chatId !== chatId));
      } else {
        console.error('Failed to delete chat:', response.status, response.statusText);
        setError('Failed to delete the chat.');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      setError('An error occurred while deleting the chat.');
    }
  };

  const handleNewChatClick = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found. Please log in again.');
      setError('User ID not found. Please log in again.');
      return;
    }

    try {
      // Fetch the source library to check if it contains any sources
      const response = await fetch(`https://backend-theta-project.onrender.com/api/${userId}/sources`);
      if (response.ok) {
        localStorage.removeItem('chatMessages');
        navigate('/chatpage');
      } else {
        navigate('/add-url-2');
      }
    } catch (error) {
      console.error('Error checking source library:', error);
      setError('An error occurred while checking the source library.');
    }
  };

  const handleChatClick = (chatId) => {
    navigate('/chathistorypage', { state: { chatId } }); // Pass chatId to the target page
  };

  return (
    <div className="chat-history" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        className="history-content"
        style={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: '300px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '10px',
        }}
      >
        {loading ? (
          <p>Loading chat history...</p>
        ) : error ? (
          <p style={{ color: 'black', fontWeight: 'bold' }}>{error}</p>
        ) : chatHistory.length > 0 ? (
          chatHistory.map((chat, index) => (
            <div
              key={chat.chatId}
              className="history-item"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                padding: '10px',
                borderBottom: '1px solid #eee',
              }}
            >
              <span
                onClick={() => handleChatClick(chat.chatId)} // Handle click and navigate with chatId
                className="source-link"
                style={{
                  textDecoration: 'none',
                  color: 'black',
                  cursor: 'pointer',
                }}
              >
                {index + 1}. {chat.chatName || `Chat ${index + 1}`}
              </span>
              <button
                onClick={() => handleDeleteChat(chat.chatId)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'black',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
                aria-label="Delete chat"
              >
                &#x2716; {/* Unicode for cross symbol */}
              </button>
            </div>
          ))
        ) : (
          <p>No chat history available.</p>
        )}
      </div>
      <div style={{ marginTop: '10px', padding: '10px' }}>
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
