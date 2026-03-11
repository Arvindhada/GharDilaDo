import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, FlatList, Image, StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { ChevronLeft, Heart, ArrowUpDown, List, Building2 } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/useAppStore';
import PropertyCard from '../components/PropertyCard';
import PropertyCardSkeleton from '../components/PropertyCardSkeleton';
import { ApiService } from '../services/apiService';
import type { Property } from '../data/properties';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Listings'>;
type Route = RouteProp<RootStackParamList, 'Listings'>;

export default function ListingsScreen() {
    const navigation = useNavigation<Nav>();
    const route = useRoute<Route>();
    const { locality, type, featured } = route.params || {};
    const { t } = useAppTheme();
    const savedIds = useAppStore(state => state.savedIds);
    const toggleSave = useAppStore(state => state.toggleSave);
    const userListings = useAppStore(state => state.userListings);

    const [apiProperties, setApiProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    // Derived state: Syncs user added properties instantly
    const allProperties = [...userListings, ...apiProperties];

    React.useEffect(() => {
        const load = async () => {
            setLoading(true);
            const apiData = await ApiService.getProperties();
            setApiProperties(apiData);
            setTimeout(() => setLoading(false), 800);
        };
        load();
    }, []);

    const filtered = allProperties.filter(p => {
        if (locality && p.locality !== locality) return false;
        if (type && p.type !== type) return false;
        if (featured && !p.isFeatured) return false;
        return true;
    });

    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

    const sortedProperties = [...filtered].sort((a, b) => {
        if (sortOrder === 'asc') return a.rent - b.rent;
        if (sortOrder === 'desc') return b.rent - a.rent;
        return 0; // Default order
    });

    const toggleSort = () => {
        if (sortOrder === null) setSortOrder('asc');
        else if (sortOrder === 'asc') setSortOrder('desc');
        else setSortOrder(null);
    };

    const filterTitle = locality || type || (featured ? 'Featured' : 'All Properties');

    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: t.cardBg }]}>
                    <ChevronLeft size={22} color={t.title} strokeWidth={2.5} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.headerTitle, { color: t.title }]}>{filterTitle}</Text>
                    <Text style={[styles.count, { color: t.muted }]}>{sortedProperties.length} properties found</Text>
                </View>
                {sortedProperties.length > 0 && (
                    <TouchableOpacity
                        style={[styles.sortBtn, sortOrder && { backgroundColor: '#0C886B', borderColor: '#0C886B' }]}
                        onPress={toggleSort}
                    >
                        <ArrowUpDown size={18} color={sortOrder ? '#fff' : t.title} strokeWidth={2} />
                        <Text style={[styles.sortText, { color: sortOrder ? '#fff' : t.title }]}>
                            {sortOrder === 'asc' ? 'Low-High' : sortOrder === 'desc' ? 'High-Low' : 'Sort'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={(loading ? [1, 2, 3, 4] : sortedProperties) as any[]}
                keyExtractor={(item, index) => loading ? `skel-${index}` : (item as Property).id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    loading ? (
                        <PropertyCardSkeleton />
                    ) : (
                        <PropertyCard
                            property={item as Property}
                            fullWidth
                            onPress={() => navigation.navigate('PropertyDetail', { propertyId: (item as Property).id })}
                        />
                    )
                )}
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.empty}>
                            <Text style={styles.emptyIcon}>🏚</Text>
                            <Text style={[styles.emptyText, { color: t.muted }]}>No properties found</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16,
    },
    backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
    count: { fontSize: 13, marginTop: 2 },
    sortBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 12, paddingVertical: 8,
        borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb'
    },
    sortText: { fontSize: 13, fontWeight: '600' },
    cardBody: { padding: 14 },
    locality: { fontSize: 12, flex: 1 },
    rent: { color: '#0C886B', fontSize: 16, fontWeight: '800' },
    meta: { fontSize: 12 },
    empty: { alignItems: 'center', paddingTop: 100, gap: 16 },
    emptyIcon: { fontSize: 64, opacity: 0.8 },
    emptyText: { fontSize: 16, fontWeight: '600' },
    listContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40, gap: 16 },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    localityRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});
