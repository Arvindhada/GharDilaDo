import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, StatusBar, Alert, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Moon, Bell, Globe, ChevronRight, Star, Share2, Shield, LogOut, Check } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/useAppStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { translations } from '../data/translations';

const LANGUAGES = [
    { label: 'English', sub: 'English', id: 'English' },
    { label: 'हिन्दी', sub: 'Hindi', id: 'Hindi' },
    { label: 'ગુજરાતી', sub: 'Gujarati', id: 'Gujarati' },
];

export default function SettingsScreen() {
    const navigation = useNavigation<any>();
    const { t, isDark, toggleDark } = useAppTheme();
    const insets = useSafeAreaInsets();
    const setUserRole = useAppStore(state => state.setUserRole);
    const updateProfile = useAppStore(state => state.updateProfile);
    const language = useAppStore(state => state.language);
    const setLanguage = useAppStore(state => state.setLanguage);
    const [notifs, setNotifs] = useState(true);
    const [showLangModal, setShowLangModal] = useState(false);

    const s = translations[language] || translations['English'];

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
                        setUserRole(null);
                        updateProfile('', '');
                        navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
                    }
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: t.cardBg }]} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <ChevronLeft size={22} color={t.title} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: t.title }]}>{s.settings}</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={[styles.sectionTitle, { color: t.muted }]}>Appearance & Audio</Text>
                <View style={[styles.section, { backgroundColor: t.cardBg }]}>
                    <View style={[styles.row, styles.borderBottom, { borderBottomColor: t.divider }]}>
                        <View style={[styles.iconBox, { backgroundColor: t.innerCardBg }]}>
                            <Moon size={20} color="#0C886B" />
                        </View>
                        <Text style={[styles.rowLabel, { color: t.title }]}>{s.dark_mode}</Text>
                        <Switch value={isDark} onValueChange={toggleDark} trackColor={{ true: '#008e6b' }} thumbColor="#fff" />
                    </View>
                    <View style={styles.row}>
                        <View style={[styles.iconBox, { backgroundColor: t.innerCardBg }]}>
                            <Bell size={20} color="#0C886B" />
                        </View>
                        <Text style={[styles.rowLabel, { color: t.title }]}>{s.notifications}</Text>
                        <Switch value={notifs} onValueChange={setNotifs} trackColor={{ true: '#008e6b' }} thumbColor="#fff" />
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: t.muted }]}>Regional</Text>
                <View style={[styles.section, { backgroundColor: t.cardBg }]}>
                    <TouchableOpacity style={styles.row} onPress={() => setShowLangModal(true)}>
                        <View style={[styles.iconBox, { backgroundColor: t.innerCardBg }]}>
                            <Globe size={20} color="#0C886B" />
                        </View>
                        <Text style={[styles.rowLabel, { color: t.title }]}>{s.language}</Text>
                        <Text style={[styles.valueText, { color: '#0C886B' }]}>{language}</Text>
                        <ChevronRight size={16} color={t.muted} />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.sectionTitle, { color: t.muted }]}>Feedback & Info</Text>
                <View style={[styles.section, { backgroundColor: t.cardBg }]}>
                    <TouchableOpacity style={[styles.row, styles.borderBottom, { borderBottomColor: t.divider }]}>
                        <View style={[styles.iconBox, { backgroundColor: t.innerCardBg }]}>
                            <Star size={20} color="#0C886B" />
                        </View>
                        <Text style={[styles.rowLabel, { color: t.title }]}>{s.rate_us}</Text>
                        <ChevronRight size={16} color={t.muted} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.row, styles.borderBottom, { borderBottomColor: t.divider }]}>
                        <View style={[styles.iconBox, { backgroundColor: t.innerCardBg }]}>
                            <Share2 size={20} color="#0C886B" />
                        </View>
                        <Text style={[styles.rowLabel, { color: t.title }]}>{s.share_app}</Text>
                        <ChevronRight size={16} color={t.muted} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Privacy')}>
                        <View style={[styles.iconBox, { backgroundColor: t.innerCardBg }]}>
                            <Shield size={20} color="#0C886B" />
                        </View>
                        <Text style={[styles.rowLabel, { color: t.title }]}>{s.about_us}</Text>
                        <ChevronRight size={16} color={t.muted} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.logoutBtn, { backgroundColor: isDark ? '#3d2525' : '#fee2e2' }]}
                    onPress={handleLogout}
                >
                    <LogOut size={18} color="#ef4444" />
                    <Text style={styles.logoutText}>{s.logout}</Text>
                </TouchableOpacity>

                <Text style={[styles.version, { color: t.muted }]}>GharDilado v1.0.0 • Made with ❤️ for Gandhinagar</Text>
            </ScrollView>

            {/* Language Modal */}
            <Modal
                visible={showLangModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowLangModal(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowLangModal(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: t.bg }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: t.title }]}>{s.language}</Text>
                            <TouchableOpacity onPress={() => setShowLangModal(false)}>
                                <Text style={{ color: '#0C886B', fontWeight: '700' }}>Done</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.langList}>
                            {LANGUAGES.map((item) => {
                                const isSelected = language === item.id;
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[styles.langItem, { borderBottomColor: t.divider }]}
                                        onPress={() => setLanguage(item.id)}
                                    >
                                        <View>
                                            <Text style={[styles.langLabel, { color: isSelected ? '#0C886B' : t.title }]}>{item.label}</Text>
                                            <Text style={[styles.langSub, { color: t.muted }]}>{item.sub}</Text>
                                        </View>
                                        {isSelected && <Check size={20} color="#0C886B" strokeWidth={3} />}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12 },
    backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', marginLeft: 8 },
    scrollContent: { padding: 16, gap: 12, paddingBottom: 100 },
    section: { borderRadius: 20, overflow: 'hidden', marginBottom: 8 },
    sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginLeft: 8, marginTop: 16, marginBottom: 8 },
    row: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
    rowLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
    iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    valueText: { fontSize: 14, fontWeight: '700', marginRight: 8 },
    borderBottom: { borderBottomWidth: 1 },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 18, borderRadius: 20, marginTop: 32 },
    logoutText: { color: '#ef4444', fontSize: 16, fontWeight: '800' },
    version: { textAlign: 'center', fontSize: 12, marginTop: 24, opacity: 0.6 },
    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
    modalTitle: { fontSize: 20, fontWeight: '800' },
    langList: { gap: 4 },
    langItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1 },
    langLabel: { fontSize: 17, fontWeight: '700', marginBottom: 2 },
    langSub: { fontSize: 13, fontWeight: '500' },
});
