import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Heart } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/useAppStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropertyCard from '../components/PropertyCard';
import { ApiService } from '../services/apiService';
import type { Property } from '../data/properties';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SavedScreen() {
    const navigation = useNavigation<Nav>();
    const { t } = useAppTheme();
    const insets = useSafeAreaInsets();
    const savedIds = useAppStore(state => state.savedIds);
    const toggleSave = useAppStore(state => state.toggleSave);
    const userListings = useAppStore(state => state.userListings);

    const [apiProperties, setApiProperties] = useState<Property[]>([]);

    // Derived state
    const allProperties = [...userListings, ...apiProperties];

    React.useEffect(() => {
        ApiService.getProperties().then(setApiProperties);
    }, []);

    const savedProperties = allProperties.filter(p => savedIds.includes(p.id));
    const displayProperties = savedProperties; // Assuming displayProperties refers to savedProperties

    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <Text style={[styles.headerTitle, { color: t.title }]}>Saved Items</Text>
                <Text style={[styles.itemCount, { color: t.muted }]}>
                    {displayProperties.length} properties
                </Text>
            </View>
            <FlatList
                data={savedProperties}
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
                        <View style={styles.emptyIconBg}>
                            <Heart size={44} color="#0C886B" strokeWidth={1.5} />
                        </View>
                        <Text style={[styles.emptyTitle, { color: t.title }]}>No Saved Properties</Text>
                        <Text style={[styles.emptyDesc, { color: t.muted }]}>
                            Properties you like will show up here. Start exploring to find your dream home.
                        </Text>
                        <TouchableOpacity
                            style={styles.discoverBtn}
                            onPress={() => navigation.navigate('MainTabs' as any, { screen: 'Search' })}
                        >
                            <Text style={styles.discoverBtnText}>Discover Properties</Text>
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingBottom: 12, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
    headerTitle: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
    itemCount: { fontSize: 13 },
    emptyIconBg: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: '#E4F3EF', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: { fontSize: 20, fontWeight: '800', marginBottom: 10, letterSpacing: -0.4 },
    emptyDesc: { textAlign: 'center', fontSize: 14, lineHeight: 22, paddingHorizontal: 20, marginBottom: 32 },
    discoverBtn: {
        backgroundColor: '#0C886B', paddingHorizontal: 28, paddingVertical: 14,
        borderRadius: 16, shadowColor: '#0C886B', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
    },
    discoverBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    empty: { alignItems: 'center', paddingTop: 100, paddingHorizontal: 20 },
    listContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 120 },
});
