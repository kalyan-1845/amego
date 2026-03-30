import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, MessageSquare, File, CornerDownLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotesStore } from '../store/notesStore';
import { useChatStore } from '../store/chatStore';
import { useFilesStore } from '../store/filesStore';

interface SearchResult {
  id: string;
  type: 'note' | 'chat' | 'file';
  title: string;
  excerpt: string;
  path: string;
}

export const SearchModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  
  const notes = useNotesStore((state) => state.notes);
  const messages = useChatStore((state) => state.messages);
  const files = useFilesStore((state) => state.files);

  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];
    const searchLower = query.toLowerCase();

    // Search Notes
    notes.forEach(note => {
      if (note.title.toLowerCase().includes(searchLower) || note.content.toLowerCase().includes(searchLower)) {
        searchResults.push({
          id: note.id,
          type: 'note',
          title: note.title,
          excerpt: note.content.slice(0, 60) + '...',
          path: '/notes'
        });
      }
    });

    // Search Chats
    messages.forEach(msg => {
      if (msg.content.toLowerCase().includes(searchLower)) {
        searchResults.push({
          id: msg.id,
          type: 'chat',
          title: 'Chat Message',
          excerpt: msg.content.slice(0, 60) + '...',
          path: '/chat'
        });
      }
    });

    // Search Files
    files.forEach(file => {
      if (file.name.toLowerCase().includes(searchLower)) {
        searchResults.push({
          id: file.id,
          type: 'file',
          title: file.name,
          excerpt: `File • ${(file.size / 1024).toFixed(1)} KB`,
          path: '/files'
        });
      }
    });

    setResults(searchResults.slice(0, 8));
  }, [query, notes, messages, files]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-[999]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed left-1/2 top-[15%] -translate-x-1/2 w-full max-w-2xl bg-card border border-border/50 rounded-3xl shadow-2xl z-[1000] overflow-hidden"
          >
            <div className="relative p-4 border-b border-border">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                autoFocus
                placeholder="Search notes, chats, and files..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent pl-12 pr-4 py-2 text-lg outline-none placeholder:text-muted-foreground/50"
              />
              <button 
                onClick={onClose}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-lg transition-all"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2">
              {results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result)}
                      className="w-full text-left p-3 rounded-2xl hover:bg-primary/10 group flex items-center gap-4 transition-all"
                    >
                      <div className="h-10 w-10 rounded-xl bg-muted group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                        {result.type === 'note' && <FileText className="h-5 w-5 text-blue-500" />}
                        {result.type === 'chat' && <MessageSquare className="h-5 w-5 text-emerald-500" />}
                        {result.type === 'file' && <File className="h-5 w-5 text-amber-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{result.title}</h4>
                        <p className="text-xs text-muted-foreground truncate">{result.excerpt}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <CornerDownLeft className="h-4 w-4 text-primary" />
                      </div>
                    </button>
                  ))}
                </div>
              ) : query ? (
                <div className="p-12 text-center">
                  <p className="text-muted-foreground">No matches found for "{query}"</p>
                </div>
              ) : (
                <div className="p-8 text-center space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-muted/30 rounded-2xl border border-border/50 text-xs font-medium text-left">
                       Press <kbd className="bg-muted px-1.5 py-0.5 rounded border border-border">ESC</kbd> to close
                    </div>
                    <div className="p-3 bg-muted/30 rounded-2xl border border-border/50 text-xs font-medium text-left">
                       <span className="text-primary">↑ ↓</span> to navigate
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 bg-muted/30 border-t border-border flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                <span>AmeGo Global Index</span>
                <span>CMD + K</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
