import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LandingPage from '../components/LandingPage';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="flex h-screen">
      <Navbar />
      <main className="flex-1 overflow-auto">
        {isLanding ? <LandingPage /> : <Outlet />}
      </main>
    </div>
  );
};

export default MainLayout;
