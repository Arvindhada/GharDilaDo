import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Bell } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';

export default function NotificationsScreen() {
    const navigation = useNavigation();
    const { t } = useAppTheme();
    const notifications = [
        { id: '1', title: 'New property in Sargasan', desc: '2 BHK Flat · ₹14,000/mo', time: '2h ago', unread: true },
        { id: '2', title: 'Price drop alert!', desc: 'Villa in Kudasan reduced by ₹5,000', time: '1d ago', unread: true },
        { id: '3', title: 'Property saved successfully', desc: '3 BHK Villa in Kudasan', time: '2d ago', unread: false },
    ];
    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={t.title} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: t.title }]}>Notifications</Text>
            </View>
            <ScrollView contentContainerStyle={styles.listContent}>
                {notifications.map(n => (
                    <View key={n.id} style={[styles.notifCard, { backgroundColor: n.unread ? t.notifUnread : t.cardBg }]}>
                        <View style={[styles.notifIcon, { backgroundColor: t.innerCardBg }]}>
                            <Bell size={20} color="#0C886B" />
                        </View>
                        <View style={styles.notifTextWrap}>
                            <Text style={[styles.notifTitle, { color: t.title }]}>{n.title}</Text>
                            <Text style={[styles.notifDesc, { color: t.muted }]}>{n.desc}</Text>
                        </View>
                        <Text style={[styles.notifTime, { color: t.muted }]}>{n.time}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12 },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', marginLeft: 8 },
    notifCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, padding: 14 },
    notifIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    notifTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
    notifDesc: { fontSize: 12 },
    notifTime: { fontSize: 11 },
    listContent: { padding: 16, gap: 10 },
    notifTextWrap: { flex: 1 },
});
