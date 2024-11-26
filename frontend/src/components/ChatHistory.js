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
          setChatHistory(data.chats || []);
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

  const handleDeleteChat = async (chatId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found. Please log in again.');
      setError('User ID not found. Please log in again.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/${userId}/chats/${chatId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted chat from the local state
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

  const handleNewChatClick = () => {
    navigate('/chatpage');
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
              <span>
                {index + 1}.{' '}
                <a
                  href={`/chatpage`}
                  className="source-link"
                  style={{
                    textDecoration: 'none',
                    color: 'black',
                    cursor: 'pointer',
                  }}
                >
                  {chat.chatName || `Chat ${index + 1}`}
                </a>
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
