
// import React from 'react';
// import WelcomePage from './pages/WelcomePage'; 
// // import SignIn from './pages/SignIn';

// function App() {
//   return (
//     <div className="App">
//       <WelcomePage />
//       {/* <SignIn /> */}
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import SignIn from './pages/SignIn';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>     
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
