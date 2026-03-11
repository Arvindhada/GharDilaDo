import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, ChevronDown, Phone, MessageSquare } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';

export default function HelpScreen() {
    const navigation = useNavigation<any>();
    const { t } = useAppTheme();
    const [expanded, setExpanded] = React.useState<number | null>(0);

    const faqs = [
        { q: 'How do I search for a property?', a: 'Use the Search tab or filter by locality on the Home screen. You can also use the filter icon in the search bar to narrow down by price, BHK, and furnishing.' },
        { q: 'How do I contact an owner?', a: 'Open any property detail screen and you will find "Call" and "WhatsApp" buttons at the bottom. Tapping them will directly open your dialer or WhatsApp.' },
        { q: 'Is GharDilado free to use?', a: 'Yes! Searching, saved listings, and contacting owners/brokers is completely free for seekers.' },
        { q: 'How do I list my property?', a: 'Go to your Profile, switch your role to "Owner" or "Broker". Then use the "Add Property" button in the bottom navigation tab.' },
        { q: 'I forgot my password, what now?', a: 'GharDilado uses OTP-based login for security. Simply enter your mobile number and verify it with the code sent to your SMS.' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color={t.title} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: t.title }]}>Help & Support</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.supportCard}>
                    <Text style={[styles.supportTitle, { color: t.title }]}>Need more help?</Text>
                    <Text style={[styles.supportDesc, { color: t.muted }]}>Our team is available 9 AM - 9 PM every day.</Text>
                    <View style={styles.supportActions}>
                        <TouchableOpacity style={[styles.supportBtn, { backgroundColor: '#0C886B' }]} onPress={() => Linking.openURL('tel:+919351471243')}>
                            <Phone size={18} color="#fff" />
                            <Text style={styles.supportBtnText}>Call Us</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.supportBtn, { backgroundColor: '#25D366' }]} onPress={() => Linking.openURL('whatsapp://send?phone=+919351471243&text=Hi GharDilado Support, I need help with...')}>
                            <MessageSquare size={18} color="#fff" />
                            <Text style={styles.supportBtnText}>WhatsApp</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={[styles.sectionTitle, { color: t.muted }]}>Frequently Asked Questions</Text>
                <View style={styles.faqList}>
                    {faqs.map((faq, i) => {
                        const isExpanded = expanded === i;
                        return (
                            <TouchableOpacity
                                key={i}
                                style={[styles.faqCard, { backgroundColor: t.cardBg }]}
                                onPress={() => setExpanded(isExpanded ? null : i)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.faqHeader}>
                                    <Text style={[styles.question, { color: t.title }]}>{faq.q}</Text>
                                    <ChevronDown size={18} color={t.muted} style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }} />
                                </View>
                                {isExpanded && (
                                    <Text style={[styles.answer, { color: t.muted }]}>{faq.a}</Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
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
    supportCard: { padding: 20, borderRadius: 24, backgroundColor: '#0C886B10', marginBottom: 24, borderWidth: 1, borderColor: '#0C886B20' },
    supportTitle: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
    supportDesc: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
    supportActions: { flexDirection: 'row', gap: 12 },
    supportBtn: { flex: 1, height: 48, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    supportBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
    sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, marginLeft: 4 },
    faqList: { gap: 12 },
    faqCard: { borderRadius: 18, padding: 16, overflow: 'hidden' },
    faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    question: { flex: 1, fontSize: 15, fontWeight: '700', marginRight: 10 },
    answer: { fontSize: 14, lineHeight: 22, marginTop: 12, opacity: 0.8 },
});
