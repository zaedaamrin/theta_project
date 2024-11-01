import React, { useEffect, useState } from 'react';

const Sidebar = ({ onOpenModal }) => {
  const [urlList, setUrlList] = useState([]);

  // Load URLs from localStorage and listen for updates
  useEffect(() => {
    const savedUrls = JSON.parse(localStorage.getItem('urlList')) || [];
    setUrlList(savedUrls);

    // Listen for storage changes to sync Sidebar
    const handleStorageChange = () => {
      const updatedUrls = JSON.parse(localStorage.getItem('urlList')) || [];
      setUrlList(updatedUrls);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Your Library</h2>
        <button className="plus" onClick={onOpenModal}>+</button>
      </div>
      <div className="source-list">
        {urlList.map((item, index) => (
          <div key={index} className="source-item">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.name}
            </a>
          </div>
        ))}
      </div>
      <div className="total-sources">Total Sources: {urlList.length}</div>
    </div>
  );
};

export default Sidebar;
