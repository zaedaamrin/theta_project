// import React from 'react';
// import { useNavigate } from 'react-router-dom'; 
// import '../App.css';
// import logo from '../img/logo.png';

// const Nav = () => {
//   const navigate = useNavigate(); 

//   const handleNavClick = () => {
//     navigate('/welcome'); 
//   };

//   return (
//     <nav className="nav">
//       <img 
//         src={logo} 
//         alt="Smart Memory Logo" 
//         style={{cursor: 'pointer' }} 
//         onClick={handleNavClick}
//       />
//       <h1 onClick={handleNavClick} style={{ cursor: 'pointer' }}>Smart Memory</h1> 
//     </nav>
//   );
// };

// export default Nav;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../App.css';
// import logo from '../img/logo.png';

// const Nav = () => {
//   const navigate = useNavigate();
//   const [isDarkMode, setIsDarkMode] = useState(true);

//   const handleNavClick = () => {
//     navigate('/welcome');
//   };

//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode);
//     document.body.className = isDarkMode ? 'light-mode' : 'dark-mode';
//   };

//   return (
//     <nav className="nav">
//       <img
//         src={logo}
//         alt="Smart Memory Logo"
//         style={{ cursor: 'pointer' }}
//         onClick={handleNavClick}
//       />
//       <h1 onClick={handleNavClick} style={{ cursor: 'pointer' }}>
//         Smart Memory
//       </h1>
//       <div className="theme-switch" >
//         <label className="switch">
//           <input type="checkbox" onChange={toggleTheme} />
//           <span className="slider round"></span>
//         </label>
//       </div>
//     </nav>
//   );
// };

// export default Nav;


import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';
import '../App.css';
import logo from '../img/logo.png';
import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const themeMode = useSelector((state) => state.theme.mode);

  const handleNavClick = () => {
    navigate('/welcome');
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <nav className="nav">
      <img
        src={logo}
        alt="Smart Memory Logo"
        style={{ cursor: 'pointer' }}
        onClick={handleNavClick}
      />
      <h1 onClick={handleNavClick} style={{ cursor: 'pointer' }}>
        Smart Memory
      </h1>
      <div className="theme-switch">
        <label className="switch">
          <input
            type="checkbox"
            checked={themeMode === 'dark'}
            onChange={handleToggleTheme}
          />
          <span className="slider round"></span>
        </label>
      </div>
    </nav>
  );
};

export default Nav;
