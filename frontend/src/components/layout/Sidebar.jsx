import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, Bookmark as BookmarkIcon, User as UserIcon, LogOut, LayoutDashboard, PlusCircle, FileText, Settings, HelpCircle, Search, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const mainNav = [
    { name: 'Notices Feed', path: '/dashboard', icon: Bell },
  ];

  if (user?.role === 'cr' || user?.role === 'admin') {
    mainNav.push({ name: 'Admin Panel', path: '/admin', icon: LayoutDashboard });
  }

  const docNav = [
    { name: 'Bookmarks', path: '/bookmarks', icon: BookmarkIcon },
  ];

  return (
    <aside style={{backgroundColor: "#e0f2fe"}} className="w-[260px] h-screen  flex flex-col px-4 py-4 text-sm font-medium border-r border-border/60">
      <div className="flex items-center gap-2 px-2 mb-6 text-foreground">
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
          N
        </div>
        <span className="font-semibold text-base tracking-tight">Notify Central</span>
      </div>

      {(user?.role === 'cr' || user?.role === 'admin') && (
        <div className="px-2 mb-6">
          <NavLink to="/create" className="w-full">
            <Button className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-9 font-medium shadow-sm">
              <PlusCircle className="mr-2 h-4 w-4" /> Quick Create
            </Button>
          </NavLink>
        </div>
      )}

      <nav className="flex-1 space-y-8 overflow-y-auto">
        <div className="space-y-1">
          {mainNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-2 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? 'bg-muted/60 text-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="space-y-1">
          <h4 className="px-2 mb-2 text-xs font-semibold text-muted-foreground/60 tracking-wider">Documents</h4>
          {docNav.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-2 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? 'bg-muted/60 text-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          ))}
          <button className="flex items-center gap-3 px-2 py-1.5 rounded-md w-full text-left text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors">
            <MoreHorizontal className="w-4 h-4 shrink-0" />
            <span>More</span>
          </button>
        </div>
      </nav>

      <div className="mt-auto space-y-1 pt-6 pb-4 border-t border-border/40">
        <NavLink to="/profile" className="flex items-center gap-3 px-2 py-1.5 rounded-md text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors">
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </NavLink>
        <button className="flex items-center gap-3 px-2 py-1.5 rounded-md w-full text-left text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-colors">
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>Get Help</span>
        </button>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 cursor-pointer rounded-lg hover:bg-muted/40 p-2 transition-colors -mx-2" onClick={logout}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-bold border border-border">
            {user?.name?.substring(0, 2).toUpperCase() || 'ST'}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground leading-tight">{user?.name || 'Student User'}</span>
            <span className="text-xs text-muted-foreground mt-0.5">{user?.email || 'student@example.com'}</span>
          </div>
        </div>
        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
      </div>
    </aside>
  );
};

export default Sidebar;
