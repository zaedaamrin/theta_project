
import React, { useState } from 'react';

const URLSubmissionTable2 = () => {
  const [url, setUrl] = useState('');
  const [urlName, setUrlName] = useState('');
  const [urlList, setUrlList] = useState([]);

  // Function to handle adding URL and Name to the list
  const handleAddUrl = () => {
    if (url && urlName) {
      setUrlList([...urlList, { url, name: urlName }]);
      setUrl(''); // Clear the URL input after adding
      setUrlName(''); // Clear the name input after adding
    }
  };

  // Function to handle URL input
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  // Function to handle URL Name input
  const handleUrlNameChange = (e) => {
    setUrlName(e.target.value);
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
        <input
          type="text"
          placeholder="Enter a name for the URL"
          value={urlName}
          onChange={handleUrlNameChange}
          className="url-name-input"
        />
        <button onClick={handleAddUrl} className="add-button">
          Add
        </button>
      </div>
      <div className="url-list-container">
        <h3 className="url-list-title">New URL Source List</h3>
        <div className="url-list">
          {urlList.map((item, index) => (
            <div key={index} className="url-item">
              <strong>Name:</strong> {item.name} <br />
              <strong>URL:</strong> {item.url}
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
