import { useEffect } from 'react';
import { Command } from 'cmdk';
import { 
  Search, 
  MessageSquare, 
  FileText, 
  Files, 
  Settings, 
  Sparkles,
  Command as CommandIcon,
  ChevronRight
} from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { cn } from '../utils/cn';
import { useNavigate } from 'react-router-dom';

const SearchModal = () => {
  const { isSearchOpen, setSearchOpen } = useUIStore();
  const navigate = useNavigate();

  // Toggle open state on Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isSearchOpen, setSearchOpen]);

  const runCommand = (command: () => void) => {
    setSearchOpen(false);
    command();
  };

  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 transition-all duration-300",
      isSearchOpen ? "opacity-100 pointer-events-auto backdrop-blur-md bg-black/40" : "opacity-0 pointer-events-none"
    )}>
      <Command 
        className={cn(
          "w-full max-w-2xl bg-card border border-border shadow-2xl rounded-3xl overflow-hidden shadow-primary/10 transition-transform duration-300",
          isSearchOpen ? "scale-100" : "scale-95"
        )}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setSearchOpen(false);
        }}
      >
        <div className="flex items-center border-b border-border px-4 py-3 bg-muted/20">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <Command.Input 
            placeholder="Type a command or search for anything..." 
            className="flex-1 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground/50 h-10"
          />
          <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-lg border border-border/50 text-muted-foreground font-mono text-[10px] uppercase font-black">
            ESC
          </div>
        </div>

        <Command.List className="max-h-[400px] overflow-y-auto p-2 scrollbar-hide">
          <Command.Empty className="p-12 text-center flex flex-col items-center justify-center grayscale opacity-50">
             <div className="h-16 w-16 rounded-3xl bg-muted flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
             </div>
             <p className="text-xl font-black italic">No matches found</p>
             <p className="text-sm text-muted-foreground mt-2">Try searching for "chat", "settings", or "roadmap".</p>
          </Command.Empty>

          <Command.Group heading={<span className="px-3 py-2 block text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 italic">Navigation</span>}>
            <SearchItem 
              icon={MessageSquare} 
              label="Open AI Chat" 
              shortcut="↵" 
              onSelect={() => runCommand(() => navigate('/chat'))} 
            />
            <SearchItem 
              icon={FileText} 
              label="My Notes" 
              onSelect={() => runCommand(() => navigate('/notes'))} 
            />
            <SearchItem 
              icon={Files} 
              label="File Management" 
              onSelect={() => runCommand(() => navigate('/files'))} 
            />
          </Command.Group>

          <Command.Group heading={<span className="px-3 py-2 block text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 italic">AI Actions</span>}>
            <SearchItem 
              icon={Sparkles} 
              label="Generate AI Summary" 
              onSelect={() => runCommand(() => console.log('AI action'))} 
              color="text-indigo-500"
            />
          </Command.Group>

          <Command.Group heading={<span className="px-3 py-2 block text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 italic">Account</span>}>
            <SearchItem 
              icon={Settings} 
              label="Open Settings" 
              onSelect={() => runCommand(() => navigate('/settings'))} 
            />
          </Command.Group>
        </Command.List>

        <div className="p-3 border-t border-border flex items-center justify-between bg-muted/10">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                <ChevronRight className="h-3 w-3" />
                Select
             </div>
             <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">
                <CommandIcon className="h-3 w-3" />
                Navigate
             </div>
          </div>
          <div className="flex items-center gap-2">
             <Sparkles className="h-4 w-4 text-primary animate-pulse" />
             <span className="text-[10px] font-black italic text-primary/80 uppercase tracking-widest">Enhanced by Amego AI</span>
          </div>
        </div>
      </Command>
    </div>
  );
};

interface SearchItemProps {
  icon: any;
  label: string;
  shortcut?: string;
  onSelect: () => void;
  color?: string;
}

const SearchItem = ({ icon: Icon, label, shortcut, onSelect, color }: SearchItemProps) => {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center justify-between px-3 py-3.5 rounded-xl cursor-default select-none aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:shadow-lg aria-selected:shadow-primary/20 transition-all duration-200 group"
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center bg-muted group-aria-selected:bg-white/20 transition-colors",
          color
        )}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="font-bold text-sm tracking-tight">{label}</span>
      </div>
      {shortcut && (
        <span className="text-xs group-aria-selected:text-primary-foreground text-muted-foreground/40 font-mono font-black italic">{shortcut}</span>
      )}
    </Command.Item>
  );
};

export default SearchModal;
