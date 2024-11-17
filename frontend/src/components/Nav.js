import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../App.css';
import logo from '../img/logo.png';

const Nav = () => {
  const navigate = useNavigate(); 

  const handleNavClick = () => {
    navigate('/welcome'); 
  };

  return (
    <nav className="nav">
      <img 
        src={logo} 
        alt="Smart Memory Logo" 
        style={{cursor: 'pointer' }} 
        onClick={handleNavClick}
      />
      <h1 onClick={handleNavClick} style={{ cursor: 'pointer' }}>Smart Memory</h1> 
    </nav>
  );
};

export default Nav;
