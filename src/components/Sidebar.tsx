import { NavLink } from 'react-router-dom';
import { 
  MessageSquare, 
  FileText, 
  Files, 
  Settings, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  User,
  Sparkles
} from 'lucide-react';
import { cn } from '../utils/cn'; // I'll create this utility next

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const navItems = [
    { name: 'Chat', icon: MessageSquare, path: '/chat' },
    { name: 'Notes', icon: FileText, path: '/notes' },
    { name: 'Files', icon: Files, path: '/files' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside
      className={cn(
        "relative h-full flex flex-col bg-zinc-950 text-zinc-400 border-r border-zinc-800 transition-all duration-300 ease-in-out z-40",
        isOpen ? "w-64" : "w-16"
      )}
    >
      {/* Branding */}
      <div className="p-4 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        {isOpen && <span className="font-bold text-zinc-100 text-lg">Amego AI</span>}
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 h-6 w-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
      >
        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 mt-8 space-y-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative",
                isActive 
                  ? "bg-zinc-800 text-white shadow-sm" 
                  : "hover:bg-zinc-900 hover:text-zinc-200"
              )
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span className="font-medium">{item.name}</span>}
            {!isOpen && (
              <div className="absolute left-14 bg-zinc-800 text-zinc-100 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Profile/Footer */}
      <div className="p-3 mt-auto border-t border-zinc-800/50">
        <div className={cn("flex items-center gap-3 p-2 rounded-lg", isOpen && "hover:bg-zinc-900 group")}>
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
						<User className="h-4 w-4 text-white" />
					</div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-100 truncate">Alex Chen</p>
              <p className="text-xs text-zinc-500 truncate">alex@amego.ai</p>
            </div>
          )}
        </div>
        <button className={cn(
          "flex items-center gap-3 p-2 mt-2 w-full rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-all",
          !isOpen && "justify-center"
        )}>
          <LogOut className="h-5 w-5" />
          {isOpen && <span className="text-sm">Log out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
