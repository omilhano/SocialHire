import React from 'react';
import './App.css';
import Footer from './components/Footer';
import NavbarSocialhire from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
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
import { ToastProvider } from './components/common/Toast';



function App() {
  return (
    <ToastProvider>
      <div className="App">
        <NavbarSocialhire />
        <Routes>
          {/* Define routes for created paths */}
          <Route path="/" element={<Landing />} />

          {/* <Route path="/profile" element={<Profile />} */}

          {/* Fallback 404 route for unknown paths */}
          <Route path="*" element={<NotFound />} />
          <Route path="/JobSearch" element={<JobSearch />} />
          <Route path="/UserProfile" element={<Profile />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path='/aboutus' element={<About />} />
          <Route path='/features' element={<Features />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/TOS" element={<TOS />} />
          <Route path="/Contacts" element={<Contacts />} />
          <Route path="/Credits" element={<Credits />} />

        </Routes>
        <Footer />
      </div>
    </ToastProvider>
  );
}

export default App;
