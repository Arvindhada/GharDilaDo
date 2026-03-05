import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

export default function DashboardScreen() {
    const { t } = useAppTheme();
    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />
            <Text style={[styles.title, { color: t.title }]}>Dashboard</Text>
            <Text style={[styles.sub, { color: t.muted }]}>Your listings and analytics will appear here.</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    title: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
    sub: { fontSize: 14, textAlign: 'center' },
});
