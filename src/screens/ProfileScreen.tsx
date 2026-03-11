import React, { useState, useEffect } from 'react';
import {
    Alert, View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import {
    Settings, Bell, HelpCircle, LogOut, ChevronRight, Shield,
    User, Mail, Phone, Heart, List, Star
} from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/useAppStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiService } from '../services/apiService';
import { formatRent, type Property } from '../data/properties';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
    const navigation = useNavigation<any>();
    const { t } = useAppTheme();
    const insets = useSafeAreaInsets();
    const name = useAppStore(state => state.name);
    const phone = useAppStore(state => state.phone);
    const email = useAppStore(state => state.email);
    const savedIds = useAppStore(state => state.savedIds);
    const recentlyViewedIds = useAppStore(state => state.recentlyViewedIds);
    const userRole = useAppStore(state => state.userRole);
    const setUserRole = useAppStore(state => state.setUserRole);
    const updateProfile = useAppStore(state => state.updateProfile);
    const userListings = useAppStore(state => state.userListings);
    const [apiProperties, setApiProperties] = useState<Property[]>([]);

    // Derived state
    const allProperties = [...userListings, ...apiProperties];

    useEffect(() => {
        ApiService.getProperties().then(setApiProperties);
    }, []);

    const recentProperties = allProperties.filter(p => recentlyViewedIds.includes(p.id));

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Log out',
                    style: 'destructive',
                    onPress: () => {
                        // Reset everything
                        setUserRole(null);
                        updateProfile('', '', '');
                        navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
                    }
                }
            ]
        );
    };

    const SECTIONS = [
        {
            title: 'Account Settings',
            items: [
                { icon: <User size={20} color="#0C886B" />, label: 'Edit Profile', onPress: () => navigation.navigate('EditProfile') },
                { icon: <Bell size={20} color="#0C886B" />, label: 'Notifications', onPress: () => navigation.navigate('Notifications') },
            ]
        },
        {
            title: 'Preferences',
            items: [
                { icon: <Settings size={20} color="#0C886B" />, label: 'App Settings', onPress: () => navigation.navigate('Settings') },
                { icon: <Shield size={20} color="#0C886B" />, label: 'Privacy Policy', onPress: () => navigation.navigate('Privacy') },
            ]
        },
        {
            title: 'Support',
            items: [
                { icon: <HelpCircle size={20} color="#0C886B" />, label: 'Help & Support', onPress: () => navigation.navigate('Help') },
            ]
        }
    ];

    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <Text style={[styles.headerTitle, { color: t.title }]}>Profile</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <TouchableOpacity
                        style={[styles.avatar, styles.avatarShadow]}
                        onPress={() => navigation.navigate('EditProfile')}
                    >
                        <Text style={styles.avatarText}>{name ? name.charAt(0).toUpperCase() : 'U'}</Text>
                    </TouchableOpacity>
                    <Text style={[styles.name, { color: t.title }]}>{name || 'GharDilado User'}</Text>
                    {email ? (
                        <Text style={[styles.phoneText, { color: t.muted, marginTop: 2 }]}>{email}</Text>
                    ) : (
                        <Text style={[styles.phoneText, { color: t.muted }]}>{phone}</Text>
                    )}
                </View>

                {/* Stats */}
                <View style={[styles.statsRow, { backgroundColor: t.cardBg }]}>
                    {userRole === 'seeker' ? (
                        <>
                            <View style={styles.statItem}>
                                <Text style={[styles.statVal, { color: t.title }]}>{savedIds.length}</Text>
                                <Text style={[styles.statLabel, { color: t.muted }]}>Saved</Text>
                            </View>
                            <View style={[styles.statDivider, { backgroundColor: t.divider }]} />
                            <View style={styles.statItem}>
                                <Text style={[styles.statVal, { color: t.title }]}>{recentlyViewedIds.length}</Text>
                                <Text style={[styles.statLabel, { color: t.muted }]}>Recent Views</Text>
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={styles.statItem}>
                                <Text style={[styles.statVal, { color: t.title }]}>0</Text>
                                <Text style={[styles.statLabel, { color: t.muted }]}>Listings</Text>
                            </View>
                            <View style={[styles.statDivider, { backgroundColor: t.divider }]} />
                            <View style={styles.statItem}>
                                <Text style={[styles.statVal, { color: t.title }]}>0</Text>
                                <Text style={[styles.statLabel, { color: t.muted }]}>Profile Views</Text>
                            </View>
                            <View style={[styles.statDivider, { backgroundColor: t.divider }]} />
                            <View style={styles.statItem}>
                                <Text style={[styles.statVal, { color: t.title }]}>0</Text>
                                <Text style={[styles.statLabel, { color: t.muted }]}>Direct Leads</Text>
                            </View>
                        </>
                    )}
                </View>

                {/* Menu Sections */}
                {SECTIONS.map((section, idx) => (
                    <View key={idx} style={styles.sectionContainer}>
                        <Text style={[styles.sectionTitle, { color: t.muted }]}>{section.title}</Text>
                        <View style={[styles.menuCard, { backgroundColor: t.cardBg }]}>
                            {section.items.map((item, i) => (
                                <TouchableOpacity
                                    key={i} style={[styles.menuItem, i < section.items.length - 1 && [styles.menuItemBorder, { borderBottomColor: t.divider }]]}
                                    onPress={item.onPress}
                                >
                                    <View style={[styles.menuIconBox, { backgroundColor: t.innerCardBg }]}>{item.icon}</View>
                                    <Text style={[styles.menuLabel, { color: t.title }]}>{item.label}</Text>
                                    <ChevronRight size={16} color={t.muted} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Logout */}
                <TouchableOpacity
                    style={[styles.logoutBtn, styles.logoutBtnBg]}
                    onPress={handleLogout}
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
    header: { paddingHorizontal: 20, paddingBottom: 12 },
    headerTitle: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
    avatarSection: { alignItems: 'center', paddingVertical: 24 },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#0C886B', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    avatarShadow: {
        shadowColor: '#0C886B', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, shadowRadius: 10, elevation: 6
    },
    avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
    name: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
    phoneText: { fontSize: 13, marginTop: 4, fontWeight: '500' },
    role: { fontSize: 14, marginTop: 4 },
    statsRow: { flexDirection: 'row', marginHorizontal: 20, borderRadius: 20, padding: 18, marginBottom: 24, alignItems: 'center' },
    statItem: { flex: 1, alignItems: 'center' },
    statVal: { fontSize: 20, fontWeight: '800' },
    statLabel: { fontSize: 12, marginTop: 2, fontWeight: '500' },
    statDivider: { width: 1, height: 30, opacity: 0.5 },
    sectionContainer: { marginBottom: 20 },
    sectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginLeft: 24, marginBottom: 8, opacity: 0.8 },
    menuCard: { marginHorizontal: 20, borderRadius: 20, overflow: 'hidden' },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
    menuIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    menuLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
    logoutBtn: { marginHorizontal: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 58, gap: 10, marginBottom: 20 },
    logoutText: { color: '#e85c5c', fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
    menuItemBorder: { borderBottomWidth: 1 },
    logoutBtnBg: { backgroundColor: '#fee2e2' },
    bottomSpace: { height: 100 },
    recentScroll: { paddingLeft: 20, paddingRight: 8, gap: 12 },
    smallCard: { width: 150, borderRadius: 16, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    smallCardImg: { width: '100%', height: 90 },
    smallCardInfo: { padding: 10 },
    smallCardTitle: { fontSize: 13, fontWeight: '700' },
    smallCardPrice: { fontSize: 13, color: '#0C886B', fontWeight: '800', marginTop: 2 },
});
