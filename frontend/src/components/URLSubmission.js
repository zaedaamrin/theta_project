import React, { useState } from 'react';

const URLSubmissionTable = () => {
  const [url, setUrl] = useState('');
  const [urlList, setUrlList] = useState([]);

  const handleAddUrl = () => {
    if (url) {
      setUrlList([...urlList, url]);
      setUrl(''); 
    }
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleDeleteUrl = (index) => {
    const newUrlList = urlList.filter((_, i) => i !== index);
    setUrlList(newUrlList);
  };

  const handleSubmit = () => {
    if (urlList.length > 0) {
      console.log('Submitted URLs:', urlList);
      alert('URLs submitted successfully!');
      setUrlList([]); 
    }
  };

  return (
    <div className="url-submission-container">
      <h2 className="url-submission-title">Upload URL Sources</h2>
      <div className="url-input-container">
        <input
          type="text"
          placeholder="→ Paste the URL you want to save and press Enter or click add button"
          value={url}
          onChange={handleUrlChange}
          className="url-input"
          onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
        />
        <button onClick={handleAddUrl} className="add-button">
          Add
        </button>
      </div>
      <div className="url-list-container">
        <h3 className="url-list-title">New URL Source List</h3>
        <div className="url-list">
          {urlList.map((url, index) => (
            <div key={index} className="url-item">
              {url}
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
