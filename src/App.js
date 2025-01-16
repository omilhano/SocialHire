import React, { useState } from 'react';
import './App.css';
import Footer from 'common/components/Footer';
import NavbarSocialhire from 'common/components/navbar/Navbar';
import LandingNavbar from 'common/components/landingNavbar/LandingNavbar';
import { Routes, Route, useLocation } from 'react-router-dom';
import NotFound from 'pages/notFound/NotFound.js';
import Landing from 'pages/landing/Landing';
import SignIn from 'pages/signIn/SignIn';
import SignUp from 'pages/signUp/SignUp.js';
import About from 'pages/about/AboutUs';
import PrivacyPolicy from 'pages/privacyPolicy/PrivacyPolicy';
import TOS from 'pages/TOS/TOS';
import Contacts from 'pages/contacts/Contacts';
import Credits from 'pages/credits/Credits';
import JobSearch from 'pages/jobSearch/JobSearch';
import Profile from 'pages/profile/profileEdit/UserProfile';
import Features from 'pages/features/Features';
import Main from 'pages/main/MainPage';
import ChatPage from 'pages/chat/ChatPage';
import ProfilePage from 'pages/profile/profileView/ProfilePage';
import CompanyProfile from 'pages/companyProfile/CompanyProfile1';
import ApplicationsPage from 'pages/applications/Applications';
import JobDetailPage from 'pages/jobSearch/components/JobDetailPage';

function App() {
  const [filters, setFilters] = useState({ jobType: '', location: '', numOfPeople: '' }); // Define filters state
  const currentLocation = useLocation();

  // Define routes where the LandingNavbar should be used
  const landingNavbarRoutes = ['/', '/signin', '/signup', '/features', '/aboutus', '/tos', '/privacypolicy', '/contacts', '/credits'];

  return (
    <div className="App">
      {/* Conditional Navbar */}
      {landingNavbarRoutes.includes(currentLocation.pathname.toLowerCase()) ? (
        <LandingNavbar />
      ) : (
        <NavbarSocialhire setFilters={setFilters} /> // Pass setFilters to NavbarSocialhire
      )}

      <Routes>
        {/* Define routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/Main" element={<Main />} />
        <Route path="/JobSearch" element={<JobSearch filters={filters} />} /> {/* Pass filters to JobSearch */}
        <Route path="/job/:jobId" element={<JobDetailPage />} />
        <Route path="/UserProfile" element={<Profile />} />
        <Route path='/companyprofile' element={<CompanyProfile />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/tos" element={<TOS />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/ChatPage" element={<ChatPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/features" element={<Features />} />
        <Route path="/aboutus" element={<About />} />

        {/* Fallback 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
