import { create } from 'zustand';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface UIState {
  isSidebarOpen: boolean;
  isSearchOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  toggleSidebar: () => void;
  setSearchOpen: (open: boolean) => void;
  toggleTheme: () => void;
  markAsRead: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => {
  // Initialize theme from store (default 'dark')
  if (typeof document !== 'undefined') {
    if (localStorage.getItem('ui-theme') === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }

  return {
    isSidebarOpen: true,
    isSearchOpen: false,
    theme: (localStorage.getItem('ui-theme') as 'light' | 'dark') || 'dark',
    notifications: [
      { id: '1', title: 'Welcome', message: 'Welcome to AmeGo AI!', time: '2m ago', read: false },
      { id: '2', title: 'AI Ready', message: 'Your AIML API is now connected.', time: '1h ago', read: true },
    ],
    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    setSearchOpen: (open) => set({ isSearchOpen: open }),
    toggleTheme: () => set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('ui-theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme: newTheme };
    }),
    markAsRead: (id) => set((state) => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    })),
  };
});
