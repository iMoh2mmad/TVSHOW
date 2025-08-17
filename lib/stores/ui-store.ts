import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Theme
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  
  // Language
  locale: 'ar' | 'en';
  setLocale: (locale: 'ar' | 'en') => void;
  
  // User's list (demo)
  myList: string[];
  addToMyList: (itemId: string) => void;
  removeFromMyList: (itemId: string) => void;
  isInMyList: (itemId: string) => boolean;
  
  // Player state
  playerState: {
    currentTime: number;
    duration: number;
    isPlaying: boolean;
    volume: number;
    quality: string;
    subtitleTrack: string | null;
  };
  setPlayerState: (state: Partial<UIState['playerState']>) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      
      // Language
      locale: 'ar',
      setLocale: (locale) => set({ locale }),
      
      // My List
      myList: [],
      addToMyList: (itemId) => 
        set((state) => ({ 
          myList: [...state.myList.filter(id => id !== itemId), itemId] 
        })),
      removeFromMyList: (itemId) => 
        set((state) => ({ 
          myList: state.myList.filter(id => id !== itemId) 
        })),
      isInMyList: (itemId) => get().myList.includes(itemId),
      
      // Player
      playerState: {
        currentTime: 0,
        duration: 0,
        isPlaying: false,
        volume: 1,
        quality: 'auto',
        subtitleTrack: null,
      },
      setPlayerState: (newState) => 
        set((state) => ({ 
          playerState: { ...state.playerState, ...newState } 
        })),
    }),
    {
      name: 'netflix-ui-store',
      partialize: (state) => ({
        theme: state.theme,
        locale: state.locale,
        myList: state.myList,
      }),
    }
  )
);