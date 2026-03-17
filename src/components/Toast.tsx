import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ToastProps {
    visible: boolean;
    message: string;
    type?: 'success' | 'error' | 'info';
    onHide: () => void;
}

export default function Toast({ visible, message, type = 'success', onHide }: ToastProps) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-20)).current;

    const [show, setShow] = React.useState(visible);

    useEffect(() => {
        if (visible) {
            setShow(true);
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            const timer = setTimeout(() => {
                hide();
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            hide();
        }
    }, [visible]);

    const hide = () => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: -20,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setShow(false);
            onHide();
        });
    };

    if (!show) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return < CheckCircle2 size={18} color="#059669" />;
            case 'error': return < AlertCircle size={18} color="#dc2626" />;
            case 'info': return < Info size={18} color="#2563eb" />;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'success': return { bg: '#ecfdf5', border: '#10b98130', text: '#065f46' };
            case 'error': return { bg: '#fef2f2', border: '#ef444430', text: '#991b1b' };
            case 'info': return { bg: '#eff6ff', border: '#3b82f630', text: '#1e40af' };
        }
    };

    const colors = getColors();

    return (
        <Animated.View style={[
            styles.container,
            {
                opacity,
                transform: [{ translateY }],
                backgroundColor: colors.bg,
                borderColor: colors.border
            }
        ]}>
            <View style={styles.iconWrap}>
                {getIcon()}
            </View>
            <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        padding: 14,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        zIndex: 9999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    iconWrap: {
        marginRight: 10,
    },
    message: {
        fontSize: 14,
        fontWeight: '700',
        flex: 1,
    },
});
