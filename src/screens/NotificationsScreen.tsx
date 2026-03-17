import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Bell } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';

export default function NotificationsScreen() {
    const navigation = useNavigation();
    const { t } = useAppTheme();
    const [notifications, setNotifications] = React.useState([
        { id: '1', title: 'New property in Sargasan', desc: '2 BHK Flat · ₹14,000/mo', time: '2h ago', unread: true },
        { id: '2', title: 'Price drop alert!', desc: 'Villa in Kudasan reduced by ₹5,000', time: '1d ago', unread: true },
        { id: '3', title: 'Property saved successfully', desc: '3 BHK Villa in Kudasan', time: '2d ago', unread: false },
    ]);

    const clearAll = () => {
        setNotifications([]);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={t.title} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: t.title }]}>Notifications</Text>
                {notifications.length > 0 && (
                    <TouchableOpacity onPress={clearAll}>
                        <Text style={[styles.clearBtn, { color: '#0C886B' }]}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>
            <ScrollView contentContainerStyle={styles.listContent}>
                {notifications.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={[styles.emptyIconBox, { backgroundColor: t.cardBg }]}>
                            <Bell size={40} color={t.muted} strokeWidth={1} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: t.title }]}>No notifications yet</Text>
                        <Text style={[styles.emptyDesc, { color: t.muted }]}>We'll notify you when something important happens.</Text>
                    </View>
                ) : (
                    notifications.map(n => (
                        <TouchableOpacity
                            key={n.id}
                            style={[styles.notifCard, { backgroundColor: n.unread ? t.notifUnread : t.cardBg }]}
                            onPress={() => markAsRead(n.id)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.notifIcon, { backgroundColor: t.innerCardBg }]}>
                                <Bell size={20} color={n.unread ? "#0C886B" : t.muted} />
                            </View>
                            <View style={styles.notifTextWrap}>
                                <Text style={[styles.notifTitle, { color: t.title }]}>{n.title}</Text>
                                <Text style={[styles.notifDesc, { color: t.muted }]}>{n.desc}</Text>
                            </View>
                            <Text style={[styles.notifTime, { color: t.muted }]}>{n.time}</Text>
                        </TouchableOpacity>
                    ))
                )}
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12 },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', marginLeft: 8 },
    clearBtn: { fontSize: 13, fontWeight: '700' },
    notifCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 18, padding: 14, marginBottom: 4 },
    notifIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    notifTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
    notifDesc: { fontSize: 12, opacity: 0.8 },
    notifTime: { fontSize: 11, fontWeight: '500' },
    listContent: { padding: 16, paddingBottom: 100 },
    notifTextWrap: { flex: 1 },
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 120, paddingHorizontal: 40 },
    emptyIconBox: { width: 80, height: 80, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
    emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});
