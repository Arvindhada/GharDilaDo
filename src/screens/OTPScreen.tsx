import React, { useState, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { ChevronLeft } from 'lucide-react-native';

type Nav = NativeStackNavigationProp<RootStackParamList, 'OTP'>;
type Route = RouteProp<RootStackParamList, 'OTP'>;

export default function OTPScreen() {
    const navigation = useNavigation<Nav>();
    const route = useRoute<Route>();
    const { phone } = route.params;
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const handleChange = (val: string, idx: number) => {
        const newOtp = [...otp];
        newOtp[idx] = val;
        setOtp(newOtp);
        if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
    };

    const handleKeyPress = (e: any, idx: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
            inputRefs.current[idx - 1]?.focus();
        }
    };

    const handleVerify = () => {
        // OTP verified → go to main tabs
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="light-content" backgroundColor="#1b1d21" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Verify OTP</Text>
            </View>
            <View style={styles.body}>
                <Text style={styles.title}>Enter OTP</Text>
                <Text style={styles.desc}>
                    We've sent a 6-digit OTP to{'\n'}
                    <Text style={styles.phoneHighlight}>+91 {phone}</Text>
                </Text>

                <View style={styles.otpRow}>
                    {otp.map((digit, idx) => (
                        <TextInput
                            key={idx}
                            ref={ref => { inputRefs.current[idx] = ref; }}
                            style={[styles.otpBox, digit && styles.otpBoxFilled]}
                            value={digit}
                            onChangeText={v => handleChange(v.slice(-1), idx)}
                            onKeyPress={e => handleKeyPress(e, idx)}
                            keyboardType="number-pad"
                            maxLength={1}
                            selectTextOnFocus
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.resend}>
                    <Text style={styles.resendText}>Resend OTP in 30s</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
                    <Text style={styles.verifyBtnText}>Verify & Continue</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1b1d21' },
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 16, paddingTop: 48, paddingBottom: 16,
    },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { color: '#fff', fontSize: 17, fontWeight: '600', marginLeft: 8 },
    body: { flex: 1, paddingHorizontal: 28, paddingTop: 32 },
    title: { fontSize: 28, fontWeight: '800', color: '#ffffff', marginBottom: 8 },
    desc: { fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 22, marginBottom: 40 },
    otpRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
    otpBox: {
        flex: 1, height: 56, borderRadius: 14,
        backgroundColor: '#2a2c30', borderWidth: 2, borderColor: 'transparent',
        textAlign: 'center', fontSize: 22, fontWeight: '700', color: '#ffffff',
    },
    otpBoxFilled: { borderColor: '#0C886B', backgroundColor: 'rgba(12,136,107,0.1)' },
    resend: { alignSelf: 'center', marginBottom: 40 },
    resendText: { color: '#0C886B', fontSize: 14 },
    verifyBtn: {
        width: '100%', height: 56, backgroundColor: '#0C886B',
        borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    },
    verifyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    phoneHighlight: { color: '#0C886B', fontWeight: '700' },
});
