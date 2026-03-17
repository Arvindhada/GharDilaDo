import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Settings, Plus, Building2, Eye, PhoneCall, MoreVertical } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/useAppStore';
import { Property, formatRent } from '../data/properties';

export default function DashboardScreen() {
    const navigation = useNavigation<any>();
    const { t } = useAppTheme();
    const insets = useSafeAreaInsets();
    const userRole = useAppStore(state => state.userRole);
    const name = useAppStore(state => state.name);
    const isKycd = useAppStore(state => state.isKycd);
    const userListings = useAppStore(state => state.userListings);
    const deleteUserListing = useAppStore(state => state.deleteUserListing);

    // Filter listings based on current user role and name for dashboard
    const myListings = userListings.filter(p =>
        p.postedByRole === userRole && p.postedBy === name
    );

    const handleMenu = (id: string, title: string) => {
        Alert.alert(
            "Manage Property",
            `What would you like to do with "${title}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Edit Property",
                    onPress: () => navigation.navigate('AddListing', { propertyId: id })
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteUserListing(id)
                }
            ]
        );
    };

    const roleName = userRole === 'broker' ? 'Broker / Agency' : 'Property Owner';

    const renderCard = ({ item }: { item: Property }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.card, { backgroundColor: t.cardBg }]}
            onPress={() => navigation.navigate('PropertyDetail', { propertyId: item.id })}
        >
            <Image source={{ uri: item.images[0] }} style={styles.cardImg} />
            <View style={styles.cardInfo}>
                <View style={styles.cardHeader}>
                    <View style={styles.statusBadge}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Live</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={(e) => {
                            e.stopPropagation(); // Prevent card click
                            handleMenu(item.id, item.title);
                        }}
                    >
                        <MoreVertical size={16} color={t.muted} />
                    </TouchableOpacity>
                </View>
                <Text style={[styles.cardTitle, { color: t.title }]} numberOfLines={1}>{item.title}</Text>
                <View style={styles.locRow}>
                    <Building2 size={12} color={t.muted} />
                    <Text style={[styles.locText, { color: t.muted }]} numberOfLines={1}>{item.locality}, {item.city || 'Gandhinagar'}</Text>
                </View>

                <View style={[styles.statsRow, { borderColor: t.divider }]}>
                    <View style={styles.statBox}>
                        <Eye size={14} color="#0C886B" />
                        <Text style={[styles.statNum, { color: t.title }]}>142</Text>
                        <Text style={[styles.statLabel, { color: t.muted }]}>Views</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statBox}>
                        <PhoneCall size={14} color="#f4a92f" />
                        <Text style={[styles.statNum, { color: t.title }]}>12</Text>
                        <Text style={[styles.statLabel, { color: t.muted }]}>Leads</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />

            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <View>
                    <Text style={[styles.roleLabel, { color: t.muted }]}>{roleName} Dashboard</Text>
                    <Text style={[styles.headerTitle, { color: t.title }]}>{name}</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.settingsBtn}>
                    <Settings size={22} color={t.title} />
                </TouchableOpacity>
            </View>

            <View style={styles.listSection}>
                <View style={styles.listHeader}>
                    <Text style={[styles.listTitle, { color: t.title }]}>My Properties ({myListings.length})</Text>
                </View>

                {myListings.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyText, { color: t.muted }]}>You haven't posted any properties yet.</Text>
                        <TouchableOpacity
                            style={styles.addBtn}
                            onPress={() => {
                                if (!isKycd) {
                                    navigation.navigate('Verification');
                                } else {
                                    navigation.navigate('AddListing');
                                }
                            }}
                        >
                            <Plus size={18} color="#fff" />
                            <Text style={styles.addBtnText}>Post First Property</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={myListings}
                        keyExtractor={item => item.id}
                        renderItem={renderCard}
                        contentContainerStyle={styles.flatListContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 },
    roleLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
    headerTitle: { fontSize: 24, fontWeight: '800' },
    settingsBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(12, 136, 107, 0.08)', alignItems: 'center', justifyContent: 'center' },
    listSection: { flex: 1, paddingHorizontal: 20 },
    listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    listTitle: { fontSize: 18, fontWeight: '700' },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
    emptyText: { fontSize: 14, marginBottom: 20 },
    addBtn: { flexDirection: 'row', backgroundColor: '#0C886B', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16, alignItems: 'center', gap: 8 },
    addBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
    flatListContent: { paddingBottom: 120, gap: 16 },
    card: { borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
    cardImg: { width: '100%', height: 160 },
    cardInfo: { padding: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(15, 186, 129, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#0fba81' },
    statusText: { fontSize: 10, fontWeight: '700', color: '#0fba81', textTransform: 'uppercase' },
    actionBtn: { padding: 4 },
    cardTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3, marginBottom: 4 },
    locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
    locText: { fontSize: 12 },
    statsRow: { flexDirection: 'row', borderTopWidth: 1, paddingTop: 12 },
    statBox: { flex: 1, alignItems: 'center' },
    statNum: { fontSize: 16, fontWeight: '800', marginTop: 4 },
    statLabel: { fontSize: 10, fontWeight: '600' },
    statDivider: { width: 1, backgroundColor: 'rgba(0,0,0,0.05)' }
});
