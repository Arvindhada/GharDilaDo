import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, User, Phone } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/useAppStore';

export default function EditProfileScreen() {
    const navigation = useNavigation<any>();
    const { t } = useAppTheme();
    const storedName = useAppStore(state => state.name);
    const storedPhone = useAppStore(state => state.phone);
    const updateProfile = useAppStore(state => state.updateProfile);

    const [name, setName] = useState(storedName);
    const [phone, setPhone] = useState(storedPhone);
    const insets = useSafeAreaInsets();

    const handleSave = () => {
        updateProfile(name, phone);
        navigation.goBack();
    };

    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: t.cardBg }]}>
                    <ChevronLeft size={22} color={t.title} strokeWidth={2.5} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: t.title }]}>Edit Profile</Text>
            </View>

            <KeyboardAwareScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid
                extraScrollHeight={20}
            >
                {/* Avatar Preview */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{name ? name.charAt(0).toUpperCase() : 'U'}</Text>
                    </View>
                    <Text style={[styles.avatarHint, { color: t.muted }]}>Your profile photo</Text>
                </View>

                {/* Form Elements */}
                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: t.title }]}>Full Name</Text>
                    <View style={[styles.inputBox, { backgroundColor: t.cardBg }]}>
                        <User size={20} color={t.muted} />
                        <TextInput
                            style={[styles.input, { color: t.title }]}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                            placeholderTextColor={t.muted}
                        />
                    </View>
                </View>

                <View style={styles.formGroup}>
                    <Text style={[styles.label, { color: t.title }]}>Phone Number</Text>
                    <View style={[styles.inputBox, { backgroundColor: t.cardBg }]}>
                        <Phone size={20} color={t.muted} />
                        <TextInput
                            style={[styles.input, { color: t.title }]}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Enter mobile number"
                            placeholderTextColor={t.muted}
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>
            </KeyboardAwareScrollView>

            {/* Save Button Floor */}
            <View style={[styles.floor, { backgroundColor: t.bg, borderTopColor: t.divider }]}>
                <TouchableOpacity
                    style={[styles.saveBtn, (!name.trim() || !phone.trim()) && styles.saveBtnDisabled]}
                    onPress={handleSave}
                    disabled={!name.trim() || !phone.trim()}
                >
                    <Text style={styles.saveText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16,
    },
    backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
    content: { padding: 20, paddingBottom: 100 },
    avatarSection: { alignItems: 'center', marginBottom: 32 },
    avatar: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: '#0C886B', alignItems: 'center', justifyContent: 'center',
        marginBottom: 12, shadowColor: '#0C886B', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25, shadowRadius: 16, elevation: 8
    },
    avatarText: { color: '#fff', fontSize: 40, fontWeight: '800' },
    avatarHint: { fontSize: 13 },
    formGroup: { marginBottom: 24 },
    label: { fontSize: 14, fontWeight: '700', marginBottom: 8, paddingLeft: 4 },
    inputBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 56, borderRadius: 16, gap: 12 },
    input: { flex: 1, fontSize: 16, fontWeight: '500' },
    floor: {
        padding: 20, paddingBottom: 34,
        borderTopWidth: 1, position: 'absolute', bottom: 0, left: 0, right: 0
    },
    saveBtn: {
        backgroundColor: '#0C886B', height: 56, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#0C886B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4
    },
    saveBtnDisabled: { opacity: 0.5 },
    saveText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
});
