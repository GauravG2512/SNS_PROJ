
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, UserRole } from './types';
import Navigation from './components/Navigation';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import CitizenDashboard from './components/Citizen/Dashboard';
import LodgeComplaint from './components/Citizen/LodgeComplaint';
import ComplaintTracking from './components/Citizen/ComplaintTracking';
import Profile from './components/Citizen/Profile';
import AdminDashboard from './components/Admin/Dashboard';
import ComplaintManagement from './components/Admin/ComplaintManagement';
import Analytics from './components/Admin/Analytics';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('sns_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('sns_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sns_user');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('sns_user', JSON.stringify(updatedUser));
  };

  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isAuthPage && user && <Navigation user={user} onLogout={handleLogout} />}
      
      <main className={`flex-grow ${!isAuthPage && 'container mx-auto px-4 py-8'}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Root Redirect */}
          <Route path="/" element={
            user ? (
              user.role === UserRole.CITIZEN ? <Navigate to="/citizen/dashboard" /> : <Navigate to="/admin/dashboard" />
            ) : <Navigate to="/login" />
          } />

          {/* Citizen Routes */}
          <Route path="/citizen/dashboard" element={user?.role === UserRole.CITIZEN ? <CitizenDashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/citizen/lodge" element={user?.role === UserRole.CITIZEN ? <LodgeComplaint user={user} /> : <Navigate to="/login" />} />
          <Route path="/citizen/track" element={user?.role === UserRole.CITIZEN ? <ComplaintTracking user={user} /> : <Navigate to="/login" />} />
          <Route path="/citizen/profile" element={user?.role === UserRole.CITIZEN ? <Profile user={user} onUpdate={handleUpdateUser} /> : <Navigate to="/login" />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={user?.role !== UserRole.CITIZEN ? <AdminDashboard user={user!} /> : <Navigate to="/login" />} />
          <Route path="/admin/complaints" element={user?.role !== UserRole.CITIZEN ? <ComplaintManagement user={user!} /> : <Navigate to="/login" />} />
          <Route path="/admin/analytics" element={user?.role !== UserRole.CITIZEN ? <Analytics /> : <Navigate to="/login" />} />
          <Route path="/admin/profile" element={user ? <Profile user={user} onUpdate={handleUpdateUser} /> : <Navigate to="/login" />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {!isAuthPage && (
        <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
          <p>&copy; 2025 Smart Nagrik Seva (SNS). All rights reserved.</p>
        </footer>
      )}
    </div>
  );
};

export default App;
