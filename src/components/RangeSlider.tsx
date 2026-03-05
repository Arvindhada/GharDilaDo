import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Animated, Text, Dimensions } from 'react-native';

interface RangeSliderProps {
    min: number;
    max: number;
    step?: number;
    onValueChange: (min: number, max: number) => void;
    initialLow?: number;
    initialHigh?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HANDLE_SIZE = 26; // Slightly larger for better touch

export default function RangeSlider({
    min, max, step = 1000,
    onValueChange,
    initialLow, initialHigh
}: RangeSliderProps) {

    // Positions are Relative (0 to 1)
    const [low, setLow] = useState(initialLow || min);
    const [high, setHigh] = useState(initialHigh || max);
    const [sliderWidth, setSliderWidth] = useState(0);

    const lowPos = useRef(new Animated.Value(0)).current;
    const highPos = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (sliderWidth > 0) {
            updatePositions(initialLow || min, initialHigh || max);
        }
    }, [sliderWidth, initialLow, initialHigh]);

    const updatePositions = (l: number, h: number) => {
        const lP = ((l - min) / (max - min)) * sliderWidth;
        const hP = ((h - min) / (max - min)) * sliderWidth;
        lowPos.setValue(lP);
        highPos.setValue(hP);
    };

    const getValueFromPos = (pos: number) => {
        const value = min + (pos / sliderWidth) * (max - min);
        return Math.round(value / step) * step;
    };

    const panResponderLow = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            if (sliderWidth === 0) return;
            let newX = (lowPos as any)._value + gestureState.dx;
            if (newX < 0) newX = 0;
            if (newX > (highPos as any)._value - 10) newX = (highPos as any)._value - 10;

            lowPos.setValue(newX);
            const val = getValueFromPos(newX);
            if (val !== low) {
                setLow(val);
                onValueChange(val, high);
            }
        },
        onPanResponderRelease: () => {
            // Snap logic could be added here
        }
    });

    const panResponderHigh = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
            if (sliderWidth === 0) return;
            let newX = (highPos as any)._value + gestureState.dx;
            if (newX > sliderWidth) newX = sliderWidth;
            if (newX < (lowPos as any)._value + 10) newX = (lowPos as any)._value + 10;

            highPos.setValue(newX);
            const val = getValueFromPos(newX);
            if (val !== high) {
                setHigh(val);
                onValueChange(low, val);
            }
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                <Text style={styles.title}>PRICE RANGE (MONTHLY)</Text>
                <View style={styles.valueBox}>
                    <Text style={styles.valueText}>
                        ₹{low.toLocaleString()} - ₹{high === max ? `${high.toLocaleString()}+` : high.toLocaleString()}
                    </Text>
                </View>
            </View>

            <View
                style={styles.sliderTrackWrap}
                onLayout={(e) => { setSliderWidth(e.nativeEvent.layout.width); }}
            >
                {/* Background Rail */}
                <View style={styles.rail} />

                {/* Active Range Highlight */}
                <Animated.View
                    style={[
                        styles.track,
                        {
                            left: lowPos,
                            width: Animated.subtract(highPos, lowPos)
                        }
                    ]}
                />

                {/* Handles */}
                <Animated.View
                    {...panResponderLow.panHandlers}
                    style={[styles.handle, { transform: [{ translateX: Animated.subtract(lowPos, HANDLE_SIZE / 2) }] }]}
                />
                <Animated.View
                    {...panResponderHigh.panHandlers}
                    style={[styles.handle, { transform: [{ translateX: Animated.subtract(highPos, HANDLE_SIZE / 2) }] }]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { width: '100%', paddingVertical: 10 },
    labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 13, fontWeight: '700', color: '#666', letterSpacing: 0.5 },
    valueBox: { backgroundColor: 'rgba(12, 136, 107, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    valueText: { color: '#0C886B', fontWeight: '700', fontSize: 14 },
    sliderTrackWrap: { height: 40, justifyContent: 'center', position: 'relative' },
    rail: { height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, width: '100%' },
    track: { height: 4, backgroundColor: '#0C886B', borderRadius: 2, position: 'absolute' },
    handle: {
        width: HANDLE_SIZE, height: HANDLE_SIZE, borderRadius: HANDLE_SIZE / 2,
        backgroundColor: '#fff', borderWidth: 2, borderColor: '#0C886B',
        position: 'absolute', top: 7, // (40 - 26) / 2 = 7
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3,
    }
});
