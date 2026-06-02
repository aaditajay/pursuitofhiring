import React, { useState } from 'react';
import Home from './Home';
import Interview from './Interview';
import Results from './Results';
import WarpBackground from './WarpBackground';
import './index.css';

function App() {
  const [screen, setScreen] = useState('home');
  const [interviewData, setInterviewData] = useState(null);
  const [resultsData, setResultsData] = useState(null);

  const startInterview = (data) => {
    setInterviewData(data);
    setScreen('interview');
  };

  const showResults = (data) => {
    setResultsData(data);
    setScreen('results');
  };

  const restart = () => {
    setInterviewData(null);
    setResultsData(null);
    setScreen('home');
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <WarpBackground />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {screen === 'home' && <Home onStart={startInterview} />}
        {screen === 'interview' && <Interview data={interviewData} onFinish={showResults} />}
        {screen === 'results' && <Results data={resultsData} onRestart={restart} />}
      </div>
    </div>
  );
}

export default App;