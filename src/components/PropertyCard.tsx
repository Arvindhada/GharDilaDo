import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Building2, Star, Heart } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/useAppStore';
import { type Property, formatRent } from '../data/properties';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PropertyCardProps {
    property: Property;
    onPress: () => void;
    variant?: 'vertical' | 'horizontal';
    fullWidth?: boolean;
}

export default function PropertyCard({ property: p, onPress, variant = 'vertical', fullWidth = false }: PropertyCardProps) {
    const { t } = useAppTheme();
    const savedIds = useAppStore(state => state.savedIds);
    const toggleSave = useAppStore(state => state.toggleSave);
    const isSaved = savedIds.includes(p?.id);

    // CRITICAL SAFETY CHECK: Prevent crash if property data is missing
    if (!p) return null;

    const mainImage = p.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image';

    if (variant === 'horizontal') {
        return (
            <TouchableOpacity
                style={[styles.row, { backgroundColor: t.innerCardBg }]}
                onPress={onPress}
                activeOpacity={0.85}
            >
                <Image source={{ uri: mainImage }} style={styles.rowImg} />
                <View style={styles.rowBody}>
                    <Text style={[styles.rowTitle, { color: t.title }]} numberOfLines={1}>{p.title}</Text>
                    <View style={styles.localityRow}>
                        <Building2 size={11} color={t.muted} strokeWidth={2} />
                        <Text style={[styles.rowLocality, { color: t.muted }]}>{p.locality}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.rowRent}>₹{p.rent.toLocaleString('en-IN')}/mo</Text>
                        <Text style={[styles.rowMeta, { color: t.muted }]}>{p.bhk} BHK</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => toggleSave(p.id)} style={styles.heartBtnInline}>
                    <Heart size={16} color={isSaved ? '#0C886B' : t.muted}
                        fill={isSaved ? '#0C886B' : 'none'} strokeWidth={2} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={[
                styles.card,
                { backgroundColor: t.innerCardBg },
                fullWidth && styles.cardFullWidth
            ]}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <View style={styles.imgWrap}>
                <Image source={{ uri: mainImage }} style={[styles.cardImg, fullWidth && styles.cardImgFull]} />
                <TouchableOpacity onPress={() => toggleSave(p.id)} style={styles.heartBtn}>
                    <Heart size={16} color={isSaved ? '#0C886B' : '#8f92a1'} fill={isSaved ? '#0C886B' : 'none'} strokeWidth={2} />
                </TouchableOpacity>
                {p.isVerified && (
                    <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓ Verified</Text>
                    </View>
                )}
            </View>
            <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
                    <View style={styles.ratingChip}>
                        <Star size={10} color="#0C886B" fill="#0C886B" />
                        <Text style={styles.ratingText}>{p.rating.toFixed(1)}</Text>
                    </View>
                    <Text style={[styles.bhkText, { color: t.muted }]}>{p.bhk} BHK · {p.type}</Text>
                </View>
                <Text style={[styles.cardTitle, { color: t.title }]} numberOfLines={1}>{p.title}</Text>
                <View style={styles.locRow}>
                    <Building2 size={11} color={t.muted} strokeWidth={2} />
                    <Text style={[styles.locText, { color: t.muted }]} numberOfLines={1}>{p.locality}, Gandhinagar</Text>
                </View>
                <View style={styles.cardFooter}>
                    <Text style={styles.rentText}>₹{formatRent(p.rent)}<Text style={styles.perMonth}>/mo</Text></Text>
                    <Text style={[styles.areaText, { color: t.muted }]}>{p.area} sqft</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    // Vertical Styles
    card: {
        width: 240,
        borderRadius: 20,
        marginRight: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    cardFullWidth: {
        width: '100%',
        marginRight: 0,
        marginBottom: 20,
    },
    imgWrap: { position: 'relative' },
    cardImg: { width: '100%', height: 150 },
    cardImgFull: { height: 180 },
    heartBtn: {
        position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 16,
        backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3,
    },
    verifiedBadge: {
        position: 'absolute', top: 10, left: 10,
        backgroundColor: '#0C886B', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
    },
    verifiedText: { color: '#fff', fontSize: 10, fontWeight: '700' },
    cardBody: { padding: 14 },
    cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
    ratingChip: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#E4F3EF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    ratingText: { color: '#0C886B', fontSize: 11, fontWeight: '700' },
    bhkText: { fontSize: 11, fontWeight: '500' },
    cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
    locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
    locText: { fontSize: 12, flex: 1 },
    cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    rentText: { color: '#0C886B', fontSize: 17, fontWeight: '800' },
    perMonth: { fontSize: 11, fontWeight: '400' },
    areaText: { fontSize: 12 },

    // Horizontal Styles
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, padding: 12 },
    rowImg: { width: 75, height: 75, borderRadius: 12 },
    rowBody: { flex: 1 },
    rowTitle: { fontSize: 14, fontWeight: '700' },
    rowLocality: { fontSize: 12 },
    rowRent: { color: '#0C886B', fontSize: 14, fontWeight: '800' },
    rowMeta: { fontSize: 12 },
    heartBtnInline: { padding: 4 },
    localityRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
});
