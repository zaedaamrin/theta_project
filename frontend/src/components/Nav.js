import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../App.css';

const Nav = () => {
  const navigate = useNavigate(); 

  const handleNavClick = () => {
    navigate('/'); 
  };

  return (
    <nav className="nav">
      <h1 onClick={handleNavClick} style={{ cursor: 'pointer' }}>Smart Memory</h1> 
    </nav>
  );
};

export default Nav;
