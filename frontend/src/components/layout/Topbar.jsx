import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { Input } from '../ui/input';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Topbar = ({ title, toggleSidebar }) => {
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');
  const navigate = useNavigate();

  useEffect(() => {
    setSearchValue(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      if (searchValue.trim()) {
        navigate(`/dashboard?q=${encodeURIComponent(searchValue.trim())}`);
      } else {
        navigate(`/dashboard`);
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-transparent">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="p-2 -ml-2 md:hidden text-foreground hover:bg-muted rounded-md transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold tracking-tight text-foreground hidden sm:block">{title}</h2>
      </div>

      <div className="flex items-center flex-1 max-w-md ml-4 sm:ml-8 px-4 relative">
        <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          type="text" 
          placeholder="Search notices... (Press Enter)" 
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleSearchSubmit}
          className="pl-10 bg-input/50 border-transparent focus:border-ring w-full transition-all duration-200 focus:shadow-[0_0_15px_oklch(0.65_0.22_295/0.2)] rounded-full"
        />
      </div>

      <div className="flex items-center space-x-6 ml-4">
        <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_oklch(0.65_0.22_295)]"></span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
