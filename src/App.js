import React from 'react';
import logo from './logo.svg';
import './App.css';
import Footer from './components/Footer';
import NavbarSocialhire from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import Landing from './pages/Landing';

function App() {
  return (
    <div className="App">
      <NavbarSocialhire />
      <Routes>
        {/* Define routes for created paths */}
        <Route path="/" element={<Landing />} />

        {/* <Route path="/profile" element={<Profile />} */}

        {/* Fallback 404 route for unknown paths */}
        <Route path="*" element={<NotFound />} />

      </Routes>
      <Footer />
    </div>
  );
}

export default App;