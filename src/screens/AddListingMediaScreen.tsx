import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, ImagePlus, Check, X, Camera, Plus } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAppTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/useAppStore';
import { Property, ImageCategory } from '../data/properties';

const AMENITIES_LIST = [
    'WiFi', 'Parking', 'Gym', 'Pool', 'Security', 'Lift', 'AC', 'Power Backup', 'Gas Pipeline', 'Club House'
];

export default function AddListingMediaScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { propertyId } = route.params || {};

    const { t } = useAppTheme();
    const userRole = useAppStore(state => state.userRole);
    const name = useAppStore(state => state.name);
    const phone = useAppStore(state => state.phone);
    const addUserListing = useAppStore(state => state.addUserListing);
    const updateUserListing = useAppStore(state => state.updateUserListing);
    const userListings = useAppStore(state => state.userListings);

    // Fetch the property from store using ID
    const currentProperty = userListings.find(p => p.id === propertyId);

    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    const [categorizedImages, setCategorizedImages] = useState<{ [key in ImageCategory]?: string[] }>({
        'Bedroom': [],
        'Kitchen': [],
        'Bathroom': [],
        'Living Room': [],
        'Other': [],
    });

    const categories: ImageCategory[] = ['Bedroom', 'Kitchen', 'Bathroom', 'Living Room', 'Other'];

    React.useEffect(() => {
        if (propertyId) {
            const existing = userListings.find(p => p.id === propertyId);
            if (existing) {
                setSelectedAmenities(existing.amenities || []);
                if (existing.categorizedImages) {
                    setCategorizedImages(existing.categorizedImages);
                }
            }
        }
    }, [route.params?.propertyId]);

    const pickImage = async (category: ImageCategory) => {
        console.log(`[DEBUG] Opening picker for category: ${category}`);
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                selectionLimit: 0, // Multiple images
                quality: 0.8,
            });

            if (result.didCancel) {
                console.log(`[DEBUG] Picker cancelled by user`);
                return;
            }
            if (result.errorCode) {
                console.error(`[DEBUG] Picker Error: ${result.errorMessage}`);
                Alert.alert("Picker Error", result.errorMessage);
                return;
            }

            if (result.assets) {
                console.log(`[DEBUG] Selected ${result.assets.length} images`);
                const newUris = result.assets.map(asset => asset.uri).filter(Boolean) as string[];
                setCategorizedImages((prev: any) => ({
                    ...prev,
                    [category]: [...(prev[category] || []), ...newUris]
                }));
            }
        } catch (err) {
            console.error(`[DEBUG] Unexpected Error:`, err);
            Alert.alert("Error", "The image picker could not be opened. Please ensure you have rebuilt the app (npx react-native run-android).");
        }
    };

    const removeImage = (category: ImageCategory, uri: string) => {
        setCategorizedImages((prev: any) => ({
            ...prev,
            [category]: prev[category]?.filter((u: string) => u !== uri)
        }));
    };

    const toggleAmenity = (item: string) => {
        if (selectedAmenities.includes(item)) {
            setSelectedAmenities((prev: string[]) => prev.filter((a: string) => a !== item));
        } else {
            setSelectedAmenities((prev: string[]) => [...prev, item]);
        }
    };

    const handlePublish = () => {
        if (!currentProperty) {
            Alert.alert("Error", "Property data from the previous step is missing. Please go back and fill in the property details first.");
            return;
        }

        // Collect all images for flat array compatibility
        const allImages = Object.values(categorizedImages).flat();
        
        // Remove empty strings
        const finalAmenities = selectedAmenities;

        // Both EDIT MODE and NEW ADD MODE now only update the existing listing, 
        // as the property was already persisted to the store in the previous step (AddListingScreen).
        updateUserListing(currentProperty.id, {
            ...currentProperty, // Use currentProperty for existing data
            amenities: finalAmenities,
            images: allImages.length > 0 ? allImages : currentProperty.images, // Fallback to existing if none selected
            categorizedImages: categorizedImages,
        });

        Alert.alert(
            "Success",
            "Your property is now live!",
            [
                {
                    text: "Go to Dashboard",
                    onPress: () => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'MainTabs' }],
                        });
                        setTimeout(() => navigation.navigate('MainTabs', { screen: 'Dashboard' }), 100);
                    }
                }
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={t.title} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: t.title }]}>
                    Photos & Amenities
                </Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Photo Upload System */}
                <Text style={[styles.label, { color: t.title }]}>Categorized Photos</Text>
                <Text style={[styles.subLabel, { color: t.muted }]}>High quality photos of each room help seekers decide faster.</Text>

                {categories.map((cat) => (
                    <View key={cat} style={[styles.bucket, { backgroundColor: t.cardBg, borderColor: t.divider }]}>
                        <View style={styles.bucketHeader}>
                            <Text style={[styles.bucketTitle, { color: t.title }]}>{cat}</Text>
                            <TouchableOpacity
                                onPress={() => pickImage(cat)}
                                style={styles.addMoreBtn}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Plus size={16} color="#0C886B" />
                                <Text style={styles.addMoreText}>Upload</Text>
                            </TouchableOpacity>
                        </View>

                        {categorizedImages[cat] && categorizedImages[cat]!.length > 0 ? (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageScroll}>
                                {categorizedImages[cat]!.map((uri: string, idx: number) => (
                                    <View key={idx} style={styles.imageWrapper}>
                                        <Image source={{ uri }} style={styles.thumbnail} />
                                        <TouchableOpacity onPress={() => removeImage(cat, uri)} style={styles.removeBtn}>
                                            <X size={12} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                                <TouchableOpacity onPress={() => pickImage(cat)} style={styles.addImageMini}>
                                    <Camera size={20} color={t.muted} />
                                </TouchableOpacity>
                            </ScrollView>
                        ) : (
                            <TouchableOpacity onPress={() => pickImage(cat)} style={styles.emptyBucket}>
                                <ImagePlus size={24} color={t.muted} opacity={0.5} />
                                <Text style={[styles.emptyBucketText, { color: t.muted }]}>Select {cat} Photos</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                {/* Amenities Selection */}
                <Text style={[styles.label, { color: t.title, marginTop: 16 }]}>Select Amenities</Text>
                <View style={styles.amenitiesWrap}>
                    {AMENITIES_LIST.map((item) => {
                        const isSelected = selectedAmenities.includes(item);
                        return (
                            <TouchableOpacity
                                key={item}
                                style={[
                                    styles.amenityChip,
                                    {
                                        backgroundColor: isSelected ? '#0C886B' : t.cardBg,
                                        borderColor: isSelected ? '#0C886B' : t.divider,
                                    }
                                ]}
                                onPress={() => toggleAmenity(item)}
                            >
                                <Text style={[styles.amenityText, { color: isSelected ? '#fff' : t.title }]}>
                                    {isSelected && <Check size={12} color="#fff" style={{ marginRight: 4 }} />}
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Specifics based on role */}
                {userRole === 'broker' && (
                    <View style={[styles.warningBox, { backgroundColor: 'rgba(244, 169, 47, 0.1)' }]}>
                        <Text style={[styles.warningText, { color: '#f4a92f' }]}>
                            Note: As a broker, please ensure you have client consent before publishing.
                        </Text>
                    </View>
                )}

                <TouchableOpacity style={styles.submitBtn} onPress={handlePublish}>
                    <Text style={styles.submitText}>Publish Property</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingTop: 52, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { flex: 1, fontSize: 22, fontWeight: '800' },
    label: { fontSize: 13, fontWeight: '700', marginBottom: 12, letterSpacing: -0.2 },
    uploadBox: { borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', padding: 32, alignItems: 'center', justifyContent: 'center' },
    iconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(12, 136, 107, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    uploadText: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
    uploadSub: { fontSize: 12 },
    amenitiesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    amenityChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
    amenityText: { fontSize: 13, fontWeight: '600' },
    submitBtn: { height: 58, backgroundColor: '#0C886B', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 32, marginBottom: 40 },
    submitText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
    scrollContent: { padding: 20 },
    warningBox: { padding: 14, borderRadius: 12, marginTop: 24 },
    warningText: { fontSize: 12, fontWeight: '600', lineHeight: 18 },
    subLabel: { fontSize: 13, marginBottom: 16, marginTop: -8 },
    bucket: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 1 },
    bucketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    bucketTitle: { fontSize: 15, fontWeight: '700' },
    addMoreBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(12, 136, 107, 0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    addMoreText: { color: '#0C886B', fontSize: 12, fontWeight: '700' },
    imageScroll: { gap: 12, paddingRight: 10 },
    imageWrapper: { position: 'relative' },
    thumbnail: { width: 80, height: 80, borderRadius: 12 },
    removeBtn: { position: 'absolute', top: -4, right: -4, backgroundColor: '#ff4d4f', width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
    addImageMini: { width: 80, height: 80, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.03)', borderStyle: 'dashed', borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', alignItems: 'center', justifyContent: 'center' },
    emptyBucket: { height: 80, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.02)', borderStyle: 'dashed', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
    emptyBucketText: { fontSize: 13, fontWeight: '500' },
});
