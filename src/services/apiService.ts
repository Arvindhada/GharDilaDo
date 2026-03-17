import { mockProperties, type Property } from '../data/properties';

/**
 * ApiService: Data Guard Layer
 * Purpose: Ensures the app doesn't crash if data is missing or corrupted.
 * This version focus only on safety without changing UI patterns.
 */
export const ApiService = {
    /**
     * Fetches properties with built-in safety fallbacks.
     */
    getProperties: async (): Promise<Property[]> => {
        try {
            // Simulate API call
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Safety Check: Ensure we always return an array
                    const data = mockProperties || [];
                    resolve(data);
                }, 300);
            });
        } catch (error) {
            console.error('ApiService Error:', error);
            return []; // Return empty array to prevent crash
        }
    },

    /**
     * Fetches a single property by ID with safety checks.
     */
    getPropertyById: async (id: string): Promise<Property | null> => {
        try {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const property = mockProperties.find(p => p.id === id);
                    resolve(property || null);
                }, 200);
            });
        } catch (error) {
            console.error('ApiService Error:', error);
            return null;
        }
    }
};
