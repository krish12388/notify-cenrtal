import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (true) {
      case location.pathname.startsWith('/dashboard'): return 'Feed';
      case location.pathname.startsWith('/admin'): return 'Admin Dashboard';
      case location.pathname.startsWith('/bookmarks'): return 'Bookmarks';
      case location.pathname.startsWith('/profile'): return 'Profile';
      case location.pathname.startsWith('/notice/'): return 'Notice Details';
      default: return 'Overview';
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={getPageTitle()} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
