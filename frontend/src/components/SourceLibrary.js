
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

        const response = await fetch(`https://backend-theta-project.onrender.com/api/${userId}/sources`); // Use the correct route
        if (response.ok) {
          const data = await response.json();
          setSources(data.sources); // Store the sources in state
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

  const handleDelete = async (sourceId) => {
    const userId = localStorage.getItem('userId'); // Retrieve userId from local storage
    if (!userId) {
      console.error('User ID not found. Please log in again.');
      setError('User ID not found. Please log in again.');
      return;
    }

    try {
      const response = await fetch(`https://backend-theta-project.onrender.com/api/${userId}/sources/${sourceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSources((prevSources) => prevSources.filter((source) => source.sourceId !== sourceId)); // Update the list
      } else {
        console.error('Failed to delete source:', response.status, response.statusText);
        setError('Failed to delete the source.');
      }
    } catch (err) {
      console.error('Error deleting source:', err);
      setError('An error occurred while deleting the source.');
    }
  };

  const handleAddURLClick = () => {
    navigate('/add-url-2'); // Navigate to the "Add URL" page
  };

  return (
    <div className="source-library" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        className="library-content"
        style={{
          flex: 1,
          overflowY: 'auto', // Enable vertical scrolling
          maxHeight: '300px', // Limit the height of the scrollable area
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '10px',
        }}
      >
        {loading ? (
          <p>Loading sources...</p>
        ) : error ? (
          <p style={{ color: 'black', fontWeight: 'bold' }}>{error}</p>
        ) : sources.length > 0 ? (
          sources.map((source, index) => (
            <div
              key={source.sourceId}
              className="library-item"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '5px 10px',
                minHeight: '28px',
                borderBottom: '1px solid #ddd',
              }}
            >
              <span>
                {index + 1}.{' '}
                <a
                  href={source.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="source-link"
                >
                  {source.title || source.URL} {/* Display title if available, otherwise URL */}
                </a>
              </span>
              <button
                onClick={() => handleDelete(source.sourceId)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'black',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
                aria-label="Delete source"
              >
                &#x2716; {/* Unicode for black cross */}
              </button>
            </div>
          ))
        ) : (
          <p>No sources available.</p>
        )}
      </div>
      <div style={{ marginTop: '10px' }}>
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
