import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';

export default function PrivacyScreen() {
    const navigation = useNavigation();
    const { t } = useAppTheme();
    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={t.title} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: t.title }]}>Privacy Policy</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {['Data Collection', 'How We Use Your Data', 'Data Sharing', 'Contact Us'].map((section, i) => (
                    <View key={i}>
                        <Text style={[styles.secTitle, { color: t.title }]}>{section}</Text>
                        <Text style={[styles.secBody, { color: t.muted }]}>
                            GharDilado collects minimal data required to provide our rental platform services. Your data is safe and never sold to third parties.
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12 },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', marginLeft: 8 },
    secTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
    secBody: { fontSize: 14, lineHeight: 22 },
    scrollContent: { padding: 20, gap: 16 },
});
