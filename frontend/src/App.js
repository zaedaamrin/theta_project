
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import SignIn from './pages/SignIn';
import PersonalHome from './pages/PersonalHome';
import RegistrationPage from './pages/RegistrationPage';
import URLSubmission from './pages/URLSubmissionPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>     
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/personal-home" element={<PersonalHome />} />
          <Route path="/signup" element={<RegistrationPage />} />
          <Route path="/add-url" element={<URLSubmission />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
