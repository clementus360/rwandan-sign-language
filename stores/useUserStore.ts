import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
    userName: string | null;
    setUserName: (name: string) => void;
    clearUserName: () => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            userName: null,
            setUserName: (name: string) => set({ userName: name }),
            clearUserName: () => set({ userName: null }),
        }),
        {
            name: 'user-storage', // Key for local storage
        }
    )
);