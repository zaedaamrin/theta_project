import React from 'react';
import Nav from '../components/Nav';
import URLSubmissionTable2 from '../components/URLSubmission2';
import Profile from '../components/PersonalProfile';
import '../App.css'; // Import your styles

const URLSubmission2 = () => {
  return (
    <div className="url-submission-page">
      <Nav />
      <Profile />
      <URLSubmissionTable2 />
    </div>
  );
};

export default URLSubmission2;