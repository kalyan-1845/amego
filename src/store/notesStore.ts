import { create } from 'zustand';

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  folder?: string;
}

interface NotesState {
  notes: Note[];
  activeNoteId: string | null;
  addNote: (title?: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [
    {
      id: '1',
      title: 'Project Roadmap 2026',
      content: '## Goals for Q1\n- Launch AI SaaS Platform\n- Onboard 1000 users\n- Implement real-time collaboration',
      updatedAt: Date.now() - 3600000,
    },
    {
      id: '2',
      title: 'Meeting Notes: Design Sync',
      content: 'Ideas for the new dashboard layout include glassmorphism and deep indigo palettes.',
      updatedAt: Date.now() - 86400000,
    },
  ],
  activeNoteId: '1',
  addNote: (title = 'Untitled Note') => set((state) => {
    const newNote = {
      id: Math.random().toString(36).substring(7),
      title,
      content: '',
      updatedAt: Date.now(),
    };
    return {
      notes: [newNote, ...state.notes],
      activeNoteId: newNote.id,
    };
  }),
  updateNote: (id, updates) => set((state) => ({
    notes: state.notes.map((note) => 
      note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
    ),
  })),
  deleteNote: (id) => set((state) => ({
    notes: state.notes.filter((note) => note.id !== id),
    activeNoteId: state.activeNoteId === id ? (state.notes[0]?.id || null) : state.activeNoteId,
  })),
  setActiveNote: (id) => set({ activeNoteId: id }),
}));
