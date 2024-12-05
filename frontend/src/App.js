

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux'; 
import { useSelector } from 'react-redux'; 

import WelcomePage from './pages/WelcomePage';
import SignIn from './pages/SignIn';
import PersonalHome from './pages/PersonalHome';
import RegistrationPage from './pages/RegistrationPage';
import URLSubmission2 from './pages/URLSubmissionPage2';
import ChatPage from './pages/ChatPage';
import ChatHistoryPage from './pages/ChatHistoryPage';
import { store } from './store'; 

function AppContent() {
  const themeMode = useSelector((state) => state.theme.mode); 

  useEffect(() => {
    document.body.className = themeMode === 'dark' ? 'dark-mode' : 'light-mode';
  }, [themeMode]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/personal-home" element={<PersonalHome />} />
        <Route path="/signup" element={<RegistrationPage />} />
        <Route path="/add-url-2" element={<URLSubmission2 />} />
        <Route path="/chatpage" element={<ChatPage />} />
        <Route path="/chathistorypage" element={<ChatHistoryPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
