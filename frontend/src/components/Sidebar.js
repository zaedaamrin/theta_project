import React from 'react';

const Sidebar = ({ urlList = [] }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Your Library</h2>
        <button className="plus">+</button>
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
