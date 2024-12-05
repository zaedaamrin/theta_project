

import React from 'react';
import { useSelector } from 'react-redux';
import Nav from '../components/Nav';
import URLSubmissionTable2 from '../components/URLSubmission2';
import Profile from '../components/PersonalProfile';
import '../App.css'; 

const URLSubmission2 = () => {
  const theme = useSelector((state) => state.theme.mode); 

  return (
    <div className={`url-submission-page ${theme}`}> {}
      <Nav />
      <Profile />
      <URLSubmissionTable2 />
    </div>
  );
};

export default URLSubmission2;
