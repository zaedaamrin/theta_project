import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import '../App.css';

const ExistingChat = ({ messages, setMessages }) => {
  const location = useLocation();
  const [chatId, setChatId] = useState(location.state?.chatId || ''); // Use chatId from state
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    if (chatId) {
      fetchChatHistory(chatId);
    }
  }, [chatId]);

  const fetchChatHistory = async (chatId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/${chatId}/chathistory`);
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

  return (
    <div className="chat-area">
      <div className="chat-messages">
        <div className="message bot-message">
          <ReactMarkdown>Welcome to Smart Memory Chat!</ReactMarkdown>
        </div>
        {chatHistory.map((msg, index) => (
          <div key={index} className="chat-message-container">
            {msg.prompt && <div className="message user-message"><ReactMarkdown>{msg.prompt}</ReactMarkdown></div>}
            {msg.answer && <div className="message bot-message"><ReactMarkdown>{msg.answer}</ReactMarkdown></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExistingChat;
