import React from 'react';
import './App.css';
import Footer from './components/Footer';
import NavbarSocialhire from './components/Navbar';
import LandingNavbar from './components/LandingNavbar';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import ChatPage from './pages/ChatPage';
import Checkout from './pages/checkoutTest';

function App() {
  const currentLocation = useLocation();

  // Define routes where the LandingNavbar should be used
  const landingNavbarRoutes = ['/', '/signin', '/signup', '/features', '/aboutus'];

  return (
    <div className="App">
      {/* Conditional Navbar */}
      {landingNavbarRoutes.includes(currentLocation.pathname.toLowerCase()) ? (
        <LandingNavbar />
      ) : (
        <NavbarSocialhire />
      )}

      <Routes>
        {/* Define routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/Main" element={<Main />} />
        <Route path="/JobSearch" element={<JobSearch />} />
        <Route path="/UserProfile" element={<Profile />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/TOS" element={<TOS />} />
        <Route path="/Contacts" element={<Contacts />} />
        <Route path="/Credits" element={<Credits />} />
        <Route path="/ChatPage" element={<ChatPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/features" element={<Features />} />
        <Route path="/aboutus" element={<About />} />
        <Route path='/checkout' element={<Checkout/>} />

        {/* Fallback 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;