import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';

export default function HelpScreen() {
    const navigation = useNavigation();
    const { t } = useAppTheme();
    const faqs = [
        { q: 'How do I search for a property?', a: 'Use the Search tab or filter by locality on the Home screen.' },
        { q: 'How do I contact an owner?', a: 'Open a property and tap Call Owner or WhatsApp button.' },
        { q: 'Is GharDilado free to use?', a: 'Yes, searching and contacting owners is completely free.' },
        { q: 'How do I list my property?', a: 'Register as Owner or Broker and tap Post Your Property.' },
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
            <View style={styles.content}>
                {faqs.map((faq, i) => (
                    <View key={i} style={[styles.faqCard, { backgroundColor: t.cardBg }]}>
                        <Text style={[styles.question, { color: t.title }]}>{faq.q}</Text>
                        <Text style={[styles.answer, { color: t.muted }]}>{faq.a}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12 },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', marginLeft: 8 },
    faqCard: { borderRadius: 14, padding: 16 },
    question: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
    answer: { fontSize: 13, lineHeight: 20 },
    content: { padding: 16, gap: 12 },
});
