
import React from 'react';
import './App.css';
import Footer from './components/Footer';
import NavbarSocialhire from './components/Navbar';
import LandingNavbar from './components/LandingNavbar'; // Import the different navbar
import { Routes, Route, useLocation } from 'react-router-dom'; // Import useLocation
import NotFound from './pages/NotFound';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TOS from './pages/TOS';
import Contacts from './pages/Contacts';
import Credits from './pages/Credits';
import JobSearch from './pages/JobSearch';
import Profile from './pages/UserProfile';
import Features from './pages/Features';
import Main from './pages/MainPage';

function App() {
  const currentLocation = useLocation(); // Use useLocation hook to get the current route
  return (
    <div className="App">
      {/* Conditional Navbar */}
      {currentLocation.pathname === '/' ? <LandingNavbar /> : <NavbarSocialhire />}

      <Routes>
        {/* Define routes for created paths */}
        <Route path="/" element={<Landing />} />

        {/* Other Routes */}
        <Route path="/Main" element={<Main />} />
        <Route path="/JobSearch" element={<JobSearch />} />
        <Route path="/UserProfile" element={<Profile />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/aboutus" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/TOS" element={<TOS />} />
        <Route path="/Contacts" element={<Contacts />} />
        <Route path="/Credits" element={<Credits />} />

        {/* Fallback 404 route for unknown paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
};

export default App;