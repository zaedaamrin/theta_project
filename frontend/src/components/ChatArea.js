

import React, { useState } from 'react';
import '../App.css';

const ChatArea = ({ messages, setMessages }) => {
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const inputField = document.getElementById('chat-input');
    const messageText = inputField.value.trim();

    if (messageText) {
      // Add the user message to the messages array
      setMessages([...messages, { type: 'user', text: messageText }]);

      try {
        const response = await fetch('http://localhost:8000/api/0/chats/0/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: messageText }), // Use key-value pair as specified
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
          autoComplete='off'
        />
        <button type="submit" className="send-button">
          ➔
        </button>
      </form>
    </div>
  );
};

export default ChatArea;
