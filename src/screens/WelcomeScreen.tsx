import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    StatusBar, ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { UserRole } from '../data/properties';
import { ChevronLeft, Phone } from 'lucide-react-native';
import Svg, { Circle, Path } from 'react-native-svg';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

type ValidRole = 'seeker' | 'owner' | 'broker';

const ROLES: { key: ValidRole; label: string; desc: string }[] = [
    { key: 'seeker', label: 'Rent Seeker', desc: 'Looking for a property to rent' },
    { key: 'owner', label: 'Property Owner', desc: 'I own a property and want to list it' },
    { key: 'broker', label: 'Broker / Agent', desc: 'I connect owners and rent seekers' },
];

const ROLE_COLORS: Record<string, { bg: string; selected: string; text: string }> = {
    seeker: { bg: '#e9e1ff', selected: '#6c5dd3', text: '#6c5dd3' },
    owner: { bg: '#E4F3EF', selected: '#0C886B', text: '#0C886B' },
    broker: { bg: '#d8f5ed', selected: '#0fba81', text: '#0fba81' },
};

export default function WelcomeScreen() {
    const navigation = useNavigation<Nav>();
    const [phone, setPhone] = useState('');
    const [selectedRole, setSelectedRole] = useState<UserRole>(null);
    const [step, setStep] = useState<'role' | 'phone'>('role');

    const canProceedRole = selectedRole !== null;
    const canProceedPhone = phone.length === 10;

    const handleContinue = () => {
        if (step === 'role') {
            if (canProceedRole) setStep('phone');
        } else {
            if (canProceedPhone) {
                navigation.navigate('OTP', { phone, role: selectedRole });
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6c5dd3" />

            {/* Purple gradient top */}
            <View style={styles.gradientTop} />

            {/* Back button */}
            <TouchableOpacity
                onPress={() => step === 'role' ? navigation.goBack() : setStep('role')}
                style={styles.backBtn}
            >
                <ChevronLeft size={20} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>

            {/* Logo section */}
            <View style={styles.logoSection}>
                <View style={styles.logoBox}>
                    <Svg width={36} height={36} viewBox="0 0 36 36" fill="none">
                        <Path d="M18 4L4 15h4v17h8v-9h4v9h8V15h4L18 4z" fill="white" />
                    </Svg>
                </View>
                <Text style={styles.logoTitle}>ghardilado.com</Text>
                <Text style={styles.logoSubtitle}>Gandhinagar's Rental Platform</Text>
            </View>

            {/* Content */}
            <ScrollView style={styles.contentArea} showsVerticalScrollIndicator={false}>
                {step === 'role' ? (
                    <>
                        <Text style={styles.heading}>Getting Started</Text>
                        <Text style={styles.subheading}>
                            Tell us who you are so we can personalise your experience.
                        </Text>

                        <View style={styles.rolesContainer}>
                            {ROLES.map((role) => {
                                const roleColors = ROLE_COLORS[role.key];
                                const isSelected = selectedRole === role.key;
                                return (
                                    <TouchableOpacity
                                        key={role.key}
                                        onPress={() => setSelectedRole(role.key)}
                                        style={[
                                            styles.roleCard,
                                            {
                                                backgroundColor: isSelected ? roleColors.selected : '#f7f8f9',
                                                borderColor: isSelected ? roleColors.selected : 'transparent',
                                            },
                                        ]}
                                        activeOpacity={0.85}
                                    >
                                        <View style={[
                                            styles.roleIconBox,
                                            { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : roleColors.bg },
                                        ]}>
                                            <Text style={styles.roleEmoji}>
                                                {role.key === 'seeker' ? '🔍' : role.key === 'owner' ? '🏠' : '🤝'}
                                            </Text>
                                        </View>
                                        <View style={styles.roleTextWrap}>
                                            <Text style={[
                                                styles.roleLabel,
                                                { color: isSelected ? '#fff' : '#1b1d21' },
                                            ]}>{role.label}</Text>
                                            <Text style={[
                                                styles.roleDesc,
                                                { color: isSelected ? 'rgba(255,255,255,0.8)' : '#8f92a1' },
                                            ]}>{role.desc}</Text>
                                        </View>
                                        {isSelected && (
                                            <View style={styles.checkCircle}>
                                                <Text style={styles.checkMark}>✓</Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <TouchableOpacity
                            onPress={handleContinue}
                            style={[
                                styles.continueBtn,
                                { backgroundColor: canProceedRole ? '#0C886B' : '#d9d9d9' },
                            ]}
                            activeOpacity={0.85}
                        >
                            <Text style={[
                                styles.continueBtnText,
                                { color: canProceedRole ? '#fff' : '#8f92a1' },
                            ]}>Continue</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.heading}>Welcome</Text>
                        <Text style={[styles.subheading, { marginBottom: 32 }]}>
                            Enter your phone number to get started.
                        </Text>

                        {/* Phone input */}
                        <View style={styles.phoneInputRow}>
                            <View style={styles.countryCodeSection}>
                                <Text style={styles.flagText}>🇮🇳</Text>
                                <Text style={styles.countryCodeText}>+91</Text>
                            </View>
                            <View style={styles.phoneInputDivider} />
                            <View style={styles.phoneFieldWrap}>
                                <Phone size={18} color="#8f92a1" strokeWidth={1.8} />
                                <TextInput
                                    style={styles.phoneInput}
                                    placeholder="Enter 10-digit number"
                                    placeholderTextColor="#8f92a1"
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                    value={phone}
                                    onChangeText={setPhone}
                                />
                            </View>
                        </View>

                        <Text style={styles.otpHint}>
                            We will send an OTP to verify your number
                        </Text>

                        <TouchableOpacity
                            onPress={handleContinue}
                            style={[
                                styles.continueBtn,
                                { backgroundColor: canProceedPhone ? '#0C886B' : '#d9d9d9' },
                            ]}
                            activeOpacity={0.85}
                        >
                            <Text style={[
                                styles.continueBtnText,
                                { color: canProceedPhone ? '#fff' : '#8f92a1' },
                            ]}>Send OTP</Text>
                        </TouchableOpacity>

                        <Text style={styles.termsText}>
                            By continuing, you agree to our{' '}
                            <Text style={styles.termsLink}>Terms & Conditions</Text>
                        </Text>
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    gradientTop: {
        position: 'absolute', left: 0, right: 0, top: 0, height: 200,
        backgroundColor: '#6c5dd3',
        borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
    },
    backBtn: {
        position: 'absolute', left: 26, top: 52, zIndex: 10,
        width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    },
    logoSection: {
        alignItems: 'center', paddingTop: 90, zIndex: 5,
    },
    logoBox: {
        width: 64, height: 64, backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    },
    logoTitle: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.6 },
    logoSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
    contentArea: { flex: 1, paddingHorizontal: 26, paddingTop: 20 },
    heading: {
        fontSize: 28, fontWeight: '800', color: '#1b1d21',
        letterSpacing: -1, lineHeight: 36, marginBottom: 8,
    },
    subheading: { fontSize: 15, color: '#8f92a1', lineHeight: 22, marginBottom: 28 },
    rolesContainer: { gap: 14 },
    roleCard: {
        height: 88, borderRadius: 20, flexDirection: 'row',
        alignItems: 'center', paddingHorizontal: 20, gap: 16,
        borderWidth: 2,
    },
    roleIconBox: {
        width: 52, height: 52, borderRadius: 14,
        alignItems: 'center', justifyContent: 'center',
    },
    roleEmoji: { fontSize: 24 },
    roleTextWrap: { flex: 1 },
    roleLabel: { fontSize: 16, fontWeight: '700', letterSpacing: -0.3, lineHeight: 22 },
    roleDesc: { fontSize: 13, lineHeight: 18 },
    checkCircle: {
        width: 24, height: 24, backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    },
    checkMark: { color: '#fff', fontSize: 14, fontWeight: '700' },
    continueBtn: {
        width: '100%', height: 56, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center', marginTop: 28,
    },
    continueBtnText: { fontSize: 14, fontWeight: '700', letterSpacing: -0.3 },
    phoneInputRow: {
        width: '100%', height: 60, backgroundColor: '#f7f8f9',
        borderRadius: 16, flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, gap: 12, marginBottom: 16,
    },
    countryCodeSection: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    flagText: { fontSize: 16 },
    countryCodeText: { fontSize: 14, fontWeight: '500', color: '#1b1d21' },
    phoneInputDivider: { width: 1, height: 24, backgroundColor: '#e0e0e0' },
    phoneFieldWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
    phoneInput: { flex: 1, fontSize: 14, color: '#1b1d21', padding: 0 },
    otpHint: { fontSize: 12, color: '#8f92a1', textAlign: 'center', marginBottom: 28 },
    termsText: {
        fontSize: 12, color: 'rgba(0,0,0,0.5)', textAlign: 'center',
        marginTop: 20, lineHeight: 18,
    },
    termsLink: { fontWeight: '700', color: '#0C886B' },
});
