import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Moon, Bell } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
    const navigation = useNavigation();
    const { t, isDark, toggleDark } = useAppTheme();
    const [notifs, setNotifs] = useState(true);
    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={t.title} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: t.title }]}>Settings</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.section, { backgroundColor: t.cardBg }]}>
                    <View style={[styles.row, styles.borderBottom, { borderBottomColor: t.divider }]}>
                        <Moon size={20} color="#0C886B" />
                        <Text style={[styles.rowLabel, { color: t.title }]}>Dark Mode</Text>
                        <Switch value={isDark} onValueChange={toggleDark} trackColor={{ true: '#0C886B' }} />
                    </View>
                    <View style={styles.row}>
                        <Bell size={20} color="#0C886B" />
                        <Text style={[styles.rowLabel, { color: t.title }]}>Push Notifications</Text>
                        <Switch value={notifs} onValueChange={setNotifs} trackColor={{ true: '#0C886B' }} />
                    </View>
                </View>
                <Text style={[styles.version, { color: t.muted }]}>GharDilado v1.0.0</Text>
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12 },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', marginLeft: 8 },
    section: { borderRadius: 16, overflow: 'hidden' },
    row: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
    rowLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
    version: { textAlign: 'center', fontSize: 13, marginTop: 8 },
    scrollContent: { padding: 16, gap: 12 },
    borderBottom: { borderBottomWidth: 1 },
});
