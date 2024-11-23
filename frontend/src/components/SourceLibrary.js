import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SourceLibrary = () => {
  const navigate = useNavigate();
  const [sources, setSources] = useState([]); // State to store the source list
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors

  // Fetch the source list when the component mounts
  useEffect(() => {
    const fetchSources = async () => {
      try {
        const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
        if (!userId) {
          console.error('User ID not found. Please log in again.');
          setError('User ID not found. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:8000/api/${userId}/sources`); // Use the correct route
        if (response.ok) {
          const data = await response.json();
          setSources(data.sources); // Store the first five sources in state
        } else {
          console.error('Failed to fetch sources:', response.status, response.statusText);
          setError('No sources...');
        }
      } catch (err) {
        console.error('Error fetching sources:', err);
        setError('An error occurred while fetching sources.');
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchSources();
  }, []);

  const handleAddURLClick = () => {
    navigate('/add-url-2'); // Navigate to the "Add URL" page
  };

  return (
    <div className="source-library" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="library-content">
        {loading ? (
          <p>Loading sources...</p>
        ) : error ? (
          <p style={{ color: 'black', fontWeight: 'bold'}}>{error}</p>
        ) : sources.length > 0 ? (
          sources.map((source, index) => (
            <div key={source.sourceId} className="library-item">
              {index + 1}. {source.title || source.URL} {/* Display title or URL */}
            </div>
          ))
        ) : (
          <p>No sources available.</p>
        )}
      </div>
      <div style={{ marginTop: 'auto' }}>
        <button
          className="action-button"
          style={{
            backgroundColor: 'black',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '20px',
            border: 'none',
            padding: '10px 60px',
            cursor: 'pointer',
          }}
          onClick={handleAddURLClick}
        >
          Add URL
        </button>
      </div>
    </div>
  );
};

export default SourceLibrary;
