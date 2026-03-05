import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Settings, Bell, HelpCircle, LogOut, ChevronRight, Shield } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
    const navigation = useNavigation<Nav>();
    const { t } = useAppTheme();

    const MENU = [
        { icon: <Bell size={20} color="#0C886B" />, label: 'Notifications', onPress: () => navigation.navigate('Notifications') },
        { icon: <Settings size={20} color="#0C886B" />, label: 'Settings', onPress: () => navigation.navigate('Settings') },
        { icon: <Shield size={20} color="#0C886B" />, label: 'Privacy Policy', onPress: () => navigation.navigate('Privacy') },
        { icon: <HelpCircle size={20} color="#0C886B" />, label: 'Help & Support', onPress: () => navigation.navigate('Help') },
    ];

    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: t.title }]}>Profile</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>U</Text>
                    </View>
                    <Text style={[styles.name, { color: t.title }]}>User</Text>
                    <Text style={[styles.role, { color: t.muted }]}>Rent Seeker</Text>
                </View>

                {/* Stats */}
                <View style={[styles.statsRow, { backgroundColor: t.cardBg }]}>
                    {[['0', 'Listings'], ['0', 'Saved'], ['0', 'Reviews']].map(([val, label]) => (
                        <View key={label} style={styles.statItem}>
                            <Text style={[styles.statVal, { color: t.title }]}>{val}</Text>
                            <Text style={[styles.statLabel, { color: t.muted }]}>{label}</Text>
                        </View>
                    ))}
                </View>

                {/* Menu Items */}
                <View style={[styles.menuCard, { backgroundColor: t.cardBg }]}>
                    {MENU.map((item, i) => (
                        <TouchableOpacity
                            key={i} style={[styles.menuItem, i < MENU.length - 1 && [styles.menuItemBorder, { borderBottomColor: t.divider }]]}
                            onPress={item.onPress}
                        >
                            <View style={[styles.menuIconBox, { backgroundColor: t.innerCardBg }]}>{item.icon}</View>
                            <Text style={[styles.menuLabel, { color: t.title }]}>{item.label}</Text>
                            <ChevronRight size={18} color={t.muted} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout */}
                <TouchableOpacity
                    style={[styles.logoutBtn, styles.logoutBtnBg]}
                    onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Onboarding1' }] })}
                >
                    <LogOut size={18} color="#e85c5c" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <View style={styles.bottomSpace} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12 },
    headerTitle: { fontSize: 24, fontWeight: '800' },
    avatarSection: { alignItems: 'center', paddingVertical: 24 },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#0C886B', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    avatarText: { color: '#fff', fontSize: 32, fontWeight: '700' },
    name: { fontSize: 20, fontWeight: '800' },
    role: { fontSize: 14, marginTop: 4 },
    statsRow: { flexDirection: 'row', marginHorizontal: 16, borderRadius: 16, padding: 16, marginBottom: 16 },
    statItem: { flex: 1, alignItems: 'center' },
    statVal: { fontSize: 22, fontWeight: '800' },
    statLabel: { fontSize: 12, marginTop: 4 },
    menuCard: { marginHorizontal: 16, borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
    menuIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    menuLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
    logoutBtn: { marginHorizontal: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 52, gap: 10 },
    logoutText: { color: '#e85c5c', fontSize: 15, fontWeight: '700' },
    menuItemBorder: { borderBottomWidth: 1 },
    logoutBtnBg: { backgroundColor: '#fee2e2' },
    bottomSpace: { height: 40 },
});
