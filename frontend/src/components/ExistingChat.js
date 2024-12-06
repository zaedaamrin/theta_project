import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import '../App.css';

const ExistingChat = ({ messages, setMessages }) => {
  const location = useLocation();
  const [chatId, setChatId] = useState(location.state?.chatId || null); // Use chatId from state
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    if (chatId) {
      fetchChatHistory(chatId);
    }
  }, [chatId]);

  const fetchChatHistory = async (chatId) => {
    try {
      const response = await fetch(`https://backend-theta-project.onrender.com/api/${chatId}/chathistory`);
      if (response.ok) {
        const data = await response.json();
        if (data.messages) {
          setChatHistory(data.messages);
        }
      } else {
        console.error('Failed to fetch chat history:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const inputField = document.getElementById('chat-input');
    const messageText = inputField.value.trim();

    if (messageText && chatId) {
      // Add user message to the messages array
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'user', text: messageText },
      ]);

      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`https://backend-theta-project.onrender.com/api/${userId}/chats/${chatId}/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: messageText }),
        });

        if (response.ok) {
          const data = await response.json(); // Parse the response JSON
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'bot', text: data.response || 'No response from server' },
          ]);
        } else {
          console.error('Error from server:', response.status, response.statusText);
          setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'bot', text: 'Error: Unable to process the message.' },
          ]);
        }
      } catch (err) {
        console.error('Network or other error:', err);
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'bot', text: 'Error: Unable to connect to the server.' },
        ]);
      }

      inputField.value = ''; // Clear the input field after sending the message
    }
  };

  return (
    <div className="chat-area">
      {/* Chat messages */}
      <div className="chat-messages">
        {/* Welcome message */}
        <div className="message bot-message">
          <ReactMarkdown>Welcome to Smart Memory Chat!</ReactMarkdown>
        </div>

        {/* Chat history */}
        {chatHistory.map((msg, index) => (
          <div key={index} className="chat-message-container">
            {msg.prompt && (
              <div className="message user-message">
                <ReactMarkdown>{msg.prompt}</ReactMarkdown>
              </div>
            )}
            {msg.answer && (
              <div className="message bot-message">
                <ReactMarkdown>{msg.answer}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {/* New messages */}
        {messages.map((msg, index) => (
          <div
            key={`new-${index}`}
            className={`message ${msg.type === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
      </div>

      {/* Input area */}
      <form className="chat-input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          id="chat-input"
          placeholder="Ask Smart Memory"
          className="chat-input-field"
          autoComplete="off"
          disabled={!chatId} // Disable input until chatId is ready
        />
        <button type="submit" className="send-button" disabled={!chatId}>
          ➔
        </button>
      </form>
    </div>
  );
};

export default ExistingChat;
