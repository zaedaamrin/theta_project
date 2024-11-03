import React from 'react';
import Nav from '../components/Nav';
import SourceLibrary from '../components/SourceLibrary';
import ChatHistory from '../components/ChatHistory';
import Profile from '../components/PersonalProfile';
import '../App.css'; // Import your styles

const PersonalHome = () => {
  return (
    <div className="personal-home">
      <Nav />
      <Profile/>
      <div className="content-container">
        {/* Move the headings outside the components */}
        <div className="column">
          <h2 className="section-heading">Source Library</h2>
          <SourceLibrary />
        </div>
        <div className="column">
          <h2 className="section-heading">Chat History</h2>
          <ChatHistory />
        </div>
      </div>
    </div>
  );
};

export default PersonalHome;
