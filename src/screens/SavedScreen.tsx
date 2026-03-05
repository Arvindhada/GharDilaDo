import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Heart, MapPin } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/useAppStore';
import PropertyCard from '../components/PropertyCard';
import { mockProperties } from '../data/properties';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SavedScreen() {
    const navigation = useNavigation<Nav>();
    const { t } = useAppTheme();
    const { savedIds, toggleSave } = useAppStore();

    const savedProperties = mockProperties.filter(p => savedIds.includes(p.id));

    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: t.title }]}>Saved Properties</Text>
                <Text style={[styles.count, { color: t.muted }]}>{savedProperties.length} saved</Text>
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
                        <Text style={styles.emptyIcon}>💔</Text>
                        <Text style={[styles.emptyTitle, { color: t.title }]}>No saved properties</Text>
                        <Text style={[styles.emptyDesc, { color: t.muted }]}>Tap the heart icon on any property to save it here</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 12, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
    headerTitle: { fontSize: 24, fontWeight: '800' },
    count: { fontSize: 13 },
    emptyIcon: { fontSize: 48, marginBottom: 16 },
    emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
    emptyDesc: { textAlign: 'center', fontSize: 14, lineHeight: 20 },
    empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 32 },
    listContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 100 },
});
