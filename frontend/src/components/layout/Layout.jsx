import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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
    <div className="flex h-screen bg-background text-foreground overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-background shadow-2xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
        <Topbar title={getPageTitle()} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
