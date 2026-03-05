import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';

export default function AddListingScreen() {
    const navigation = useNavigation();
    const { t } = useAppTheme();
    const [title, setTitle] = useState('');
    const [rent, setRent] = useState('');
    const [locality, setLocality] = useState('');

    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={t.title} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: t.title }]}>Post Property</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.label, { color: t.title }]}>Property Title</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: t.cardBg, color: t.title }]}
                    placeholder="e.g. 2 BHK Flat in Sargasan"
                    placeholderTextColor={t.muted}
                    value={title}
                    onChangeText={setTitle}
                />
                <Text style={[styles.label, { color: t.title }]}>Monthly Rent (₹)</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: t.cardBg, color: t.title }]}
                    placeholder="e.g. 14000"
                    placeholderTextColor={t.muted}
                    keyboardType="number-pad"
                    value={rent}
                    onChangeText={setRent}
                />
                <Text style={[styles.label, { color: t.title }]}>Locality</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: t.cardBg, color: t.title }]}
                    placeholder="e.g. Sargasan"
                    placeholderTextColor={t.muted}
                    value={locality}
                    onChangeText={setLocality}
                />
                <TouchableOpacity style={styles.submitBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.submitText}>Post Listing</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12 },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', marginLeft: 8 },
    label: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
    input: { height: 52, borderRadius: 14, paddingHorizontal: 16, fontSize: 15 },
    submitBtn: { height: 56, backgroundColor: '#0C886B', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
    submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    scrollContent: { padding: 20, gap: 16 },
});
