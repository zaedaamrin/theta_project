// components/ChatArea.js
import React, { useState } from 'react';
import '../App.css';

const ChatArea = ({ messages, setMessages }) => {
  const handleSendMessage = (e) => {
    e.preventDefault();
    const inputField = document.getElementById('chat-input');
    const messageText = inputField.value.trim();
    if (messageText) {
      setMessages([...messages, { type: 'user', text: messageText }]);
      inputField.value = ''; // Clear the input field after sending the message
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
        />
        <button type="submit" className="send-button">
          ➔
        </button>
      </form>
    </div>
  );
};

export default ChatArea;
