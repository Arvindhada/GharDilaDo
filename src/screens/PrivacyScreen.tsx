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
                <View style={styles.contentWrap}>
                    <Text style={[styles.introText, { color: t.title }]}>
                        Last Updated: March 10, 2026
                    </Text>
                    <Text style={[styles.introDesc, { color: t.muted }]}>
                        Your privacy is important to us. This Privacy Policy explains how GharDilado collects, uses, and protects your information when you use our mobile application.
                    </Text>

                    {[
                        {
                            title: '1. Information We Collect',
                            body: 'We collect information you provide directly to us, such as your name, phone number, and property details when you list a property. We also collect usage data to improve your experience.'
                        },
                        {
                            title: '2. How We Use Your Data',
                            body: 'Your data is used to connect seekers with owners/brokers. We use your phone number to facilitate WhatsApp and Call integrations. We do not sell your personal data to third parties.'
                        },
                        {
                            title: '3. Data Security',
                            body: 'We implement industry-standard security measures to protect your information from unauthorized access. However, no method of transmission over the internet is 100% secure.'
                        },
                        {
                            title: '4. Communication',
                            body: 'By using GharDilado, you agree to receive essential notifications and communication related to your property listings or account status.'
                        },
                        {
                            title: '5. Contact Us',
                            body: 'If you have any questions about this Privacy Policy, please contact us at support@ghardilado.com'
                        }
                    ].map((section, i) => (
                        <View key={i} style={styles.sectionWrap}>
                            <Text style={[styles.secTitle, { color: t.title }]}>{section.title}</Text>
                            <Text style={[styles.secBody, { color: t.muted }]}>{section.body}</Text>
                        </View>
                    ))}

                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: t.muted }]}>
                            © 2026 GharDilado. All Rights Reserved.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12 },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', marginLeft: 8 },
    scrollContent: { padding: 20, paddingBottom: 100 },
    contentWrap: { gap: 24 },
    introText: { fontSize: 13, fontWeight: '700', opacity: 0.6 },
    introDesc: { fontSize: 15, lineHeight: 22 },
    sectionWrap: { gap: 8 },
    secTitle: { fontSize: 16, fontWeight: '800' },
    secBody: { fontSize: 14, lineHeight: 22, opacity: 0.8 },
    footer: { marginTop: 20, alignItems: 'center', paddingVertical: 20, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
    footerText: { fontSize: 12, fontWeight: '600' },
});
