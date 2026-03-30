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
  accentColor: string;
  notifications: Notification[];
  toggleSidebar: () => void;
  setSearchOpen: (open: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setAccentColor: (color: string) => void;
  markAsRead: (id: string) => void;
  logout: () => void;
}

const getAccentColorHsl = (color: string) => {
  switch (color) {
    case 'purple': return '262 83.3% 57.8%';
    case 'emerald': return '142 70.6% 45.3%';
    case 'rose': return '346.8 77.2% 49.8%';
    case 'amber': return '45.4 93.4% 47.5%';
    case 'blue':
    default: return '221.2 83.2% 53.3%';
  }
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => {
      // Sync logic for theme class on document element
      const syncTheme = (theme: 'light' | 'dark') => {
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      };

      const syncAccentColor = (color: string) => {
        const hsl = getAccentColorHsl(color);
        document.documentElement.style.setProperty('--primary', hsl);
        document.documentElement.style.setProperty('--ring', hsl);
      };

      return {
        isSidebarOpen: true,
        isSearchOpen: false,
        theme: 'dark',
        accentColor: 'blue',
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
        setAccentColor: (color) => {
            syncAccentColor(color);
            set({ accentColor: color });
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
            
            // Apply accent color on hydrate
            if (rehydratedState.accentColor) {
                const hsl = getAccentColorHsl(rehydratedState.accentColor);
                document.documentElement.style.setProperty('--primary', hsl);
                document.documentElement.style.setProperty('--ring', hsl);
            }
          }
        };
      },
    }
  )
);
