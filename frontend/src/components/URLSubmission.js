import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const URLSubmissionTable = ({ onClose }) => {
  const [url, setUrl] = useState('');
  const [urlName, setUrlName] = useState('');
  const [urlList, setUrlList] = useState([]);
  const navigate = useNavigate();

  // Load URLs from localStorage when component mounts
  useEffect(() => {
    const savedUrls = JSON.parse(localStorage.getItem('urlList')) || [];
    setUrlList(savedUrls);
  }, []);

  const handleAddUrl = () => {
    if (url && urlName) {
      const newUrlList = [...urlList, { url, name: urlName }];
      setUrlList(newUrlList);
      localStorage.setItem('urlList', JSON.stringify(newUrlList)); // Save to localStorage
      setUrl('');
      setUrlName('');
    }
  };

  const handleUrlChange = (e) => {
    let inputUrl = e.target.value;
    if (!inputUrl.startsWith("https://")) {
      inputUrl = "https://" + inputUrl;
    }
    try {
      const urlObj = new URL(inputUrl);
      setUrl(urlObj.href);
    } catch (err) {
      console.error("Invalid URL");
    }
  };

  const handleUrlNameChange = (e) => {
    setUrlName(e.target.value);
  };

  const handleDeleteUrl = (index) => {
    const newUrlList = urlList.filter((_, i) => i !== index);
    setUrlList(newUrlList);
    localStorage.setItem('urlList', JSON.stringify(newUrlList)); // Update localStorage
  };

  const handleSubmit = () => {
    if (urlList.length > 0) {
      console.log('Submitted URLs:', urlList);
      navigate('/chatpage', { state: { urlList } });
      onClose(); // Close the modal after submission
    }
  };

  return (
    <div className="url-submission-container">
      <h2 className="url-submission-title">Upload URL Sources</h2>
      <div className="url-input-container">
        <input
          type="text"
          placeholder="→ Paste the URL you want to save"
          value={url}
          onChange={handleUrlChange}
          className="url-input"
          onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
        />
        <input
          type="text"
          placeholder="Enter a name for the URL"
          value={urlName}
          onChange={handleUrlNameChange}
          className="url-name-input"
          onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
        />
        <button onClick={handleAddUrl} className="add-button">
          Add
        </button>
      </div>
      <div className="url-list-container">
        <h3 className="url-list-title">Existing URL Source List</h3>
        <div className="url-list-header">
          <span className="url-name-header">Name</span>
          <span className="url-url-header">URL</span>
        </div>
        <div className="url-list">
          {urlList.map((item, index) => (
            <div key={index} className="url-item">
              <span className="url-name">{item.name}</span>
              <span className="url-url">{item.url}</span>
              <button onClick={() => handleDeleteUrl(index)} className="delete-button">
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="url-footer">
        <p className="url-count">URL Count: {urlList.length}</p>
        <button onClick={handleSubmit} className="submit-button">
          Submit
        </button>
      </div>
    </div>
  );
};

export default URLSubmissionTable;
