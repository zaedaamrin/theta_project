import React, { useState } from 'react';

const URLSubmissionTable = () => {
  const [url, setUrl] = useState('');
  const [urlList, setUrlList] = useState([]);

  // Function to handle adding URL to the list
  const handleAddUrl = () => {
    if (url) {
      setUrlList([...urlList, url]);
      setUrl(''); // Clear the input after adding
    }
  };

  // Function to handle URL input
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  // Function to handle submission
  const handleSubmit = () => {
    if (urlList.length > 0) {
      console.log('Submitted URLs:', urlList);
      alert('URLs submitted successfully!');
      setUrlList([]); // Clear the list after submission
    }
  };

  return (
    <div className="url-submission-container">
      <h2 className="url-submission-title">Upload URL Sources</h2>
      <div className="url-input-container">
        <input
          type="text"
          placeholder="→ Paste the URL you want to save and press Enter"
          value={url}
          onChange={handleUrlChange}
          className="url-input"
          onKeyPress={(e) => e.key === 'Enter' && handleAddUrl()}
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