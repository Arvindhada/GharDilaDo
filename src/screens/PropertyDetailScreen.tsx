import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    Image, Dimensions, Linking, StatusBar, Share
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { ChevronLeft, Heart, Share2, MapPin, Star, Phone, MessageCircle, CheckCircle, BedDouble, Bath, Maximize2, Building2 } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/useAppStore';
import { ApiService } from '../services/apiService';
import { mockProperties, formatRent, type Property } from '../data/properties';

const { width } = Dimensions.get('window');
type Nav = NativeStackNavigationProp<RootStackParamList, 'PropertyDetail'>;
type Route = RouteProp<RootStackParamList, 'PropertyDetail'>;

export default function PropertyDetailScreen() {
    const navigation = useNavigation<Nav>();
    const route = useRoute<Route>();
    const { propertyId } = route.params;
    const { t } = useAppTheme();
    const { savedIds, toggleSave } = useAppStore();

    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);

    const isSaved = savedIds.includes(propertyId);

    React.useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await ApiService.getPropertyById(propertyId);
            setProperty(data);
            setLoading(false);
        };
        load();
    }, [propertyId]);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this property: ${property?.title} in ${property?.locality}. Download Ghardilado App now!`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: t.bg, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: t.muted }}>Loading property details...</Text>
            </View>
        );
    }

    if (!property) {
        return (
            <View style={[styles.container, { backgroundColor: t.bg, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: t.title, fontSize: 18, fontWeight: '700' }}>Property not found</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 20 }}>
                    <Text style={{ color: '#0C886B', fontWeight: '600' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Gallery */}
                <View style={styles.imgSection}>
                    <ScrollView
                        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
                        onScroll={e => setActiveImg(Math.round(e.nativeEvent.contentOffset.x / width))}
                        scrollEventThrottle={16}
                    >
                        {property.images.map((img, i) => (
                            <Image key={i} source={{ uri: img }} style={styles.mainImg} />
                        ))}
                    </ScrollView>
                    {/* Back Button */}
                    <View style={styles.imgOverlay}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backCircle}>
                            <ChevronLeft size={22} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity onPress={handleShare} style={styles.iconCircle}>
                                <Share2 size={18} color="#fff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => toggleSave(property.id)} style={styles.iconCircle}>
                                <Heart size={18} color={isSaved ? '#0C886B' : '#fff'} fill={isSaved ? '#0C886B' : 'transparent'} strokeWidth={2.5} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Image dots */}
                    <View style={styles.imgDots}>
                        {property.images.map((_, i) => (
                            <View key={i} style={[styles.imgDot, i === activeImg && styles.imgDotActive]} />
                        ))}
                    </View>
                </View>

                {/* Content */}
                <View style={[styles.contentBox, { backgroundColor: t.bg }]}>
                    {/* Title & Rating */}
                    <View style={styles.titleRow}>
                        <Text style={[styles.title, { color: t.title }]} numberOfLines={2}>{property.title}</Text>
                        <View style={styles.ratingChip}>
                            <Star size={13} color="#0C886B" fill="#0C886B" />
                            <Text style={styles.ratingText}>{property.rating.toFixed(1)}</Text>
                            <Text style={[styles.reviewsText, { color: t.muted }]}>({property.reviews})</Text>
                        </View>
                    </View>

                    <View style={styles.locationRow}>
                        <MapPin size={13} color="#0C886B" strokeWidth={2} />
                        <Text style={[styles.metaText, { color: t.muted }]}>{property.locality}, Gandhinagar, Gujarat</Text>
                    </View>

                    {/* Price */}
                    <View style={[styles.priceCard, { backgroundColor: t.cardBg }]}>
                        <View>
                            <Text style={[styles.priceLabel, { color: t.muted }]}>Monthly Rent</Text>
                            <Text style={styles.priceValue}>
                                ₹{property.rent.toLocaleString('en-IN')}
                                <Text style={[styles.perMonth, { color: t.muted }]}>/month</Text>
                            </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={[styles.priceLabel, { color: t.muted }]}>Security Deposit</Text>
                            <Text style={[styles.depositValue, { color: t.title }]}>
                                ₹{property.deposit.toLocaleString('en-IN')}
                            </Text>
                        </View>
                    </View>

                    {/* Spec Pills */}
                    <View style={styles.specRow}>
                        <View style={[styles.specPill, { backgroundColor: '#E4F3EF' }]}>
                            <BedDouble size={18} color="#0C886B" strokeWidth={1.8} />
                            <Text style={styles.specValue}>{property.bhk}</Text>
                            <Text style={styles.specLabel}>Bedrooms</Text>
                        </View>
                        <View style={[styles.specPill, { backgroundColor: '#e9e1ff' }]}>
                            <Bath size={18} color="#6c5dd3" strokeWidth={1.8} />
                            <Text style={styles.specValue}>{property.bathrooms}</Text>
                            <Text style={styles.specLabel}>Bathrooms</Text>
                        </View>
                        <View style={[styles.specPill, { backgroundColor: '#d8f5ed' }]}>
                            <Maximize2 size={18} color="#0fba81" strokeWidth={1.8} />
                            <Text style={styles.specValue}>{property.area}</Text>
                            <Text style={styles.specLabel}>Sq. Ft.</Text>
                        </View>
                        <View style={[styles.specPill, { backgroundColor: '#fff5d8' }]}>
                            <Building2 size={18} color="#f4a92f" strokeWidth={1.8} />
                            <Text style={styles.specValue}>{property.floor}/{property.totalFloors}</Text>
                            <Text style={styles.specLabel}>Floor</Text>
                        </View>
                    </View>

                    {/* Amenities */}
                    <Text style={[styles.sectionTitle, { color: t.title }]}>Amenities</Text>
                    <View style={styles.amenitiesWrap}>
                        {property.amenities.map(a => (
                            <View key={a} style={[styles.amenityChip, { backgroundColor: t.cardBg, borderColor: t.chipBorder }]}>
                                <Text style={[styles.amenityText, { color: t.chipText }]}>{a}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Description */}
                    <Text style={[styles.sectionTitle, { color: t.title }]}>Description</Text>
                    <Text style={[styles.desc, { color: t.muted }]}>{property.description}</Text>

                    {/* Posted By */}
                    <View style={[styles.postedByCard, { backgroundColor: t.innerCardBg }]}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {(property.brokerName || property.ownerName || 'U')[0].toUpperCase()}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.postedByName, { color: t.title }]}>
                                {property.brokerName || property.ownerName}
                            </Text>
                            <Text style={[styles.postedByRole, { color: t.muted }]}>
                                {property.postedByRole === 'broker' ? '🤝 Professional Broker' : '🏠 Direct Owner'}
                            </Text>
                        </View>
                        <View style={styles.verifiedTag}>
                            <CheckCircle size={14} color="#0C886B" fill="#E4F3EF" />
                            <Text style={styles.verifiedTagText}>Verified</Text>
                        </View>
                    </View>

                    <View style={styles.bottomSpace} />
                </View>
            </ScrollView>

            {/* CTA Buttons */}
            <View style={[styles.ctaBar, { backgroundColor: t.bg, borderTopColor: t.divider }]}>
                <TouchableOpacity
                    style={[styles.ctaBtn, styles.ctaSecondary]}
                    onPress={() => Linking.openURL(`https://wa.me/${property.phone.replace(/\D/g, '')}`)}
                >
                    <MessageCircle size={18} color="#0C886B" strokeWidth={2} />
                    <Text style={styles.ctaSecondaryText}>WhatsApp</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.ctaBtn, styles.ctaPrimary]}
                    onPress={() => Linking.openURL(`tel:${property.phone}`)}
                >
                    <Phone size={18} color="#fff" strokeWidth={2} />
                    <Text style={styles.ctaPrimaryText}>Call Owner</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    imgSection: { height: 310, position: 'relative' },
    mainImg: { width, height: 310 },
    imgOverlay: {
        position: 'absolute', top: 0, left: 0, right: 0,
        flexDirection: 'row', justifyContent: 'space-between',
        padding: 20, paddingTop: 52,
    },
    backCircle: {
        width: 42, height: 42, borderRadius: 21,
        backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
    },
    iconCircle: {
        width: 42, height: 42, borderRadius: 21,
        backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
    },
    imgDots: {
        position: 'absolute', bottom: 16, left: 0, right: 0,
        flexDirection: 'row', justifyContent: 'center', gap: 6,
    },
    imgDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.6)' },
    imgDotActive: { width: 22, backgroundColor: '#0C886B' },
    contentBox: { borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -32, paddingHorizontal: 22, paddingTop: 26, paddingBottom: 20 },
    titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 },
    title: { fontSize: 22, fontWeight: '800', letterSpacing: -0.6, lineHeight: 28, flex: 1, paddingRight: 15 },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 18 },
    metaText: { fontSize: 13, flex: 1 },
    ratingChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E4F3EF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    ratingText: { color: '#0C886B', fontSize: 13, fontWeight: '700' },
    reviewsText: { fontSize: 11, color: '#0C886B', opacity: 0.7 },
    priceCard: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        borderRadius: 20, paddingHorizontal: 20, paddingVertical: 18, marginBottom: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
    },
    priceLabel: { fontSize: 12, marginBottom: 4, fontWeight: '500' },
    priceValue: { color: '#0C886B', fontSize: 24, fontWeight: '800', letterSpacing: -0.8 },
    perMonth: { fontSize: 14, fontWeight: '400' },
    depositValue: { fontSize: 18, fontWeight: '700', letterSpacing: -0.4 },
    specRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
    specPill: {
        flex: 1, borderRadius: 18, paddingVertical: 14,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 1,
    },
    specValue: { fontSize: 15, fontWeight: '800', color: '#1b1d21', marginTop: 4 },
    specLabel: { fontSize: 11, color: '#8f92a1', marginTop: 1 },
    sectionTitle: { fontSize: 17, fontWeight: '800', marginBottom: 14, letterSpacing: -0.3 },
    amenitiesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
    amenityChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, borderWidth: 1 },
    amenityText: { fontSize: 12, fontWeight: '600' },
    desc: { fontSize: 14, lineHeight: 22, marginBottom: 24, opacity: 0.9 },
    postedByCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 20, padding: 16, marginBottom: 10 },
    avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#0C886B', alignItems: 'center', justifyContent: 'center' },
    avatarText: { color: '#fff', fontSize: 22, fontWeight: '800' },
    postedByName: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
    postedByRole: { fontSize: 12, marginTop: 2, opacity: 0.8 },
    verifiedTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E4F3EF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
    verifiedTagText: { color: '#0C886B', fontSize: 11, fontWeight: '700' },
    ctaBar: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row', gap: 12, paddingHorizontal: 22, paddingBottom: 24, paddingTop: 16,
        borderTopWidth: 1, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10,
    },
    ctaBtn: { flex: 1, height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    ctaPrimary: { backgroundColor: '#0C886B' },
    ctaSecondary: { backgroundColor: '#25D366' },
    ctaPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    ctaSecondaryText: { color: '#fff', fontSize: 15, fontWeight: '700' },
    bottomSpace: { height: 120 },
});
