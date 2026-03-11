import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, FlatList,
    Image, TextInput, StatusBar, ScrollView, Modal, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Search, Building2, Heart, SlidersHorizontal, Clock, ArrowRight } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/useAppStore';
import PropertyCard from '../components/PropertyCard';
import PropertyCardSkeleton from '../components/PropertyCardSkeleton';
import RangeSlider from '../components/RangeSlider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ApiService } from '../services/apiService';
import { mockProperties, LOCALITIES, SORT_OPTIONS, type Property } from '../data/properties';

const BHK_OPTIONS = ['Any', '1 BHK', '2 BHK', '3 BHK', '4 BHK+'];

type Nav = NativeStackNavigationProp<RootStackParamList>;
type SearchRouteProp = RouteProp<RootStackParamList, 'MainTabs'>;

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
    const insets = useSafeAreaInsets();
    const savedIds = useAppStore(state => state.savedIds);
    const toggleSave = useAppStore(state => state.toggleSave);
    const userListings = useAppStore(state => state.userListings);

    const [query, setQuery] = useState('');
    const [apiProperties, setApiProperties] = useState<Property[]>([]);

    // Derived state: Dynamic merge of API data and local user listings
    const allProperties = [...userListings, ...apiProperties];
    console.log(`[DEBUG] SearchScreen: userListings=${userListings.length}, apiProperties=${apiProperties.length}, total=${allProperties.length}`);
    const recentSearches = useAppStore(state => state.recentSearches);
    const addRecentSearch = useAppStore(state => state.addRecentSearch);
    const clearRecentSearches = useAppStore(state => state.clearRecentSearches);
    const [loading, setLoading] = useState(false);
    const [activeFilters, setActiveFilters] = useState<FilterData | null>(null);
    const [isLocationModalVisible, setLocationModalVisible] = useState(false);
    const [modalQuery, setModalQuery] = useState('');

    // Quick Filter Modal States
    const [isSortModalVisible, setSortModalVisible] = useState(false);
    const [isBhkModalVisible, setBhkModalVisible] = useState(false);
    const [isBudgetModalVisible, setBudgetModalVisible] = useState(false);

    // Ref to track last consumed filter params and prevent stale re-application
    const lastAppliedParamsRef = React.useRef<string | null>(null);

    // Centralized Reset function
    const resetAllFilters = () => {
        setQuery('');
        setActiveFilters(null);
        lastAppliedParamsRef.current = '__RESET__'; // Mark as reset so params won't re-apply
        navigation.setParams({ filters: undefined });
    };

    // Aggressive Reset logic on Tab Click
    React.useEffect(() => {
        const unsubscribe = (navigation as any).addListener('tabPress', () => {
            resetAllFilters();
        });
        return unsubscribe;
    }, [navigation]);

    // Listen for filters from FilterScreen
    React.useEffect(() => {
        if (route.params?.filters) {
            const paramsKey = JSON.stringify(route.params.filters);
            // Only apply if these are genuinely new params (not stale)
            if (paramsKey !== lastAppliedParamsRef.current) {
                lastAppliedParamsRef.current = paramsKey;
                setActiveFilters(route.params.filters);
            }
        }
    }, [route.params?.filters]);

    React.useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        setLoading(true);
        const apiData = await ApiService.getProperties();
        setApiProperties(apiData);
        setTimeout(() => setLoading(false), 800);
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
            const { minRent, maxRent, selectedBhk, selectedType, selectedFurnishing, selectedSort, selectedAmenities } = activeFilters;

            if (minRent) result = result.filter(p => p.rent >= parseInt(minRent));
            if (maxRent) result = result.filter(p => p.rent <= parseInt(maxRent));
            if (selectedBhk && selectedBhk !== 'Any') {
                // Step 2 Fix: 4 BHK+ should match >= 4, not just === 4
                if (selectedBhk === '4 BHK+') {
                    result = result.filter(p => p.bhk >= 4);
                } else {
                    const bhkNum = parseInt(selectedBhk);
                    result = result.filter(p => p.bhk === bhkNum);
                }
            }
            if (selectedType && selectedType !== 'Any') {
                result = result.filter(p => p.type.toLowerCase() === selectedType.toLowerCase());
            }
            if (selectedFurnishing && selectedFurnishing !== 'Any') {
                result = result.filter(p => p.furnishing.toLowerCase() === selectedFurnishing.toLowerCase());
            }
            // Step 1 Fix: Amenity filter — ab actually kaam karega
            if (selectedAmenities && selectedAmenities.length > 0) {
                result = result.filter(p =>
                    (selectedAmenities as string[]).every((a: string) =>
                        p.amenities.some((pa: string) => pa.toLowerCase().includes(a.toLowerCase()))
                    )
                );
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
            handleLocationSelect('Infocity');
        }
    };

    const handleLocationSelect = (loc: string) => {
        setQuery(loc);
        setModalQuery(loc);
        setLocationModalVisible(false);
        // Step 3 Fix: Persisted recent searches via store
        if (loc.length > 3) {
            addRecentSearch(loc);
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
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <Text style={[styles.headerTitle, { color: t.title }]}>Explore</Text>
            </View>

            {/* Search Input Trigger */}
            <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.searchBox, { backgroundColor: t.cardBg }]}
                onPress={() => {
                    setModalQuery(query);
                    setLocationModalVisible(true);
                }}
            >
                <Search size={18} color={t.muted} strokeWidth={1.8} />
                <Text style={[styles.searchInputText, { color: query ? t.title : t.muted }]}>
                    {query || "Search Locality or Sector (e.g. Sector 11)"}
                </Text>
            </TouchableOpacity>

            {/* Quick Filters Row */}
            <View style={styles.quickFilterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickFilterScroll}>
                    <TouchableOpacity
                        style={[styles.quickFilterBtn, { backgroundColor: t.cardBg, borderColor: t.chipBorder }]}
                        onPress={() => navigation.navigate('Filter', { filters: activeFilters })}
                    >
                        <SlidersHorizontal size={14} color="#0C886B" />
                        <Text style={[styles.quickFilterText, { color: t.title }]}>Filters</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.quickFilterBtn,
                            { backgroundColor: t.cardBg, borderColor: t.chipBorder },
                            activeFilters?.selectedSort && activeFilters.selectedSort !== 'default' && styles.activeQuickFilter
                        ]}
                        onPress={() => setSortModalVisible(true)}
                    >
                        <Text style={[
                            styles.quickFilterText,
                            { color: t.title },
                            activeFilters?.selectedSort && activeFilters.selectedSort !== 'default' && styles.activeQuickFilterText
                        ]}>Sort By</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.quickFilterBtn,
                            { backgroundColor: t.cardBg, borderColor: t.chipBorder },
                            activeFilters?.selectedBhk && activeFilters.selectedBhk !== 'Any' && styles.activeQuickFilter
                        ]}
                        onPress={() => setBhkModalVisible(true)}
                    >
                        <Text style={[
                            styles.quickFilterText,
                            { color: t.title },
                            activeFilters?.selectedBhk && activeFilters.selectedBhk !== 'Any' && styles.activeQuickFilterText
                        ]}>BHK</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.quickFilterBtn,
                            { backgroundColor: t.cardBg, borderColor: t.chipBorder },
                            (activeFilters?.minRent && activeFilters.minRent !== '0' || activeFilters?.maxRent && activeFilters.maxRent !== '100000') && activeFilters && styles.activeQuickFilter
                        ]}
                        onPress={() => setBudgetModalVisible(true)}
                    >
                        <Text style={[
                            styles.quickFilterText,
                            { color: t.title },
                            (activeFilters?.minRent && activeFilters.minRent !== '0' || activeFilters?.maxRent && activeFilters.maxRent !== '100000') && activeFilters && styles.activeQuickFilterText
                        ]}>Budget</Text>
                    </TouchableOpacity>

                    {(!!query || (activeFilters && Object.values(activeFilters).some(v => v !== undefined && v !== 'Any' && v !== 'default' && v !== '0' && v !== '100000' && (Array.isArray(v) ? v.length > 0 : true)))) && (
                        <TouchableOpacity
                            style={[styles.quickFilterBtn, styles.resetBtn]}
                            onPress={resetAllFilters}
                        >
                            <Text style={styles.resetBtnText}>Reset</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>

            {/* Sort By Modal */}
            <Modal visible={isSortModalVisible} animationType="slide" transparent onRequestClose={() => setSortModalVisible(false)}>
                <View style={styles.bottomModalOverlay}>
                    <TouchableWithoutFeedback onPress={() => setSortModalVisible(false)}><View style={styles.modalBackdrop} /></TouchableWithoutFeedback>
                    <View style={[styles.bottomModalContent, { backgroundColor: t.bg }]}>
                        <Text style={[styles.modalTitle, { color: t.title }]}>Sort By</Text>
                        {SORT_OPTIONS.map(opt => (
                            <TouchableOpacity
                                key={opt.value}
                                style={styles.modalOption}
                                onPress={() => {
                                    setActiveFilters(prev => ({ ...prev, selectedSort: opt.value }));
                                    setSortModalVisible(false);
                                }}
                            >
                                <Text style={[styles.modalOptionText, { color: activeFilters?.selectedSort === opt.value ? '#0C886B' : t.title }]}>{opt.label}</Text>
                                {activeFilters?.selectedSort === opt.value && <View style={styles.dot} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

            {/* BHK Modal */}
            <Modal visible={isBhkModalVisible} animationType="slide" transparent onRequestClose={() => setBhkModalVisible(false)}>
                <View style={styles.bottomModalOverlay}>
                    <TouchableWithoutFeedback onPress={() => setBhkModalVisible(false)}><View style={styles.modalBackdrop} /></TouchableWithoutFeedback>
                    <View style={[styles.bottomModalContent, { backgroundColor: t.bg }]}>
                        <Text style={[styles.modalTitle, { color: t.title }]}>BHK Type</Text>
                        <View style={styles.chipGrid}>
                            {BHK_OPTIONS.map(opt => (
                                <TouchableOpacity
                                    key={opt}
                                    style={[
                                        styles.chipOption,
                                        { backgroundColor: t.cardBg, borderColor: t.chipBorder },
                                        activeFilters?.selectedBhk === opt && styles.selectedChipOption
                                    ]}
                                    onPress={() => {
                                        setActiveFilters(prev => ({ ...prev, selectedBhk: opt }));
                                        setBhkModalVisible(false);
                                    }}
                                >
                                    <Text style={[styles.chipOptionText, { color: activeFilters?.selectedBhk === opt ? '#fff' : t.title }]}>{opt}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Budget Modal */}
            <Modal visible={isBudgetModalVisible} animationType="slide" transparent onRequestClose={() => setBudgetModalVisible(false)}>
                <View style={styles.bottomModalOverlay}>
                    <TouchableWithoutFeedback onPress={() => setBudgetModalVisible(false)}><View style={styles.modalBackdrop} /></TouchableWithoutFeedback>
                    <View style={[styles.bottomModalContent, { backgroundColor: t.bg }]}>
                        <Text style={[styles.modalTitle, { color: t.title }]}>Budget Range</Text>
                        <View style={{ paddingVertical: 20 }}>
                            <RangeSlider
                                min={0} max={100000} step={1000}
                                initialLow={parseInt(activeFilters?.minRent || '0')}
                                initialHigh={parseInt(activeFilters?.maxRent || '100000')}
                                onValueChange={(low, high) => {
                                    setActiveFilters(prev => ({ ...prev, minRent: low.toString(), maxRent: high.toString() }));
                                }}
                            />
                        </View>
                        <TouchableOpacity style={styles.applyBtn} onPress={() => setBudgetModalVisible(false)}>
                            <Text style={styles.applyBtnText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Location Search Modal (Web-like Dropdown) */}
            <Modal
                visible={isLocationModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setLocationModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.modalOverlay}
                >
                    <TouchableWithoutFeedback onPress={() => setLocationModalVisible(false)}>
                        <View style={styles.modalBackdrop} />
                    </TouchableWithoutFeedback>

                    <View style={[styles.modalContent, { backgroundColor: t.bg }]}>
                        <View style={[styles.modalSearchBox, { backgroundColor: t.cardBg }]}>
                            <Search size={18} color={t.muted} strokeWidth={1.8} />
                            <TextInput
                                style={[styles.modalInput, { color: t.title }]}
                                placeholder="Search Locality or Landmark..."
                                placeholderTextColor={t.muted}
                                value={modalQuery}
                                onChangeText={setModalQuery}
                                autoFocus
                                returnKeyType="search"
                                onSubmitEditing={() => handleLocationSelect(modalQuery)}
                            />
                            {modalQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setModalQuery('')}>
                                    <Text style={{ color: t.muted, fontSize: 13, fontWeight: '600' }}>Clear</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
                            <View style={styles.modalHeaderRow}>
                                <Text style={[styles.modalSectionTitle, { color: t.muted }]}>
                                    {modalQuery ? 'Matching Locations' : 'Recent Searches'}
                                </Text>
                                {!modalQuery && recentSearches.length > 0 && (
                                    <TouchableOpacity onPress={clearRecentSearches}>
                                        <Text style={styles.clearAllText}>Clear All</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {modalQuery.length === 0 && recentSearches.length > 0 && (
                                <View style={[styles.recentWrap, { marginBottom: 16 }]}>
                                    {recentSearches.map(s => (
                                        <TouchableOpacity
                                            key={s}
                                            style={[styles.recentChip, { backgroundColor: t.innerCardBg }]}
                                            onPress={() => handleLocationSelect(s)}
                                        >
                                            <Clock size={14} color={t.muted} />
                                            <Text style={[styles.recentText, { color: t.title }]}>{s}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                            {!modalQuery && (
                                <Text style={[styles.modalSectionTitle, { color: t.muted, marginTop: 10 }]}>
                                    All Gandhinagar Localities
                                </Text>
                            )}

                            {modalQuery.length > 0 && (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => handleLocationSelect(modalQuery)}
                                >
                                    <Search size={16} color={t.muted} />
                                    <Text style={[styles.modalItemText, { color: t.title, fontWeight: '600' }]}>Search for "{modalQuery}"</Text>
                                </TouchableOpacity>
                            )}

                            {(modalQuery.length > 0
                                ? LOCALITIES.filter(l => l.toLowerCase().includes(modalQuery.toLowerCase()))
                                : LOCALITIES
                            ).map(loc => (
                                <TouchableOpacity
                                    key={loc}
                                    style={styles.modalItem}
                                    onPress={() => handleLocationSelect(loc)}
                                >
                                    <Building2 size={16} color={t.muted} />
                                    <Text style={[styles.modalItemText, { color: t.title }]}>{loc}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Results List (Filtered or Filtered by state) */}
                {(!!query || !!activeFilters) && (
                    <View style={styles.resultsBox}>
                        <View style={styles.resultsHeader}>
                            <Text style={[styles.sectionTitle, { color: t.title, marginBottom: 0 }]}>
                                {activeFilters ? 'Filtered Properties' : 'Search Results'} ({filtered.length})
                            </Text>
                            {(!!activeFilters || !!query) && (
                                <TouchableOpacity onPress={resetAllFilters}>
                                    <Text style={{ color: '#0C886B', fontWeight: '600', fontSize: 13 }}>Clear All</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <FlatList
                            data={(loading ? [1, 2, 3] : filtered) as any[]}
                            scrollEnabled={false} // Use ScrollView nesting
                            keyExtractor={(item, index) => loading ? `skel-${index}` : (item as Property).id}
                            contentContainerStyle={styles.listContent}
                            renderItem={({ item }) => (
                                loading ? (
                                    <PropertyCardSkeleton />
                                ) : (
                                    <PropertyCard
                                        property={item as Property}
                                        variant="horizontal"
                                        onPress={() => navigation.navigate('PropertyDetail', { propertyId: (item as Property).id })}
                                    />
                                )
                            )}
                            ListEmptyComponent={
                                !loading ? (
                                    <View style={styles.empty}>
                                        <Search size={48} color={t.muted} strokeWidth={1} style={{ marginBottom: 16 }} />
                                        <Text style={[styles.emptyText, { color: t.title, fontSize: 16, fontWeight: '700' }]}>
                                            No properties found
                                        </Text>
                                        <Text style={[styles.emptySub, { color: t.muted, marginTop: 4, textAlign: 'center' }]}>
                                            Try searching in these popular areas instead
                                        </Text>
                                        <View style={[styles.localitiesWrap, { marginTop: 24, justifyContent: 'center' }]}>
                                            {LOCALITIES.slice(0, 6).map(loc => (
                                                <TouchableOpacity
                                                    key={loc}
                                                    style={[styles.localityChip, { backgroundColor: t.cardBg, borderColor: t.chipBorder }]}
                                                    onPress={() => handleLocationSelect(loc)}
                                                >
                                                    <Text style={[styles.localityChipText, { color: t.title }]}>{loc}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                ) : null
                            }
                        />
                    </View>
                )}

                {/* Content shown when no query and no filters */}
                {!query && !activeFilters && (
                    <>
                        {/* Popular Collections */}
                        <View style={[styles.section, { marginTop: 10 }]}>
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
                                        <Building2 size={12} color="#0C886B" strokeWidth={2} />
                                        <Text style={[styles.localityChipText, { color: t.title }]}>{loc}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </>
                )}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.8 },
    filterBtn: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    searchBox: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        marginHorizontal: 16, marginBottom: 16,
        height: 54, borderRadius: 16, paddingHorizontal: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    searchInputText: { flex: 1, fontSize: 15, fontWeight: '500' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-start' },
    modalBackdrop: { ...StyleSheet.absoluteFillObject },
    modalContent: {
        marginTop: 100,
        marginHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 20,
        maxHeight: '70%',
        shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 10,
        overflow: 'hidden'
    },
    modalSearchBox: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        margin: 16, height: 50, borderRadius: 12, paddingHorizontal: 16,
    },
    modalInput: { flex: 1, fontSize: 16, fontWeight: '500' },
    modalScroll: { paddingHorizontal: 16, paddingBottom: 20 },
    modalSection: { marginBottom: 20 },
    modalSectionTitle: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, marginLeft: 4 },
    modalItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.04)' },
    modalItemText: { fontSize: 15, fontWeight: '500' },
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
    quickFilterContainer: { marginBottom: 16 },
    quickFilterScroll: { paddingHorizontal: 16, gap: 8 },
    quickFilterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 14,
        borderWidth: 1,
    },
    quickFilterText: {
        fontSize: 13,
        fontWeight: '600',
    },
    activeQuickFilter: {
        backgroundColor: '#0C886B',
        borderColor: '#0C886B',
    },
    activeQuickFilterText: {
        color: '#fff',
    },
    bottomModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    bottomModalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 20 },
    modalOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    modalOptionText: { fontSize: 16, fontWeight: '600' },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0C886B' },
    chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    chipOption: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, borderWidth: 1 },
    selectedChipOption: { backgroundColor: '#0C886B', borderColor: '#0C886B' },
    chipOptionText: { fontSize: 14, fontWeight: '700' },
    applyBtn: { backgroundColor: '#0C886B', height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
    applyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    resetBtn: {
        backgroundColor: '#FFF1F0',
        borderColor: '#FFA39E',
    },
    resetBtnText: {
        color: '#F5222D',
        fontSize: 13,
        fontWeight: '700',
    },
    modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingRight: 4 },
    clearAllText: { color: '#0C886B', fontSize: 12, fontWeight: '700' },
    emptySub: { fontSize: 13, paddingHorizontal: 40 },
});
