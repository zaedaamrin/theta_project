import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../App.css';
import PersonalIcon from '../img/avatar-icon.svg'; 

const Profile = () => {
  const navigate = useNavigate();

  const goToPersonalHome = () => {
    navigate('/personal-home'); 
  };

  return (
    <div>
      <img
        src={PersonalIcon}
        alt="Profile"
        className="profile-avatar"
        onClick={goToPersonalHome}
      />
    </div>
  );
};

export default Profile;