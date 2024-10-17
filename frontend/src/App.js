import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [testData, setTestData] = useState('');

  useEffect(() => {
    fetch('/test')
      .then((response) => response.json())
      .then((data) => setTestData(data.message));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>{!testData ? "Loading..." : testData}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
