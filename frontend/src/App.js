
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import SignIn from './pages/SignIn';
import PersonalHome from './pages/PersonalHome';
import RegistrationPage from './pages/RegistrationPage';
import URLSubmission from './pages/URLSubmissionPage';
import URLSubmission2 from './pages/URLSubmissionPage2';
import ChatPage from './pages/ChatPage';
import ChatHistoryPage from './pages/ChatHistoryPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>     
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/personal-home" element={<PersonalHome />} />
          <Route path="/signup" element={<RegistrationPage />} />
          {/* <Route path="/add-url" element={<URLSubmission />} /> */}
          <Route path="/add-url-2" element={<URLSubmission2 />} />
          <Route path="/chatpage" element={<ChatPage />} />
          <Route path="/chathistorypage" element={<ChatHistoryPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
