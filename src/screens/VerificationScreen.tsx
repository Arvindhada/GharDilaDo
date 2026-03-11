import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput, StatusBar,
    ScrollView, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, User, Phone, MapPin, Building, CreditCard, Upload } from 'lucide-react-native';
import * as ImagePicker from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppTheme } from '../context/ThemeContext';
import { useAppStore } from '../store/useAppStore';

export default function VerificationScreen() {
    const navigation = useNavigation();
    const { t } = useAppTheme();
    const insets = useSafeAreaInsets();
    const storedName = useAppStore(state => state.name);
    const storedPhone = useAppStore(state => state.phone);
    const submitKyc = useAppStore(state => state.submitKyc);

    const [step, setStep] = useState<1 | 2>(1);
    
    // Form Data
    const [name, setName] = useState(storedName);
    const [phone, setPhone] = useState(storedPhone);
    const [city, setCity] = useState('');
    const [address, setAddress] = useState('');
    const [aadharNumber, setAadharNumber] = useState('');
    const [aadharImage, setAadharImage] = useState<string | null>(null);

    const canProceedStep1 = name.trim() && phone.trim() && city.trim() && address.trim();
    const canProceedStep2 = aadharNumber.length === 12 && aadharImage;

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
        });

        if (result.assets && result.assets.length > 0) {
            setAadharImage(result.assets[0].uri || null);
        }
    };

    const handleSubmit = () => {
        submitKyc({
            city,
            address,
            aadharNumber,
            aadharImage: aadharImage || ''
        });
        
        // After KYC is submitted, go to Add Listing (or go back if that's where they came from)
        navigation.goBack(); 
        setTimeout(() => {
            (navigation as any).navigate('AddListing');
        }, 100);
    };

    return (
        <View style={[styles.container, { backgroundColor: t.bg }]}>
            <StatusBar barStyle={t.bg === '#ffffff' ? 'dark-content' : 'light-content'} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
                <TouchableOpacity onPress={() => step === 2 ? setStep(1) : navigation.goBack()} style={[styles.backBtn, { backgroundColor: t.cardBg }]}>
                    <ChevronLeft size={22} color={t.title} strokeWidth={2.5} />
                </TouchableOpacity>
                <View>
                    <Text style={[styles.headerTitle, { color: t.title }]}>Profile Verification</Text>
                    <Text style={[styles.headerSubtitle, { color: t.muted }]}>
                        Step {step} of 2
                    </Text>
                </View>
            </View>

            <KeyboardAwareScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                enableOnAndroid
                extraScrollHeight={20}
            >
                {step === 1 ? (
                    <>
                        <Text style={[styles.sectionTitle, { color: t.title }]}>Basic Details</Text>
                        
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
                            <View style={[styles.inputBox, { backgroundColor: t.cardBg, opacity: 0.7 }]}>
                                <Phone size={20} color={t.muted} />
                                <TextInput
                                    style={[styles.input, { color: t.title }]}
                                    value={phone}
                                    editable={false}
                                />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={[styles.label, { color: t.title }]}>City</Text>
                            <View style={[styles.inputBox, { backgroundColor: t.cardBg }]}>
                                <Building size={20} color={t.muted} />
                                <TextInput
                                    style={[styles.input, { color: t.title }]}
                                    value={city}
                                    onChangeText={setCity}
                                    placeholder="e.g. Gandhinagar"
                                    placeholderTextColor={t.muted}
                                />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={[styles.label, { color: t.title }]}>Complete Address</Text>
                            <View style={[styles.inputBox, styles.textAreaBox, { backgroundColor: t.cardBg }]}>
                                <MapPin size={20} color={t.muted} style={{ marginTop: 14 }} />
                                <TextInput
                                    style={[styles.input, styles.textArea, { color: t.title }]}
                                    value={address}
                                    onChangeText={setAddress}
                                    placeholder="Enter full residential address"
                                    placeholderTextColor={t.muted}
                                    multiline
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>
                        
                        <TouchableOpacity
                            style={[styles.continueBtn, !canProceedStep1 && styles.btnDisabled]}
                            onPress={() => setStep(2)}
                            disabled={!canProceedStep1}
                        >
                            <Text style={styles.btnText}>Continue</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={[styles.sectionTitle, { color: t.title }]}>KYC Details</Text>
                        
                        <View style={styles.formGroup}>
                            <Text style={[styles.label, { color: t.title }]}>Aadhar Number</Text>
                            <View style={[styles.inputBox, { backgroundColor: t.cardBg }]}>
                                <CreditCard size={20} color={t.muted} />
                                <TextInput
                                    style={[styles.input, { color: t.title }]}
                                    value={aadharNumber}
                                    onChangeText={setAadharNumber}
                                    placeholder="12-digit Aadhar number"
                                    placeholderTextColor={t.muted}
                                    keyboardType="numeric"
                                    maxLength={12}
                                />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={[styles.label, { color: t.title }]}>Upload Aadhar Card (Front)</Text>
                            <TouchableOpacity 
                                style={[styles.uploadBox, { backgroundColor: t.cardBg, borderColor: t.divider }]} 
                                onPress={handleImagePick}
                            >
                                {aadharImage ? (
                                    <Image source={{ uri: aadharImage }} style={styles.previewImage} />
                                ) : (
                                    <>
                                        <View style={styles.iconCircle}>
                                            <Upload size={24} color="#0C886B" />
                                        </View>
                                        <Text style={[styles.uploadText, { color: t.muted }]}>Tap to select image</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.infoText, { color: t.muted }]}>
                            Your details are safe and securely encrypted. We need this to verify authentic property owners on GharDilaDo.
                        </Text>
                    </>
                )}
            </KeyboardAwareScrollView>

            {step === 2 && (
                <View style={[styles.floor, { backgroundColor: t.bg, borderTopColor: t.divider }]}>
                    <TouchableOpacity
                        style={[styles.saveBtn, !canProceedStep2 && styles.btnDisabled]}
                        onPress={handleSubmit}
                        disabled={!canProceedStep2}
                    >
                        <Text style={styles.saveText}>Submit & Continue</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        paddingHorizontal: 20, paddingBottom: 16,
    },
    backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.4 },
    headerSubtitle: { fontSize: 13, marginTop: 2 },
    content: { padding: 20, paddingBottom: 100 },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 24 },
    formGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '700', marginBottom: 8, paddingLeft: 4 },
    inputBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderRadius: 16, gap: 12 },
    input: { flex: 1, fontSize: 16, fontWeight: '500', height: 56 },
    textAreaBox: { alignItems: 'flex-start' },
    textArea: { height: 100, paddingTop: 16 },
    
    uploadBox: {
        height: 160, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed',
        alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
    },
    iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(12, 136, 107, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    uploadText: { fontSize: 14, fontWeight: '500' },
    previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    
    infoText: { fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 10 },
    
    continueBtn: {
        backgroundColor: '#0C886B', height: 56, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center', marginTop: 20
    },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
    
    floor: {
        padding: 20, paddingBottom: 34,
        borderTopWidth: 1, position: 'absolute', bottom: 0, left: 0, right: 0
    },
    saveBtn: {
        backgroundColor: '#0C886B', height: 56, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#0C886B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4
    },
    btnDisabled: { opacity: 0.5, shadowOpacity: 0 },
    saveText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
});
