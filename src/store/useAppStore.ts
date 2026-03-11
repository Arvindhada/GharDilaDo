import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole, Property } from '../data/properties';

interface AppState {
    name: string;
    phone: string;
    savedIds: string[];
    recentSearches: string[];
    recentlyViewedIds: string[];
    userRole: UserRole;
    userListings: Property[];
    language: string;
    email: string;
    isKycd: boolean;
    city: string;
    address: string;
    aadharNumber: string;
    aadharImage: string;
    setUserRole: (role: UserRole) => void;
    setLanguage: (lang: string) => void;
    toggleSave: (id: string) => void;
    isSaved: (id: string) => boolean;
    updateProfile: (name: string, phone: string, email?: string) => void;
    submitKyc: (data: { city: string, address: string, aadharNumber: string, aadharImage: string }) => void;
    addRecentSearch: (search: string) => void;
    clearRecentSearches: () => void;
    addRecentlyViewed: (id: string) => void;
    addUserListing: (property: Property) => void;
    deleteUserListing: (id: string) => void;
    updateUserListing: (id: string, updates: Partial<Property>) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            name: 'User',
            phone: '+91 93514 71243',
            savedIds: ['2', '6'],
            recentSearches: [],
            recentlyViewedIds: [],
            userRole: 'owner', // Default role for dev/testing new features
            userListings: [],
            language: 'English',
            email: '',
            isKycd: false,
            city: '',
            address: '',
            aadharNumber: '',
            aadharImage: '',
            setUserRole: (role: UserRole) => set({ userRole: role }),
            setLanguage: (lang: string) => set({ language: lang }),
            toggleSave: (id: string) =>
                set((state) => ({
                    savedIds: state.savedIds.includes(id)
                        ? state.savedIds.filter((s) => s !== id)
                        : [...state.savedIds, id],
                })),
            isSaved: (id: string) => get().savedIds.includes(id),
            updateProfile: (name: string, phone: string, email?: string) => 
                set({ name, phone, email: email || get().email }),
            submitKyc: (data) => set({ 
                isKycd: true, 
                city: data.city, 
                address: data.address, 
                aadharNumber: data.aadharNumber, 
                aadharImage: data.aadharImage 
            }),
            addRecentSearch: (search: string) =>
                set((state) => {
                    const filtered = state.recentSearches.filter(s => s !== search);
                    return { recentSearches: [search, ...filtered].slice(0, 5) };
                }),
            clearRecentSearches: () => set({ recentSearches: [] }),
            addRecentlyViewed: (id: string) =>
                set((state) => {
                    const filtered = state.recentlyViewedIds.filter(v => v !== id);
                    return { recentlyViewedIds: [id, ...filtered].slice(0, 10) };
                }),
            addUserListing: (property: Property) =>
                set((state) => {
                    console.log(`[DEBUG] Store: Adding user listing. Total now: ${state.userListings.length + 1}`);
                    return { userListings: [property, ...state.userListings] };
                }),
            deleteUserListing: (id: string) =>
                set((state) => ({ userListings: state.userListings.filter(p => p.id !== id) })),
            updateUserListing: (id: string, updates: Partial<Property>) =>
                set((state) => ({
                    userListings: state.userListings.map(p => p.id === id ? { ...p, ...updates } : p)
                })),
        }),
        {
            name: 'ghardilado-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
