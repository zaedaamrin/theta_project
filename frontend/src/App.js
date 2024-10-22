
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import SignIn from './pages/SignIn';
import PersonalHome from './pages/PersonalHome';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>     
          <Route path="/weclome" element={<WelcomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/personal-home" element={<PersonalHome />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
