import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import '../App.css';

const ChatArea = ({ messages, setMessages }) => {
  const [chatId, setChatId] = useState(null); // State to store the chatId

  const createChat = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://backend-theta-project.onrender.com/api/${userId}/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('New chat created:', data);
        setChatId(data.chatId); // Assuming the backend returns { chatId: '12345' }
        return data.chatId;
      } else {
        console.error('Error initializing chat:', response.status, response.statusText);
      }
    } catch (err) {
      console.error('Error connecting to backend for chat initialization:', err);
    }
    return null;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const inputField = document.getElementById('chat-input');
    const messageText = inputField.value.trim();

    if (!messageText) return; // Do nothing if the input is empty

    // Add the user message to the messages array
    setMessages((prevMessages) => [...prevMessages, { type: 'user', text: messageText }]);

    let currentChatId = chatId;
    if (!currentChatId) {
      currentChatId = await createChat(); // Create chat only when the user sends their first message
      if (!currentChatId) return; // If chat creation fails, abort
    }

    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://backend-theta-project.onrender.com/api/${userId}/chats/${currentChatId}/message`, {
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
  };

  return (
    <div className="chat-area">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.type === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown>
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
        />
        <button type="submit" className="send-button">
          ➔
        </button>
      </form>
    </div>
  );
  
};

export default ChatArea;



