import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  FileText, 
  Trash2, 
  Sparkles, 
  ChevronRight, 
  MoreVertical,
  Calendar,
  Clock,
  LayoutGrid,
  List
} from 'lucide-react';
import { useNotesStore, Note } from '../store/notesStore';
import { cn } from '../utils/cn';
import { formatDistanceToNow } from 'date-fns';

const NotesPage = () => {
  const { notes, activeNoteId, addNote, updateNote, deleteNote, setActiveNote } = useNotesStore();
  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeNote) {
      updateNote(activeNote.id, { title: e.target.value });
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeNote) {
      updateNote(activeNote.id, { content: e.target.value });
    }
  };

  const handleSummarize = () => {
    if (!activeNote) return;
    const summary = "\n\n--- \n**AI Summary:** This note discusses key strategies for project execution, emphasizing real-time collaboration and modern UI principles.";
    updateNote(activeNote.id, { content: activeNote.content + summary });
  };

  return (
    <div className="flex h-[calc(100vh-140px)] border border-border/50 bg-card/30 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-700">
      {/* Sidebar: Notes List */}
      <div className="w-80 border-r border-border bg-background/40 backdrop-blur-sm flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-border">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <LayoutGrid className="h-4 w-4 text-primary" />
            My Notes
          </h2>
          <button 
            onClick={() => addNote()}
            className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all active:scale-90"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="p-3">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <input 
              placeholder="Search notes..." 
              className="w-full bg-muted/50 border border-transparent rounded-xl pl-9 pr-4 py-2 text-sm focus:bg-background focus:border-border transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => setActiveNote(note.id)}
              className={cn(
                "w-full text-left p-3 rounded-2xl transition-all group relative",
                activeNoteId === note.id 
                  ? "bg-primary/10 border border-primary/20 shadow-sm" 
                  : "hover:bg-muted border border-transparent"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    "font-semibold text-sm truncate mb-1 transition-colors",
                    activeNoteId === note.id ? "text-primary" : "group-hover:text-foreground"
                  )}>
                    {note.title || "Untitled"}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-1 opacity-70">
                    {note.content || "Empty content..."}
                  </p>
                </div>
                {activeNoteId === note.id && <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />}
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(note.updatedAt)} ago
                </span>
                {activeNoteId === note.id && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                    className="ml-auto opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Panel: Editor */}
      <div className="flex-1 bg-background/60 backdrop-blur-sm flex flex-col min-w-0">
        {activeNote ? (
          <>
            <div className="p-4 md:px-8 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <FileText className="h-3.5 w-3.5" />
                <span>Quick Access</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground">{activeNote.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleSummarize}
                  className="flex items-center gap-2 px-3 py-1.5 border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary rounded-lg text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm shadow-primary/10"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Summarize
                </button>
                <button className="p-2 hover:bg-muted rounded-lg transition-all text-muted-foreground hover:text-foreground">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-20 max-w-4xl mx-auto w-full">
              <input
                value={activeNote.title}
                onChange={handleTitleChange}
                placeholder="Title"
                className="w-full text-5xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/30 mb-8 hover:bg-muted/30 rounded-xl px-2 -ml-2 transition-all focus:bg-transparent"
              />
              <textarea
                value={activeNote.content}
                onChange={handleContentChange}
                placeholder="Start writing..."
                className="w-full h-full bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/30 text-lg leading-relaxed font-normal hover:bg-muted/30 rounded-xl px-2 -ml-2 transition-all focus:bg-transparent"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="h-20 w-20 rounded-3xl bg-muted/50 border-2 border-dashed border-border flex items-center justify-center mb-6">
              <FileText className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No note selected</h3>
            <p className="text-muted-foreground max-w-xs mb-8">Select a note from the sidebar or create a new one to get started.</p>
            <button 
               onClick={() => addNote()}
               className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-2xl font-bold hover:scale-[1.02] transition-all hover:shadow-xl hover:shadow-primary/20"
            >
               <Plus className="h-5 w-5" />
               New Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
