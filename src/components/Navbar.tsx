import { 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Theme toggle logic (basic mock)
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex items-center justify-between px-6 lg:px-8">
      {/* Search Bar / Ctrl+K Trigger */}
      <div className="flex-1 flex items-center">
        <button 
          className="flex h-10 w-full max-w-sm px-4 items-center gap-2 rounded-xl bg-muted/60 text-muted-foreground border border-transparent hover:bg-muted hover:border-border transition-all text-sm group"
          onClick={() => console.log('Open search modal')}
        >
          <Search className="h-4 w-4 group-hover:text-foreground active:scale-95 transition-all" />
          <span className="flex-1 text-left">Search anything...</span>
          <kbd className="hidden sm:flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 sm:gap-4 ml-4">
        {/* Notifications */}
        <button className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background ring-offset-0" />
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div className="h-6 w-px bg-border mx-1" />

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 pl-2 pr-1 h-10 rounded-xl hover:bg-muted transition-all group"
          >
            <div className="h-8 w-8 rounded-full bg-blue-500 overflow-hidden ring-2 ring-offset-2 ring-offset-background ring-transparent group-hover:ring-blue-500/20 transition-all">
              <User className="h-full w-full p-1.5 text-white" />
            </div>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isProfileOpen && "rotate-180")} />
          </button>

          {/* User Profile Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-50">
              <div className="p-3 border-b border-border mb-1">
                <p className="text-sm font-semibold">Alex Chen</p>
                <p className="text-xs text-muted-foreground truncate">alex@amego.ai</p>
              </div>
              
              <div className="space-y-0.5">
                <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                  <HelpCircle className="h-4 w-4" />
                  Help Center
                </button>
              </div>
              
              <div className="h-px bg-border my-1" />
              
              <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-all">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
