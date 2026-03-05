import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    StatusBar, SafeAreaView, TextInput
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { X, Check } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';
import RangeSlider from '../components/RangeSlider';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Filter'>;

const BHK_OPTIONS = ['Any', '1 BHK', '2 BHK', '3 BHK', '4 BHK+'];
const PROPERTY_TYPES = ['Any', 'Flat', 'House', 'Villa', 'Floor', 'Shop'];
const AMENITIES = ['Wifi', 'Parking', 'AC', 'Gym', 'Security', 'Lift'];
const FURNISHING_OPTIONS = ['Any', 'Unfurnished', 'Semi-Furnished', 'Furnished'];
const SORT_OPTIONS = [
    { label: 'Relevance', value: 'default' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
];

export default function FilterScreen() {
    const navigation = useNavigation<Nav>();
    const { t } = useAppTheme();

    const route = useRoute<any>();

    const [resetKey, setResetKey] = useState(0);

    // Default values if not provided
    const [minRent, setMinRent] = useState(route.params?.filters?.minRent || '0');
    const [maxRent, setMaxRent] = useState(route.params?.filters?.maxRent || '100000');
    const [selectedBhk, setSelectedBhk] = useState(route.params?.filters?.selectedBhk || 'Any');
    const [selectedType, setSelectedType] = useState(route.params?.filters?.selectedType || 'Any');
    const [selectedFurnishing, setSelectedFurnishing] = useState(route.params?.filters?.selectedFurnishing || 'Any');
    const [selectedSort, setSelectedSort] = useState(route.params?.filters?.selectedSort || 'default');
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(route.params?.filters?.selectedAmenities || []);

    const toggleAmenity = (name: string) => {
        if (selectedAmenities.includes(name)) {
            setSelectedAmenities(prev => prev.filter(a => a !== name));
        } else {
            setSelectedAmenities(prev => [...prev, name]);
        }
    };

    const handleApply = () => {
        // Pass filters back to SearchScreen
        navigation.navigate('MainTabs', {
            screen: 'Search',
            params: {
                filters: {
                    minRent, maxRent, selectedBhk, selectedType,
                    selectedFurnishing, selectedSort, selectedAmenities
                }
            }
        } as any);
    };

    const handleReset = () => {
        setMinRent('0');
        setMaxRent('100000');
        setSelectedBhk('Any');
        setSelectedType('Any');
        setSelectedFurnishing('Any');
        setSelectedSort('default');
        setSelectedAmenities([]);
        setResetKey(prev => prev + 1); // Force slider reset
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.closeBtn}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                >
                    <X size={24} color={t.title} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: t.title }]}>Filters</Text>
                <TouchableOpacity onPress={handleReset}>
                    <Text style={[styles.resetText, { color: '#0C886B' }]}>Reset</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Price Range Slider */}
                <View style={{ paddingHorizontal: 10 }}>
                    <RangeSlider
                        key={resetKey}
                        min={0}
                        max={100000}
                        step={1000}
                        initialLow={parseInt(minRent) || 0}
                        initialHigh={parseInt(maxRent) || 100000}
                        onValueChange={(low, high) => {
                            setMinRent(low.toString());
                            setMaxRent(high.toString());
                        }}
                    />
                </View>

                <View style={styles.priceInputRow}>
                    <View style={[styles.priceInputBox, { backgroundColor: t.cardBg, borderColor: t.chipBorder }]}>
                        <Text style={[styles.inputLabel, { color: t.muted }]}>Min Price</Text>
                        <TextInput
                            style={[styles.priceInput, { color: t.title }]}
                            placeholder="0"
                            placeholderTextColor={t.muted}
                            keyboardType="numeric"
                            value={minRent}
                            onChangeText={setMinRent}
                        />
                    </View>
                    <View style={styles.priceDash} />
                    <View style={[styles.priceInputBox, { backgroundColor: t.cardBg, borderColor: t.chipBorder }]}>
                        <Text style={[styles.inputLabel, { color: t.muted }]}>Max Price</Text>
                        <TextInput
                            style={[styles.priceInput, { color: t.title }]}
                            placeholder="Any"
                            placeholderTextColor={t.muted}
                            keyboardType="numeric"
                            value={maxRent}
                            onChangeText={setMaxRent}
                        />
                    </View>
                </View>

                {/* Sort By */}
                <Text style={[styles.sectionTitle, { color: t.title }]}>Sort By</Text>
                <View style={styles.chipRow}>
                    {SORT_OPTIONS.map(opt => (
                        <TouchableOpacity
                            key={opt.value}
                            onPress={() => setSelectedSort(opt.value)}
                            style={[
                                styles.chip,
                                { backgroundColor: t.cardBg, borderColor: t.chipBorder },
                                selectedSort === opt.value && styles.selectedChip
                            ]}
                        >
                            <Text style={[
                                styles.chipText,
                                { color: t.title },
                                selectedSort === opt.value && styles.selectedChipText
                            ]}>{opt.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* BHK */}
                <Text style={[styles.sectionTitle, { color: t.title }]}>BHK Type</Text>
                <View style={styles.chipRow}>
                    {BHK_OPTIONS.map(opt => (
                        <TouchableOpacity
                            key={opt}
                            onPress={() => setSelectedBhk(opt)}
                            style={[
                                styles.chip,
                                { backgroundColor: t.cardBg, borderColor: t.chipBorder },
                                selectedBhk === opt && styles.selectedChip
                            ]}
                        >
                            <Text style={[
                                styles.chipText,
                                { color: t.title },
                                selectedBhk === opt && styles.selectedChipText
                            ]}>{opt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Property Type */}
                <Text style={[styles.sectionTitle, { color: t.title }]}>Property Type</Text>
                <View style={styles.chipRow}>
                    {PROPERTY_TYPES.map(type => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => setSelectedType(type)}
                            style={[
                                styles.chip,
                                { backgroundColor: t.cardBg, borderColor: t.chipBorder },
                                selectedType === type && styles.selectedChip
                            ]}
                        >
                            <Text style={[
                                styles.chipText,
                                { color: t.title },
                                selectedType === type && styles.selectedChipText
                            ]}>{type}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Furnishing */}
                <Text style={[styles.sectionTitle, { color: t.title }]}>Furnishing Status</Text>
                <View style={styles.chipRow}>
                    {FURNISHING_OPTIONS.map(opt => (
                        <TouchableOpacity
                            key={opt}
                            onPress={() => setSelectedFurnishing(opt)}
                            style={[
                                styles.chip,
                                { backgroundColor: t.cardBg, borderColor: t.chipBorder },
                                selectedFurnishing === opt && styles.selectedChip
                            ]}
                        >
                            <Text style={[
                                styles.chipText,
                                { color: t.title },
                                selectedFurnishing === opt && styles.selectedChipText
                            ]}>{opt}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Amenities */}
                <Text style={[styles.sectionTitle, { color: t.title }]}>Amenities</Text>
                <View style={styles.chipRow}>
                    {AMENITIES.map(amenity => {
                        const isSel = selectedAmenities.includes(amenity);
                        return (
                            <TouchableOpacity
                                key={amenity}
                                onPress={() => toggleAmenity(amenity)}
                                style={[
                                    styles.chip,
                                    { backgroundColor: t.cardBg, borderColor: t.chipBorder },
                                    isSel && styles.selectedChip
                                ]}
                            >
                                <Text style={[
                                    styles.chipText,
                                    { color: t.title },
                                    isSel && styles.selectedChipText
                                ]}>{amenity}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: t.divider }]}>
                <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
                    <Text style={styles.applyBtnText}>Apply Filters</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 16, paddingTop: 40, // More padding for Dynamic Island/Notch
        borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    headerTitle: { fontSize: 18, fontWeight: '800' },
    closeBtn: { padding: 10 },
    resetText: { fontSize: 14, fontWeight: '600' },
    scrollContent: { padding: 20, paddingBottom: 100 },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 24, marginBottom: 14 },
    priceInputRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    priceInputBox: { flex: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1 },
    inputLabel: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
    priceInput: { fontSize: 16, fontWeight: '700', padding: 0 },
    priceDash: { width: 10, height: 2, backgroundColor: '#8f92a1', opacity: 0.3 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: {
        paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1,
    },
    selectedChip: { backgroundColor: '#0C886B', borderColor: '#0C886B' },
    chipText: { fontSize: 13, fontWeight: '500' },
    selectedChipText: { color: '#fff' },
    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: 20, paddingBottom: 34, borderTopWidth: 1,
    },
    applyBtn: {
        backgroundColor: '#0C886B', height: 56, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
    },
    applyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
