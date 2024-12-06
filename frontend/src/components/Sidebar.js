import React, { useEffect, useState } from 'react';

const Sidebar = ({ onOpenModal }) => {
  const [urlList, setUrlList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load URLs from the backend when the component mounts
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
        if (!userId) {
          console.error('User ID not found. Please log in again.');
          setError('User ID not found. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await fetch(`https://backend-theta-project.onrender.com/api/${userId}/sources`);
        if (response.ok) {
          const data = await response.json();
          setUrlList(data.sources); // Set the sources fetched from the backend
        } else {
          console.error('Failed to fetch sources:', response.status, response.statusText);
          setError('Failed to fetch sources.');
        }
      } catch (err) {
        console.error('Error fetching sources:', err);
        setError('An error occurred while fetching sources.');
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Your Library</h2>
        <button className="plus" onClick={onOpenModal}>+</button>
      </div>
      <div className="source-list">
        {loading ? (
          <p>Loading sources...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : urlList.length > 0 ? (
          urlList.map((item, index) => (
            <div key={index} className="source-item">
              <a href={item.URL} target="_blank" rel="noopener noreferrer">
                {item.title || item.URL} {/* Display title if available, otherwise URL */}
              </a>
            </div>
          ))
        ) : (
          <p>No sources available.</p>
        )}
      </div>
      <div className="total-sources">Total Sources: {urlList.length}</div>
    </div>
  );
};

export default Sidebar;
