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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { useUIStore } from '../store/uiStore';

const Navbar = () => {
  const { theme, toggleTheme, setSearchOpen, notifications, markAsRead, logout } = useUIStore();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex items-center justify-between px-6 lg:px-8">
      {/* Search Bar / Ctrl+K Trigger */}
      <div className="flex-1 flex items-center">
        <button 
          className="flex h-10 w-full max-w-sm px-4 items-center gap-2 rounded-xl bg-muted/60 text-muted-foreground border border-transparent hover:bg-muted hover:border-border transition-all text-sm group"
          onClick={() => setSearchOpen(true)}
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
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all relative"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background ring-offset-0" />}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-50">
              <div className="p-3 border-b border-border flex items-center justify-between">
                <h4 className="text-sm font-bold">Notifications</h4>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{unreadCount} New</span>
              </div>
              <div className="max-h-80 overflow-y-auto py-1">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl hover:bg-muted transition-all flex flex-col gap-0.5 relative",
                      !n.read && "bg-primary/5"
                    )}
                  >
                    <p className="text-sm font-bold">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.message}</p>
                    <span className="text-[10px] text-muted-foreground/60 mt-1">{n.time}</span>
                    {!n.read && <div className="absolute top-4 right-4 h-1.5 w-1.5 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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
                <button 
                  onClick={() => { setIsProfileOpen(false); navigate('/settings'); }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button 
                  onClick={() => { setIsProfileOpen(false); navigate('/settings'); }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <button 
                  onClick={() => { setIsProfileOpen(false); setIsHelpOpen(true); }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                >
                  <HelpCircle className="h-4 w-4" />
                  Help Center
                </button>
              </div>
              
              <div className="h-px bg-border my-1" />
              
              <button 
                onClick={() => { setIsProfileOpen(false); logout(); }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Help Center Modal */}
      <AnimatePresence>
        {isHelpOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsHelpOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border shadow-2xl z-50 rounded-3xl overflow-hidden"
            >
              <div className="p-6 text-center border-b border-border/50 bg-muted/30">
                <div className="h-16 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <HelpCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-black">Help Center</h3>
                <p className="text-muted-foreground text-sm mt-1">We're here to help you get things done.</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors cursor-pointer group">
                  <h4 className="font-bold group-hover:text-primary transition-colors">Documentation</h4>
                  <p className="text-xs text-muted-foreground mt-1">Read guides and tutorials.</p>
                </div>
                <div className="p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors cursor-pointer group">
                  <h4 className="font-bold group-hover:text-primary transition-colors">Contact Support</h4>
                  <p className="text-xs text-muted-foreground mt-1">Send us an email directly.</p>
                </div>
              </div>
              
              <div className="p-4 bg-muted/50 border-t border-border/50">
                <button 
                  onClick={() => setIsHelpOpen(false)}
                  className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[0.98] transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
