import React from 'react';
import Nav from '../components/Nav';
import URLSubmissionTable from '../components/URLSubmission';
import Profile from '../components/PersonalProfile';
import '../App.css'; // Import your styles

const URLSubmission = () => {
  return (
    <div className="url-submission-page">
      <Nav />
      <Profile />
      <URLSubmissionTable />
    </div>
  );
};

export default URLSubmission;
