import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import Skeleton from './Skeleton';

const { width } = Dimensions.get('window');

export default function PropertyCardSkeleton() {
    const { t } = useAppTheme();

    return (
        <View style={[styles.card, { backgroundColor: t.cardBg }]}>
            {/* Image Skeleton */}
            <Skeleton height={200} borderRadius={16} />

            <View style={styles.content}>
                {/* Badge Skeleton */}
                <Skeleton width={80} height={20} borderRadius={6} style={{ marginBottom: 12 }} />

                {/* Title Skeleton */}
                <Skeleton width="90%" height={24} borderRadius={4} style={{ marginBottom: 8 }} />

                {/* Location Skeleton */}
                <Skeleton width="60%" height={16} borderRadius={4} style={{ marginBottom: 16 }} />

                <View style={styles.footer}>
                    {/* Price Skeleton */}
                    <Skeleton width={100} height={28} borderRadius={4} />

                    {/* Meta Skeletons */}
                    <View style={styles.metaRow}>
                        <Skeleton width={40} height={16} borderRadius={4} />
                        <Skeleton width={40} height={16} borderRadius={4} />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: width - 40,
        borderRadius: 20,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    content: {
        padding: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 8,
    },
});
