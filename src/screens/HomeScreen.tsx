import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    StatusBar, FlatList, Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Bell, Search, MapPin, ChevronRight, Star, Heart, Building2, Home, TreePine, Layers, Store, Filter, Moon, Sun } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/useAppStore';
import PropertyCard from '../components/PropertyCard';
import { ApiService } from '../services/apiService';
import { mockProperties, localityStats, formatRent, type Property } from '../data/properties';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    Flat: <Building2 size={28} color="#0C886B" strokeWidth={1.8} />,
    House: <Home size={28} color="#6c5dd3" strokeWidth={1.8} />,
    Villa: <TreePine size={28} color="#0fba81" strokeWidth={1.8} />,
    Floor: <Layers size={28} color="#e85c5c" strokeWidth={1.8} />,
    Shop: <Store size={28} color="#f4a92f" strokeWidth={1.8} />,
};

const CATEGORY_COLORS: Record<string, string> = {
    Flat: '#E4F3EF',
    House: '#e9e1ff',
    Villa: '#d8f5ed',
    Floor: '#ffe1e1',
    Shop: '#fff5d8',
};

const CATEGORY_COUNTS: Record<string, string> = {
    Flat: '1,660+',
    House: '84+',
    Villa: '28+',
    Floor: '156+',
    Shop: '72+',
};



export default function HomeScreen() {
    const navigation = useNavigation<Nav>();
    const { isDark, toggleDark, t } = useAppTheme();
    const { savedIds, toggleSave } = useAppStore();

    // Safety Layer: Fetch properties from Service instead of direct mock import
    const [allProperties, setAllProperties] = React.useState<Property[]>([]);

    React.useEffect(() => {
        const load = async () => {
            const data = await ApiService.getProperties();
            setAllProperties(data);
        };
        load();
    }, []);

    const featuredProperties = allProperties.filter(p => p.isFeatured);
    const recentProperties = allProperties.slice(0, 4);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1b1d21" />

            {/* Dark Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcome}>Welcome to</Text>
                    <Text style={styles.brand}>ghardilado.com</Text>
                </View>
                <View style={styles.headerBtnRow}>
                    <TouchableOpacity
                        onPress={toggleDark}
                        style={[styles.iconBtn, isDark ? styles.iconBtnDark : styles.iconBtnLight]}
                    >
                        {isDark ? <Sun size={19} color="#fff" strokeWidth={2} /> : <Moon size={19} color="#fff" strokeWidth={2} />}
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Notifications')}
                        style={[styles.iconBtn, styles.iconBtnNotif]}
                    >
                        <Bell size={20} color="#fff" strokeWidth={1.8} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* White content section */}
            <View style={[styles.content, { backgroundColor: t.bg }]}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pb100}>
                    {/* Search Bar */}
                    <TouchableOpacity
                        style={[styles.searchBar, { backgroundColor: t.cardBg }]}
                        onPress={() => navigation.navigate('MainTabs' as any, { screen: 'Search' })}
                        activeOpacity={0.7}
                    >
                        <Search size={18} color={t.muted} strokeWidth={1.8} />
                        <Text style={[styles.searchPlaceholder, { color: t.muted }]}>
                            Search localities, property{`\n`}type...
                        </Text>
                        <View style={styles.filterChip}>
                            <Filter size={16} color="#fff" strokeWidth={2.2} />
                        </View>
                    </TouchableOpacity>

                    {/* Property Types */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: t.title }]}>Property Types</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Listings', {})}>
                                <Text style={styles.seeAll}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.categoriesRow}>
                            {Object.entries(CATEGORY_ICONS).map(([type, icon]) => (
                                <TouchableOpacity
                                    key={type}
                                    style={styles.categoryItem}
                                    onPress={() => navigation.navigate('Listings', { type })}
                                >
                                    <View style={[styles.categoryIcon, { backgroundColor: CATEGORY_COLORS[type] }]}>
                                        {icon}
                                    </View>
                                    <Text style={[styles.categoryLabel, { color: t.title }]}>{type}</Text>
                                    <Text style={[styles.categoryCount, { color: t.muted }]}>{CATEGORY_COUNTS[type]}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Featured Properties */}
                    <View style={styles.pt24}>
                        <View style={[styles.sectionHeader, styles.px26]}>
                            <Text style={[styles.sectionTitle, { color: t.title }]}>Featured Properties</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Listings', { featured: true })}>
                                <Text style={styles.seeAll}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={featuredProperties}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.featuredListContent}
                            keyExtractor={p => p.id}
                            renderItem={({ item: p }) => (
                                <PropertyCard
                                    property={p}
                                    onPress={() => navigation.navigate('PropertyDetail', { propertyId: p.id })}
                                />
                            )}
                        />
                    </View>

                    {/* Popular Localities */}
                    <View style={[styles.section, styles.pt24]}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: t.title }]}>Popular Localities</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Listings', {})}>
                                <Text style={styles.seeAll}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.gap10}>
                            {localityStats.slice(0, 5).map(loc => (
                                <TouchableOpacity
                                    key={loc.name}
                                    onPress={() => navigation.navigate('Listings', { locality: loc.name })}
                                    style={[styles.localityRow, { backgroundColor: t.cardBg }]}
                                >
                                    <View style={styles.localityLeft}>
                                        <View style={styles.localityIconBox}>
                                            <MapPin size={20} color="#0C886B" strokeWidth={2} />
                                        </View>
                                        <View>
                                            <Text style={[styles.localityName, { color: t.title }]}>{loc.name}</Text>
                                            <Text style={[styles.localityCount, { color: t.muted }]}>{loc.count} properties</Text>
                                        </View>
                                    </View>
                                    <View style={styles.arrowBtn}>
                                        <ChevronRight size={16} color="#fff" strokeWidth={2.5} />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Recent Listings */}
                    <View style={[styles.section, styles.pt24]}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: t.title }]}>Recent Listings</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Listings', {})}>
                                <Text style={styles.seeAll}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.gap12}>
                            {recentProperties.map(p => (
                                <TouchableOpacity
                                    key={p.id}
                                    onPress={() => navigation.navigate('PropertyDetail', { propertyId: p.id })}
                                    style={[styles.listRow, { backgroundColor: t.innerCardBg }]}
                                    activeOpacity={0.85}
                                >
                                    <Image source={{ uri: p.images[0] }} style={styles.listImg} />
                                    <View style={styles.listBody}>
                                        <View style={styles.listBadgeRow}>
                                            <View style={[styles.typeBadge, { backgroundColor: t.badgeBg }]}>
                                                <Text style={[styles.typeBadgeText, { color: t.muted }]}>{p.type}</Text>
                                            </View>
                                            {p.isVerified && (
                                                <View style={styles.verifiedChip}>
                                                    <Text style={styles.verifiedChipText}>Verified</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={[styles.listTitle, { color: t.title }]} numberOfLines={1}>{p.title}</Text>
                                        <View style={styles.listLocalityRow}>
                                            <MapPin size={10} color={t.muted} strokeWidth={2} />
                                            <Text style={[styles.listLocality, { color: t.muted }]} numberOfLines={1}>{p.locality}, Gandhinagar</Text>
                                        </View>
                                        <View style={styles.listPriceRow}>
                                            <Text style={styles.listRent}>₹{p.rent.toLocaleString('en-IN')}/mo</Text>
                                            <Text style={[styles.listMeta, { color: t.muted }]}>{p.bhk} BHK · {p.area} sqft</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1b1d21' },
    header: {
        paddingHorizontal: 26, paddingTop: 12, paddingBottom: 18,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    },
    welcome: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 18 },
    brand: { color: '#fff', fontSize: 22, fontWeight: '800', letterSpacing: -0.6, lineHeight: 28 },
    iconBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    content: { flex: 1, borderTopLeftRadius: 40, borderTopRightRadius: 40, overflow: 'hidden' },
    searchBar: {
        marginHorizontal: 26, marginTop: 22, marginBottom: 8, height: 60,
        borderRadius: 28, flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 20, gap: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    },
    searchPlaceholder: { flex: 1, fontSize: 14, textAlign: 'center', lineHeight: 20 },
    filterChip: {
        width: 38, height: 38, backgroundColor: '#0C886B',
        borderRadius: 19, alignItems: 'center', justifyContent: 'center',
    },
    section: { paddingHorizontal: 26, marginTop: 8 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingTop: 2 },
    sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.4 },
    seeAll: { color: '#0C886B', fontSize: 13, fontWeight: '600' },
    categoriesRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
    categoryItem: { alignItems: 'center', flex: 1 },
    categoryIcon: {
        width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 8,
    },
    categoryLabel: { fontSize: 12, fontWeight: '600', letterSpacing: -0.2 },
    categoryCount: { fontSize: 10, marginTop: 2 },
    card: {
        width: 220, borderRadius: 20, overflow: 'hidden',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
    },
    cardImgWrap: { width: '100%', height: 140, position: 'relative' },
    cardImg: { width: '100%', height: '100%' },
    heartBtn: {
        position: 'absolute', top: 10, right: 10,
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.92)',
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12, shadowRadius: 3, elevation: 2,
    },
    verifiedBadge: {
        position: 'absolute', top: 10, left: 10,
        backgroundColor: '#0C886B', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
    },
    verifiedText: { color: '#fff', fontSize: 10, fontWeight: '700' },
    cardBody: { padding: 12 },
    cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    ratingText: { fontSize: 11, fontWeight: '600' },
    furnishText: { fontSize: 10 },
    cardTitle: { fontSize: 14, fontWeight: '700', letterSpacing: -0.3, marginBottom: 4, lineHeight: 20 },
    localityText: { fontSize: 11, lineHeight: 16 },
    rent: { color: '#0C886B', fontSize: 15, fontWeight: '800', letterSpacing: -0.4 },
    perMonth: { fontSize: 11 },
    bhk: { fontSize: 11 },
    localityRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        height: 68, paddingHorizontal: 16, borderRadius: 16,
    },
    localityLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    localityIconBox: { width: 44, height: 44, backgroundColor: 'rgba(12,136,107,0.1)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    localityName: { fontSize: 15, fontWeight: '700', letterSpacing: -0.3, lineHeight: 20 },
    localityCount: { fontSize: 12, lineHeight: 16 },
    arrowBtn: { width: 32, height: 32, backgroundColor: '#0C886B', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    listRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 12, borderRadius: 16 },
    listImg: { width: 80, height: 80, borderRadius: 12 },
    listBody: { flex: 1 },
    typeBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
    typeBadgeText: { fontSize: 10, fontWeight: '500' },
    verifiedChip: { backgroundColor: '#E4F3EF', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
    verifiedChipText: { color: '#0C886B', fontSize: 10, fontWeight: '600' },
    listTitle: { fontSize: 13, fontWeight: '700', letterSpacing: -0.2, lineHeight: 18 },
    listLocality: { fontSize: 11 },
    listRent: { color: '#0C886B', fontSize: 13, fontWeight: '800', letterSpacing: -0.3 },
    listMeta: { fontSize: 11 },
    ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    localityBox: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
    headerBtnRow: { flexDirection: 'row', gap: 10 },
    iconBtnDark: { backgroundColor: '#0C886B' },
    iconBtnLight: { backgroundColor: 'rgba(255,255,255,0.12)' },
    iconBtnNotif: { backgroundColor: 'rgba(255,255,255,0.1)' },
    pb100: { paddingBottom: 100 },
    pt24: { paddingTop: 20 },
    px26: { paddingHorizontal: 26 },
    featuredListContent: { paddingLeft: 26, paddingRight: 8, gap: 14 },
    gap10: { gap: 10 },
    gap12: { gap: 12 },
    listBadgeRow: { flexDirection: 'row', gap: 6, marginBottom: 2 },
    listLocalityRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
    listPriceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
});
