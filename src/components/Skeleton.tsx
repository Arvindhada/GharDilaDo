import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, DimensionValue } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

interface SkeletonProps {
    width?: DimensionValue;
    height?: DimensionValue;
    borderRadius?: number;
    style?: any;
}

export default function Skeleton({ width, height, borderRadius, style }: SkeletonProps) {
    const { t } = useAppTheme();
    const shimmerValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const shimmerAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerValue, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        shimmerAnimation.start();
        return () => shimmerAnimation.stop();
    }, [shimmerValue]);

    const opacity = shimmerValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                {
                    width: width || '100%',
                    height: height || 20,
                    borderRadius: borderRadius || 4,
                    backgroundColor: t.bg === '#ffffff' ? '#E1E9EE' : '#2c2c2e',
                    opacity,
                },
                style,
            ]}
        />
    );
}
