import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Editor from './pages/Editor';

function App() {
  const isOnboarded = localStorage.getItem('offcode_onboarded') === 'true';

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={isOnboarded ? <Navigate to="/editor" replace /> : <Home />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
