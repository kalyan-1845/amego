import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  setTheme: (theme: 'light' | 'dark') => void;
  markAsRead: (id: string) => void;
  logout: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => {
      // Sync logic for theme class on document element
      const syncTheme = (theme: 'light' | 'dark') => {
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      };

      return {
        isSidebarOpen: true,
        isSearchOpen: false,
        theme: 'dark',
        notifications: [
          { id: '1', title: 'Welcome', message: 'Welcome to AmeGo AI!', time: '2m ago', read: false },
          { id: '2', title: 'AI Ready', message: 'Your AIML API is now connected.', time: '1h ago', read: true },
        ],
        toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
        setSearchOpen: (open) => set({ isSearchOpen: open }),
        toggleTheme: () => set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          syncTheme(newTheme);
          return { theme: newTheme };
        }),
        setTheme: (theme) => {
            syncTheme(theme);
            set({ theme });
        },
        logout: () => {
            console.log("Logged Out");
            window.location.href = '/login';
        },
        markAsRead: (id) => set((state) => ({
          notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
        })),
      };
    },
    {
      name: 'amego-ui-storage',
      onRehydrateStorage: () => {
        return (rehydratedState) => {
          if (rehydratedState) {
            // Apply theme on hydrate
            if (rehydratedState.theme === 'dark') document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
          }
        };
      },
    }
  )
);
