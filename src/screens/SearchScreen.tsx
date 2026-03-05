import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, FlatList,
    Image, TextInput, StatusBar, ScrollView,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Search, MapPin, Heart, SlidersHorizontal, Clock, ArrowRight } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/useAppStore';
import PropertyCard from '../components/PropertyCard';
import { ApiService } from '../services/apiService';
import { mockProperties, LOCALITIES, type Property } from '../data/properties';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type SearchRouteProp = RouteProp<RootStackParamList, 'MainTabs'>; // Adjusted for nested

interface FilterData {
    minRent?: string;
    maxRent?: string;
    selectedBhk?: string;
    selectedType?: string;
    selectedFurnishing?: string;
    selectedSort?: string;
    selectedAmenities?: string[];
}

export default function SearchScreen() {
    const navigation = useNavigation<Nav>();
    const route = useRoute<any>(); // Simple any for params access
    const { t } = useAppTheme();
    const { savedIds, toggleSave } = useAppStore();

    const [query, setQuery] = useState('');
    const [allProperties, setAllProperties] = useState<Property[]>([]);
    const [recentSearches, setRecentSearches] = useState(['Ahmedabad Highway', '2 BHK Flat', 'Infocity']);
    const [loading, setLoading] = useState(false);
    const [activeFilters, setActiveFilters] = useState<FilterData | null>(null);

    // Aggressive Reset logic on Tab Click
    React.useEffect(() => {
        const unsubscribe = (navigation as any).addListener('tabPress', () => {
            // Force reset everything 
            setQuery('');
            setActiveFilters(null);
            navigation.setParams({ filters: undefined });
        });
        return unsubscribe;
    }, [navigation]);

    // Listen for filters from FilterScreen
    React.useEffect(() => {
        if (route.params?.filters) {
            setActiveFilters(route.params.filters);
            // Optionally clear the query if we want to focus on filters
            // setQuery(''); 
        }
    }, [route.params?.filters]);

    React.useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        const data = await ApiService.getProperties();
        setAllProperties(data);
    };

    const getFilteredProperties = () => {
        let result = [...allProperties];

        // 1. Text Query
        if (query) {
            const q = query.toLowerCase();
            result = result.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.locality.toLowerCase().includes(q) ||
                p.type.toLowerCase().includes(q)
            );
        }

        // 2. Active Filters
        if (activeFilters) {
            const { minRent, maxRent, selectedBhk, selectedType, selectedFurnishing, selectedSort } = activeFilters;

            if (minRent) result = result.filter(p => p.rent >= parseInt(minRent));
            if (maxRent) result = result.filter(p => p.rent <= parseInt(maxRent));
            if (selectedBhk && selectedBhk !== 'Any') {
                const bhkNum = parseInt(selectedBhk);
                result = result.filter(p => p.bhk === bhkNum);
            }
            if (selectedType && selectedType !== 'Any') {
                result = result.filter(p => p.type.toLowerCase() === selectedType.toLowerCase());
            }
            if (selectedFurnishing && selectedFurnishing !== 'Any') {
                result = result.filter(p => p.furnishing.toLowerCase() === selectedFurnishing.toLowerCase());
            }

            // 3. Sorting
            if (selectedSort === 'price_asc') {
                result.sort((a, b) => a.rent - b.rent);
            } else if (selectedSort === 'price_desc') {
                result.sort((a, b) => b.rent - a.rent);
            }
        }

        return result;
    };

    const filtered = getFilteredProperties();

    const handleCollectionClick = (id: string) => {
        if (id === '1') { // Budget Friendly
            setActiveFilters({ maxRent: '15000', selectedSort: 'price_asc' });
        } else if (id === '2') { // Luxury
            setActiveFilters({ minRent: '40000', selectedSort: 'price_desc' });
        } else if (id === '3') { // Near Infocity
            setQuery('Infocity');
        }
    };

    const collections = [
        { id: '1', title: 'Budget Friendly', subtitle: 'Under ₹15,000', color: '#E4F3EF', iconColor: '#0C886B' },
        { id: '2', title: 'Luxury Stays', subtitle: 'Premium Villas', color: '#e9e1ff', iconColor: '#6c5dd3' },
        { id: '3', title: 'Near Infocity', subtitle: 'Best for Techies', color: '#fff5d8', iconColor: '#f4a92f' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: t.title }]}>Explore</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Filter')} style={[styles.filterBtn, { backgroundColor: t.cardBg }]}>
                    <SlidersHorizontal size={20} color="#0C886B" strokeWidth={2} />
                </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={[styles.searchBox, { backgroundColor: t.cardBg }]}>
                <Search size={18} color={t.muted} strokeWidth={1.8} />
                <TextInput
                    style={[styles.searchInput, { color: t.title }]}
                    placeholder="Search localities, BHK, type..."
                    placeholderTextColor={t.muted}
                    value={query}
                    onChangeText={setQuery}
                    onBlur={() => {
                        if (query.length > 3 && !recentSearches.includes(query)) {
                            setRecentSearches(prev => [query, ...prev].slice(0, 5));
                        }
                    }}
                    returnKeyType="search"
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Results List (Filtered or Filtered by state) */}
                {(!!query || !!activeFilters) && (
                    <View style={styles.resultsBox}>
                        <View style={styles.resultsHeader}>
                            <Text style={[styles.sectionTitle, { color: t.title, marginBottom: 0 }]}>
                                {activeFilters ? 'Filtered Properties' : 'Search Results'} ({filtered.length})
                            </Text>
                            {(!!activeFilters || !!query) && (
                                <TouchableOpacity onPress={() => { setQuery(''); setActiveFilters(null); navigation.setParams({ filters: undefined }); }}>
                                    <Text style={{ color: '#0C886B', fontWeight: '600', fontSize: 13 }}>Clear All</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <FlatList
                            data={filtered}
                            scrollEnabled={false} // Use ScrollView nesting
                            keyExtractor={p => p.id}
                            contentContainerStyle={styles.listContent}
                            renderItem={({ item: p }) => (
                                <PropertyCard
                                    property={p}
                                    variant="horizontal"
                                    onPress={() => navigation.navigate('PropertyDetail', { propertyId: p.id })}
                                />
                            )}
                            ListEmptyComponent={
                                <View style={styles.empty}>
                                    <Text style={[styles.emptyText, { color: t.muted }]}>No properties found for "{query}"</Text>
                                </View>
                            }
                        />
                    </View>
                )}

                {/* Content shown when no query and no filters */}
                {!query && !activeFilters && (
                    <>
                        {/* Recent Searches */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: t.title }]}>Recent Searches</Text>
                            <View style={styles.recentWrap}>
                                {recentSearches.map(term => (
                                    <TouchableOpacity
                                        key={term}
                                        style={[styles.recentChip, { backgroundColor: t.cardBg }]}
                                        onPress={() => setQuery(term)}
                                    >
                                        <Clock size={14} color={t.muted} />
                                        <Text style={[styles.recentText, { color: t.title }]}>{term}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Popular Collections */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: t.title }]}>Popular Collections</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.collectionScroll}>
                                {collections.map(c => (
                                    <TouchableOpacity
                                        key={c.id}
                                        style={[styles.collectionCard, { backgroundColor: c.color }]}
                                        onPress={() => handleCollectionClick(c.id)}
                                    >
                                        <View style={[styles.collectionIcon, { backgroundColor: '#fff' }]}>
                                            <Heart size={20} color={c.iconColor} fill={c.iconColor} />
                                        </View>
                                        <View>
                                            <Text style={[styles.collectionTitle, { color: '#1b1d21' }]}>{c.title}</Text>
                                            <Text style={[styles.collectionSubtitle, { color: '#666' }]}>{c.subtitle}</Text>
                                        </View>
                                        <View style={styles.collectionArrow}>
                                            <ArrowRight size={14} color="#fff" />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Popular Localities */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: t.title }]}>Popular Localities</Text>
                            <View style={styles.localitiesWrap}>
                                {LOCALITIES.slice(0, 8).map(loc => (
                                    <TouchableOpacity
                                        key={loc}
                                        style={[styles.localityChip, { backgroundColor: t.cardBg, borderColor: t.chipBorder }]}
                                        onPress={() => navigation.navigate('Listings', { locality: loc })}
                                    >
                                        <MapPin size={12} color="#0C886B" strokeWidth={2} />
                                        <Text style={[styles.localityChipText, { color: t.title }]}>{loc}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </>
                )}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.8 },
    filterBtn: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    searchBox: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        marginHorizontal: 16, marginBottom: 16,
        height: 54, borderRadius: 16, paddingHorizontal: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    searchInput: { flex: 1, fontSize: 15, fontWeight: '500' },
    section: { paddingHorizontal: 16, marginBottom: 28 },
    resultsBox: { paddingHorizontal: 16 },
    sectionTitle: { fontSize: 17, fontWeight: '800', marginBottom: 16, letterSpacing: -0.3 },
    resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    recentWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    recentChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
    recentText: { fontSize: 13, fontWeight: '500' },
    collectionScroll: { paddingLeft: 16, paddingRight: 8 },
    collectionCard: {
        width: 180, height: 130, borderRadius: 24, padding: 16, marginRight: 12,
        justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
    },
    collectionIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    collectionTitle: { fontSize: 15, fontWeight: '800' },
    collectionSubtitle: { fontSize: 11, fontWeight: '500', marginTop: 2 },
    collectionArrow: {
        position: 'absolute', bottom: 12, right: 12, width: 28, height: 28,
        borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center',
    },
    localitiesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    localityChip: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1,
    },
    localityChipText: { fontSize: 13, fontWeight: '600' },
    empty: { alignItems: 'center', paddingTop: 60 },
    emptyText: { fontSize: 14, fontWeight: '500' },
    listContent: { gap: 12, paddingBottom: 20 },
});
