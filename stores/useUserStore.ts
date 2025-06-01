import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
    userName: string | null;
    userImage: string | null;
    setUserName: (name: string) => void;
    setUserImage: (image: string) => void;
    clearUserName: () => void;
    clearUserImage: () => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            userName: null,
            userImage: null,
            setUserName: (name: string) => set({ userName: name }),
            setUserImage: (image: string) => set({ userImage: image }),
            clearUserName: () => set({ userName: null }),
            clearUserImage: () => set({ userImage: null }),
        }),
        {
            name: 'user-storage', // Key for local storage
        }
    )
);