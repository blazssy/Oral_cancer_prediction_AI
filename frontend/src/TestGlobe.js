import React from 'react';
import Globe from './components/Globe';
import './App.css';

function TestGlobe() {
  return (
    <div className="App" style={{ padding: '2rem', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: 'white' }}>Globe Test</h1>
      <Globe />
    </div>
  );
}

export default TestGlobe;
