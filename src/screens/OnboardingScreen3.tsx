import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Onboarding3'>;

export default function OnboardingScreen3() {
    const navigation = useNavigation<Nav>();
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#1b1d21" />
            <View style={styles.topSection}>
                <View style={styles.illustrationBox}>
                    <Text style={styles.emoji}>🤝</Text>
                </View>
                <Text style={styles.heading}>Connect with{'\n'}Owners & Brokers</Text>
                <Text style={styles.sub}>
                    Contact verified property owners and brokers directly. No middlemen, no hidden fees.
                </Text>
            </View>
            <View style={styles.bottomSection}>
                <View style={styles.dots}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={[styles.dot, styles.dotActive]} />
                </View>
                <TouchableOpacity style={styles.nextBtn} onPress={() => navigation.navigate('Welcome')}>
                    <Text style={styles.nextBtnText}>Get Started</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('MainTabs')}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1b1d21' },
    topSection: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
    illustrationBox: {
        width: 180, height: 180, borderRadius: 90,
        backgroundColor: 'rgba(12,136,107,0.15)',
        alignItems: 'center', justifyContent: 'center', marginBottom: 40,
    },
    emoji: { fontSize: 80 },
    heading: {
        fontSize: 36, fontWeight: '800', color: '#ffffff',
        textAlign: 'center', lineHeight: 44, marginBottom: 16,
    },
    sub: { fontSize: 15, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 22 },
    bottomSection: { paddingHorizontal: 32, paddingBottom: 48, alignItems: 'center' },
    dots: { flexDirection: 'row', gap: 8, marginBottom: 32 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
    dotActive: { width: 24, backgroundColor: '#0C886B' },
    nextBtn: {
        width: '100%', height: 56, backgroundColor: '#0C886B',
        borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    },
    nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    skipText: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
});
