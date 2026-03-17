import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    StatusBar, FlatList, Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Bell, Search, ChevronRight, Star, Heart, Building2, Home, TreePine, Layers, Store, Filter, Moon, Sun } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/useAppStore';
import PropertyCard from '../components/PropertyCard';
import PropertyCardSkeleton from '../components/PropertyCardSkeleton';
import { ApiService } from '../services/apiService';
import { mockProperties, localityStats, formatRent, type Property } from '../data/properties';
import { translations } from '../data/translations';

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
    const savedIds = useAppStore(state => state.savedIds);
    const toggleSave = useAppStore(state => state.toggleSave);
    const name = useAppStore(state => state.name);
    const recentlyViewedIds = useAppStore(state => state.recentlyViewedIds);
    const userRole = useAppStore(state => state.userRole);
    const userListings = useAppStore(state => state.userListings);
    const language = useAppStore(state => state.language);

    const s = translations[language] || translations['English'];

    const [apiProperties, setApiProperties] = React.useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    // Derived state: instantly syncs API data + newly added user listings
    const allProperties = [...userListings, ...apiProperties];

    React.useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await ApiService.getProperties();
            setApiProperties(data);
            // Step 6 Fix: Removed fake 1500ms delay
            setLoading(false);
        };
        load();
    }, []);

    const featuredProperties = allProperties.filter(p => p.isFeatured);
    const recentListings = allProperties.slice(0, 4);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1b1d21" />

            {/* Dark Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcome}>{s.welcome}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={styles.brand}>{name?.trim() ? name : 'GharDilaDo'} 👋</Text>
                        {userRole !== 'seeker' && (
                            <View style={{ backgroundColor: 'rgba(12, 136, 107, 0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: '#0fba81' }}>
                                <Text style={{ color: '#0fba81', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
                                    ✓ {s.pro_badge} {userRole}
                                </Text>
                            </View>
                        )}
                    </View>
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
                    {/* Search Bar - now inside white section */}
                    <View style={styles.searchBarWrapper}>
                        <TouchableOpacity
                            style={[styles.searchBar, { backgroundColor: t.cardBg }]}
                            onPress={() => navigation.navigate('MainTabs' as any, { screen: 'Search' })}
                            activeOpacity={0.7}
                        >
                            <Search size={18} color={t.muted} strokeWidth={1.8} />
                            <Text style={[styles.searchPlaceholder, { color: t.muted }]}>
                                {s.search_hint}
                            </Text>
                            <View style={styles.filterChip}>
                                <Filter size={16} color="#fff" strokeWidth={2.2} />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Property Types */}
                    <View style={[styles.section, { marginTop: 24 }]}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: t.title }]}>{s.categories}</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Listings', {})}>
                                <Text style={styles.seeAll}>{s.see_all}</Text>
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
                            <Text style={[styles.sectionTitle, { color: t.title }]}>{s.featured}</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Listings', { featured: true })}>
                                <Text style={styles.seeAll}>{s.see_all}</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={(loading ? [1, 2, 3] : featuredProperties) as any[]}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.featuredListContent}
                            keyExtractor={(item, index) => loading ? `skel-${index}` : (item as Property).id}
                            renderItem={({ item }) => (
                                loading ? (
                                    <PropertyCardSkeleton />
                                ) : (
                                    <PropertyCard
                                        property={item as Property}
                                        onPress={() => navigation.navigate('PropertyDetail', { propertyId: (item as Property).id })}
                                    />
                                )
                            )}
                        />
                    </View>

                    {/* Popular Localities */}
                    <View style={[styles.section, styles.pt24]}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: t.title }]}>{s.popular_localities}</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Listings', {})}>
                                <Text style={styles.seeAll}>{s.see_all}</Text>
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
                                            <Building2 size={20} color="#0C886B" strokeWidth={2} />
                                        </View>
                                        <View>
                                            <Text style={[styles.localityName, { color: t.title }]}>{loc.name}</Text>
                                            <Text style={[styles.localityCount, { color: t.muted }]}>{loc.count} {s.properties_count}</Text>
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
                            <Text style={[styles.sectionTitle, { color: t.title }]}>{s.recent_listings}</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Listings', {})}>
                                <Text style={styles.seeAll}>{s.see_all}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.gap12}>
                            {loading ? (
                                [1, 2, 3].map((_, i) => <PropertyCardSkeleton key={i} />)
                            ) : (
                                allProperties.slice(0, 4).map(p => ( // Changed from `recentProperties` to `allProperties.slice(0,4)` to show general recent listings
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
                                                        <Text style={styles.verifiedChipText}>{s.verified}</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text style={[styles.listTitle, { color: t.title }]} numberOfLines={1}>{p.title}</Text>
                                            <View style={styles.listLocalityRow}>
                                                <Building2 size={10} color={t.muted} strokeWidth={2} />
                                                <Text style={[styles.listLocality, { color: t.muted }]} numberOfLines={1}>{p.locality}, Gandhinagar</Text>
                                            </View>
                                            <View style={styles.listPriceRow}>
                                                <Text style={styles.listRent}>₹{p.rent.toLocaleString('en-IN')}/{s.mo}</Text>
                                                <Text style={[styles.listMeta, { color: t.muted }]}>{p.bhk} {s.bhk} · {p.area} {s.sqft}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            )}
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
        paddingHorizontal: 26, paddingTop: 52, paddingBottom: 20,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#1b1d21',
    },
    welcome: { color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: '500', marginBottom: 2 },
    brand: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: -0.8 },
    iconBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    content: { flex: 1, borderTopLeftRadius: 36, borderTopRightRadius: 36, overflow: 'hidden' },
    searchBarWrapper: {
        zIndex: 10,
        paddingHorizontal: 26,
        paddingTop: 24,
    },
    searchBar: {
        height: 60,
        borderRadius: 28, flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 20, gap: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15, shadowRadius: 16, elevation: 10,
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
