import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import WhatWeDo from './pages/WhatWeDo';
import Building from './pages/Building';
import GetInvolved from './pages/GetInvolved';
import Give from './pages/Give';
import Contact from './pages/Contact';
import Supporters from './pages/Supporters';

import AuthLanding from './pages/auth/AuthLanding';
import OwnerLogin from './pages/auth/OwnerLogin';
import HelperSignup from './pages/auth/HelperSignup';
import HelperLogin from './pages/auth/HelperLogin';

import OwnerDashboard from './pages/dashboard/OwnerDashboard';
import HelperDashboard from './pages/dashboard/HelperDashboard';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'var(--cream)' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'3rem', color:'var(--crimson)' }}>✝</div>
        <p style={{ color:'var(--crimson)', fontFamily:'Playfair Display,serif', fontSize:'1.2rem' }}>Loading...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/auth" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3500} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/what-we-do" element={<WhatWeDo />} />
        <Route path="/building-projects" element={<Building />} />
        <Route path="/get-involved" element={<GetInvolved />} />
        <Route path="/give" element={<Give />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/partners" element={<Supporters />} />

        {/* Redirects for old URLs */}
        <Route path="/supporters" element={<Navigate to="/partners" />} />
        <Route path="/christmas-2026" element={<Navigate to="/" />} />
        <Route path="/child-care" element={<Navigate to="/" />} />

        <Route path="/auth" element={<AuthLanding />} />
        <Route path="/auth/owner/login" element={<OwnerLogin />} />
        <Route path="/auth/helper/signup" element={<HelperSignup />} />
        <Route path="/auth/helper/login" element={<HelperLogin />} />

        <Route path="/dashboard/owner" element={
          <ProtectedRoute requiredRole="owner"><OwnerDashboard /></ProtectedRoute>
        } />
        <Route path="/dashboard/helper" element={
          <ProtectedRoute requiredRole="helper"><HelperDashboard /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;