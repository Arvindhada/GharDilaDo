import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
    savedIds: string[];
    toggleSave: (id: string) => void;
    isSaved: (id: string) => boolean;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            savedIds: ['2', '6'], // Default mock saved IDs
            toggleSave: (id: string) =>
                set((state) => ({
                    savedIds: state.savedIds.includes(id)
                        ? state.savedIds.filter((s) => s !== id)
                        : [...state.savedIds, id],
                })),
            isSaved: (id: string) => get().savedIds.includes(id),
        }),
        {
            name: 'ghardilado-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
