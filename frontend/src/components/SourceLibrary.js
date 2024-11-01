import React from 'react';
import { useNavigate } from 'react-router-dom'; 


const SourceLibrary = () => {
  const navigate = useNavigate(); 
  
    const handleAddURLClick = () => {
      navigate('/add-url-2'); 
    };
    
  return (
    <div className="source-library" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="library-content">
        {/* Placeholder for library content */}
        <div className="library-item">Item 1</div>
        <div className="library-item">Item 2</div>
        <div className="library-item">Item 3</div>
        <div className="library-item">Item 4</div>
        <div className="library-item">Item 5</div>
      </div>
      <div style={{ marginTop: 'auto' }}>
        <button 
          className="action-button"
          style={{
            backgroundColor: 'white',
            color: 'black',
            fontWeight: 'bold',
            borderRadius: '20px',
            border: 'none',
            padding: '10px 60px',
            cursor: 'pointer'
          }}
          onClick={handleAddURLClick}>
          Add URL
        </button>
      </div>
    </div>
  );
};

export default SourceLibrary;
