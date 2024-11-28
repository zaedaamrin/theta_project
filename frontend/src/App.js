
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import WelcomePage from './pages/WelcomePage';
// import SignIn from './pages/SignIn';
// import PersonalHome from './pages/PersonalHome';
// import RegistrationPage from './pages/RegistrationPage';
// import URLSubmission from './pages/URLSubmissionPage';
// import URLSubmission2 from './pages/URLSubmissionPage2';
// import ChatPage from './pages/ChatPage';
// import ChatHistoryPage from './pages/ChatHistoryPage';

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <Routes>     
//           <Route path="/welcome" element={<WelcomePage />} />
//           <Route path="/signin" element={<SignIn />} />
//           <Route path="/personal-home" element={<PersonalHome />} />
//           <Route path="/signup" element={<RegistrationPage />} />
//           {/* <Route path="/add-url" element={<URLSubmission />} /> */}
//           <Route path="/add-url-2" element={<URLSubmission2 />} />
//           <Route path="/chatpage" element={<ChatPage />} />
//           <Route path="/chathistorypage" element={<ChatHistoryPage />} />

//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;


import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux'; // 引入 Redux Provider
import { useSelector } from 'react-redux'; // 获取 Redux 状态

import WelcomePage from './pages/WelcomePage';
import SignIn from './pages/SignIn';
import PersonalHome from './pages/PersonalHome';
import RegistrationPage from './pages/RegistrationPage';
import URLSubmission2 from './pages/URLSubmissionPage2';
import ChatPage from './pages/ChatPage';
import ChatHistoryPage from './pages/ChatHistoryPage';
import { store } from './store'; // 引入配置好的 Redux Store

function AppContent() {
  const themeMode = useSelector((state) => state.theme.mode); // 获取 Redux 中的主题状态

  // 根据 Redux 中的主题动态设置 body 样式
  useEffect(() => {
    document.body.className = themeMode === 'dark' ? 'dark-mode' : 'light-mode';
  }, [themeMode]);

  return (
    <div className="App">
      <Routes>
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
