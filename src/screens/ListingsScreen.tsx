import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, FlatList, Image, StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { ChevronLeft, MapPin, Heart } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/useAppStore';
import PropertyCard from '../components/PropertyCard';
import { mockProperties } from '../data/properties';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Listings'>;
type Route = RouteProp<RootStackParamList, 'Listings'>;

export default function ListingsScreen() {
    const navigation = useNavigation<Nav>();
    const route = useRoute<Route>();
    const { locality, type, featured } = route.params || {};
    const { t } = useAppTheme();
    const { savedIds, toggleSave } = useAppStore();

    const filtered = mockProperties.filter(p => {
        if (locality && p.locality !== locality) return false;
        if (type && p.type !== type) return false;
        if (featured && !p.isFeatured) return false;
        return true;
    });

    const filterTitle = locality || type || (featured ? 'Featured' : 'All Properties');

    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={t.title} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: t.title }]}>{filterTitle}</Text>
                <Text style={[styles.count, { color: t.muted }]}>{filtered.length} found</Text>
            </View>
            <FlatList
                data={filtered}
                keyExtractor={p => p.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: p }) => (
                    <PropertyCard
                        property={p}
                        fullWidth
                        onPress={() => navigation.navigate('PropertyDetail', { propertyId: p.id })}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyIcon}>🏚</Text>
                        <Text style={[styles.emptyText, { color: t.muted }]}>No properties found</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12,
    },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { flex: 1, fontSize: 18, fontWeight: '800' },
    count: { fontSize: 13 },
    cardBody: { padding: 14 },
    locality: { fontSize: 12, flex: 1 },
    rent: { color: '#0C886B', fontSize: 16, fontWeight: '800' },
    meta: { fontSize: 12 },
    empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
    emptyIcon: { fontSize: 40 },
    emptyText: { fontSize: 15 },
    listContent: { padding: 16, gap: 14 },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    localityRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});
