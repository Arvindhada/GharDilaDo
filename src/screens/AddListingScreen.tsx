import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar, ScrollView, Platform, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Building2, Home, TreePine, Layers, Store } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/useAppStore';
import { LOCALITIES, PropertyType, Property, FurnishingType } from '../data/properties';
import Toast from '../components/Toast';

const PROPERTY_TYPES = [
    { label: 'Flat', icon: Building2 },
    { label: 'House', icon: Home },
    { label: 'Villa', icon: TreePine },
    { label: 'Floor', icon: Layers },
    { label: 'Shop', icon: Store }
];

const BHK_OPTIONS = ['1 RK', '1 BHK', '2 BHK', '3 BHK', '4+', 'N/A'];

export default function AddListingScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { propertyId } = route.params || {};
    const { t } = useAppTheme();
    const insets = useSafeAreaInsets();
    const userRole = useAppStore(state => state.userRole);
    const userListings = useAppStore(state => state.userListings);
    const name = useAppStore(state => state.name);
    const addUserListing = useAppStore(state => state.addUserListing);

    // Form State
    const [title, setTitle] = useState('');
    const [type, setType] = useState<PropertyType>('Flat');
    const [bhk, setBhk] = useState('2 BHK');
    const [area, setArea] = useState('');
    const [rent, setRent] = useState('');
    const [brokerage, setBrokerage] = useState('');
    const [locality, setLocality] = useState('');
    const [city, setCity] = useState('Gandhinagar');
    const [deposit, setDeposit] = useState('');
    const [furnishing, setFurnishing] = useState<FurnishingType>('Semi-Furnished');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredSuggestions = LOCALITIES.filter(l =>
        l.toLowerCase().includes(locality.toLowerCase()) &&
        l.toLowerCase() !== locality.toLowerCase()
    ).slice(0, 5);

    // Load data for Editing
    React.useEffect(() => {
        if (propertyId) {
            const prop = userListings.find(p => p.id === propertyId);
            if (prop) {
                setTitle(prop.title);
                setType(prop.type);
                setBhk(prop.bhk.toString() + (prop.bhk > 1 ? ' BHK' : ' RK')); // Simple conversion
                setArea(prop.area.toString());
                setRent(prop.rent.toString());
                setLocality(prop.locality);
                setCity(prop.city || 'Gandhinagar');
                setDeposit(prop.deposit.toString());
                if (prop.brokerage) setBrokerage(prop.brokerage);
            }
        }
    }, [propertyId, userListings]);

    const formatInput = (text: string) => {
        return text.replace(/\b\w/g, char => char.toUpperCase());
    };

    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const showMessage = (msg: string, type: 'success' | 'error') => {
        setToastMsg(msg);
        setToastType(type);
        setShowToast(true);
    };

    const handleSave = () => {
        // Validation
        if (!title.trim() || title.length < 10) {
            showMessage(title.trim() ? "Title should be at least 10 chars long" : "Please enter a Property Title", 'error');
            return;
        }
        if (!rent || isNaN(parseInt(rent)) || parseInt(rent) <= 0) {
            showMessage("Please enter a valid Rent amount", 'error');
            return;
        }
        if (!locality.trim()) {
            showMessage("Please select or enter a Locality", 'error');
            return;
        }
        if (!area || isNaN(parseInt(area)) || parseInt(area) <= 0) {
            showMessage("Please enter a valid Area in sqft", 'error');
            return;
        }
        if (userRole === 'broker' && (!brokerage || isNaN(parseInt(brokerage)))) {
            showMessage("Please enter valid Brokerage charges", 'error');
            return;
        }

        const newProp: Property = {
            id: Math.random().toString(36).substr(2, 9),
            title: formatInput(title),
            type: type as PropertyType,
            locality: formatInput(locality),
            sector: '', // Default empty
            city: formatInput(city),
            rent: parseInt(rent),
            deposit: parseInt(deposit) || 0,
            bhk: parseInt(bhk) || 0,
            bathrooms: 2, // Default
            area: parseInt(area),
            floor: 2, // Default
            totalFloors: 5, // Default
            furnishing: furnishing,
            available: true,
            availableFrom: new Date().toISOString().split('T')[0],
            postedBy: name,
            postedByRole: userRole as any,
            phone: '+91 93514 71243', // Default support phone if not profile
            images: [],
            amenities: ['Parking', 'Water 24x7', 'Security'], // Default basics
            description: `Beautiful ${bhk} ${type} in ${locality}. Ready to move in.`,
            isVerified: false,
            isFeatured: false,
            isSaved: false,
            rating: 0,
            reviews: 0,
            postedDate: new Date().toISOString().split('T')[0],
            brokerage: userRole === 'broker' ? brokerage : '',
        };

        addUserListing(newProp);
        showMessage("Listing created! Moving to photos... ✨", 'success');
        setTimeout(() => {
            (navigation as any).navigate('AddListingMedia', { propertyId: newProp.id });
        }, 1500);
    };

    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <Toast
                visible={showToast}
                message={toastMsg}
                type={toastType}
                onHide={() => setShowToast(false)}
            />
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                {userRole === 'seeker' && ( // Should rarely hit, but just in case
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <ChevronLeft size={24} color={t.title} />
                    </TouchableOpacity>
                )}
                <Text style={[styles.headerTitle, { color: t.title, marginLeft: userRole === 'seeker' ? 8 : 16 }]}>
                    Add Property Details
                </Text>
            </View>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid
                extraScrollHeight={20}
            >

                {/* Property Type Selector */}
                <Text style={[styles.label, { color: t.title }]}>Property Type</Text>
                <View style={styles.typeRow}>
                    {PROPERTY_TYPES.map((pt) => {
                        const Icon = pt.icon;
                        const isSelected = type === pt.label;
                        return (
                            <TouchableOpacity
                                key={pt.label}
                                style={[styles.typeBox, { backgroundColor: isSelected ? '#0C886B' : t.cardBg }]}
                                onPress={() => setType(pt.label as PropertyType)}
                            >
                                <Icon size={20} color={isSelected ? '#fff' : t.muted} strokeWidth={isSelected ? 2 : 1.5} />
                                <Text style={[styles.typeText, { color: isSelected ? '#fff' : t.title }]}>{pt.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* BHK Selector */}
                {type !== 'Shop' && (
                    <>
                        <Text style={[styles.label, { color: t.title, marginTop: 10 }]}>Bedroom configuration</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                            {BHK_OPTIONS.map((opt) => (
                                <TouchableOpacity
                                    key={opt}
                                    style={[styles.chip, { backgroundColor: bhk === opt ? '#0C886B' : t.cardBg }]}
                                    onPress={() => setBhk(opt)}
                                >
                                    <Text style={[styles.chipText, { color: bhk === opt ? '#fff' : t.title }]}>{opt}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </>
                )}

                <Text style={[styles.label, { color: t.title, marginTop: 10 }]}>Property Title / Header</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: t.cardBg, color: t.title }]}
                    placeholder="e.g. 2 BHK Flat in Sargasan"
                    placeholderTextColor={t.muted}
                    value={title}
                    onChangeText={setTitle}
                />
                <Text style={[styles.label, { color: t.title }]}>City</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: t.cardBg, color: t.title }]}
                    placeholder="e.g. Gandhinagar"
                    placeholderTextColor={t.muted}
                    value={city}
                    onChangeText={setCity}
                />

                <Text style={[styles.label, { color: t.title }]}>Locality / Sector area</Text>
                <View style={{ zIndex: 100 }}>
                    <TextInput
                        style={[styles.input, { backgroundColor: t.cardBg, color: t.title }]}
                        placeholder="e.g. Sargasan"
                        placeholderTextColor={t.muted}
                        value={locality}
                        onChangeText={(txt) => {
                            setLocality(txt);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                    />
                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <View style={[styles.suggestionsContainer, { backgroundColor: t.cardBg, borderColor: t.divider }]}>
                            {filteredSuggestions.map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={styles.suggestionItem}
                                    onPress={() => {
                                        setLocality(item);
                                        setShowSuggestions(false);
                                    }}
                                >
                                    <Building2 size={14} color={t.muted} />
                                    <Text style={[styles.suggestionText, { color: t.title }]}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.row}>
                    <View style={styles.flexHalf}>
                        <Text style={[styles.label, { color: t.title }]}>Super Built-up Area</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: t.cardBg, color: t.title }]}
                            placeholder="e.g. 1200"
                            placeholderTextColor={t.muted}
                            keyboardType="number-pad"
                            value={area}
                            onChangeText={setArea}
                        />
                    </View>
                    <View style={styles.flexHalf}>
                        <Text style={[styles.label, { color: t.title }]}>Monthly Rent (₹)</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: t.cardBg, color: t.title }]}
                            placeholder="e.g. 14000"
                            placeholderTextColor={t.muted}
                            keyboardType="number-pad"
                            value={rent}
                            onChangeText={(text) => {
                                setRent(text);
                                // Auto-fill deposit with 3x rent if empty
                                if (!deposit && text) {
                                    setDeposit((parseInt(text) * 3).toString());
                                }
                            }}
                        />
                    </View>
                </View>

                <Text style={[styles.label, { color: t.title }]}>Security Deposit (₹)</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: t.cardBg, color: t.title }]}
                    placeholder="e.g. 42000"
                    placeholderTextColor={t.muted}
                    keyboardType="number-pad"
                    value={deposit}
                    onChangeText={setDeposit}
                />

                {userRole === 'broker' && (
                    <View style={{ marginTop: 12 }}>
                        <Text style={[styles.label, { color: t.title }]}>Brokerage Charge (₹)</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: t.cardBg, color: t.title }]}
                            placeholder="e.g. 15 Days Rent or Amount"
                            placeholderTextColor={t.muted}
                            value={brokerage}
                            onChangeText={setBrokerage}
                        />
                    </View>
                )}

                {/* Broker Client Info Logic placeholder could go here */}

                <TouchableOpacity style={styles.submitBtn} onPress={handleSave}>
                    <Text style={styles.submitText}>Next Step: Media & Amenities</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { flex: 1, fontSize: 22, fontWeight: '800' },
    label: { fontSize: 13, fontWeight: '700', marginBottom: 6, letterSpacing: -0.2 },
    input: { height: 54, borderRadius: 14, paddingHorizontal: 16, fontSize: 15, fontWeight: '500' },
    submitBtn: { height: 58, backgroundColor: '#0C886B', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 24, marginBottom: 40 },
    submitText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
    scrollContent: { padding: 20, gap: 16 },
    typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    typeBox: { width: '31%', height: 75, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 6 },
    typeText: { fontSize: 12, fontWeight: '600' },
    chip: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
    chipText: { fontSize: 14, fontWeight: '600' },
    row: { flexDirection: 'row', gap: 14 },
    flexHalf: { flex: 1 },
    suggestionsContainer: {
        position: 'absolute',
        top: 56,
        left: 0,
        right: 0,
        borderRadius: 12,
        borderWidth: 1,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 1000,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        gap: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    suggestionText: {
        fontSize: 14,
        fontWeight: '500',
    },
});
