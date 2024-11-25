import React, { useState, useEffect } from 'react';
import '../App.css';

const ChatArea = ({ messages, setMessages }) => {
  const [chatId, setChatId] = useState(null); // State to store the chatId

  useEffect(() => {
    // Fetch or create a chat session and get the chatId
    const initializeChat = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:8000/api/${userId}/chats`, {
          method: 'POST', // Adjust to GET if fetching an existing chat session
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setChatId(data.chatId); // Assuming the backend returns { chatId: '12345' }
        } else {
          console.error('Error initializing chat:', response.status, response.statusText);
        }
      } catch (err) {
        console.error('Error connecting to backend for chat initialization:', err);
      }
    };

    initializeChat();
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const inputField = document.getElementById('chat-input');
    const messageText = inputField.value.trim();

    if (messageText && chatId) { // Ensure chatId is available
      // Add the user message to the messages array
      setMessages([...messages, { type: 'user', text: messageText }]);

      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:8000/api/${userId}/chats/${chatId}/message`, {
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
            { type: 'bot', text: data.response || 'No response from server' }, // Assuming "response" is the key for bot's reply
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

      // Clear the input field after sending the message
      inputField.value = '';
    }
  };

  return (
    <div className="chat-area">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.type === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
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

export default ChatArea;
