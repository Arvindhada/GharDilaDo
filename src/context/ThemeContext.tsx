import React, { createContext, useContext, useState } from 'react';

interface ThemeContextType {
    isDark: boolean;
    toggleDark: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ isDark: false, toggleDark: () => { } });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isDark, setIsDark] = useState(false);
    const toggleDark = () => setIsDark(v => !v);
    return (
        <ThemeContext.Provider value={{ isDark, toggleDark }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}

export function useAppTheme() {
    const { isDark, toggleDark } = useTheme();
    const t = {
        bg: isDark ? '#232528' : '#ffffff',
        cardBg: isDark ? '#2a2c30' : '#f7f8f9',
        innerCardBg: isDark ? '#2e3036' : '#ffffff',
        badgeBg: isDark ? '#363840' : '#f0f0f0',
        inputBg: isDark ? '#2a2c30' : '#f7f8f9',
        filterPanel: isDark ? '#252729' : '#fafafa',
        navBg: isDark ? '#1e2024' : '#ffffff',
        navBorder: isDark ? '#2e3036' : '#f0f0f0',
        title: isDark ? '#ffffff' : '#1b1d21',
        muted: isDark ? '#9ba0ad' : '#8f92a1',
        inputText: isDark ? '#ffffff' : '#1b1d21',
        divider: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
        chipBorder: isDark ? '#3a3e48' : '#e0e0e0',
        panelBorder: isDark ? '#2e3036' : '#f0f0f0',
        chipBg: isDark ? '#2a2c30' : '#ffffff',
        chipText: isDark ? '#ffffff' : '#1b1d21',
        notifUnread: isDark ? '#0d2e28' : '#eaf5f1',
        settingIconBg: isDark ? '#363840' : '#ffffff',
        profileCardBg: isDark ? '#2a2c30' : '#f7f8f9',
        sectionHeadBg: isDark ? '#232528' : '#ffffff',
    };
    return { isDark, toggleDark, t };
}
