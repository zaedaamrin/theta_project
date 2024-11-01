import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URLSubmissionTable2 = () => {
  const [url, setUrl] = useState('');
  const [urlName, setUrlName] = useState('');
  const [urlList, setUrlList] = useState(() => JSON.parse(localStorage.getItem('urlList')) || []);
  const navigate = useNavigate();

  const handleAddUrl = () => {
    if (url && urlName) {
      const updatedList = [...urlList, { url, name: urlName }];
      setUrlList(updatedList);
      localStorage.setItem('urlList', JSON.stringify(updatedList)); // Save to localStorage
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
    const updatedList = urlList.filter((_, i) => i !== index);
    setUrlList(updatedList);
    localStorage.setItem('urlList', JSON.stringify(updatedList)); // Update localStorage
  };

  const handleSubmit = () => {
    if (urlList.length > 0) {
      console.log('Submitted URLs:', urlList);
      navigate('/chatpage', { state: { urlList } });
    }
  };

  return (
    <div className="url-submission-container">
      <div className="back-to-home" onClick={() => navigate('/personal-home')}>
        ← Return to homepage
      </div>
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

export default URLSubmissionTable2;
