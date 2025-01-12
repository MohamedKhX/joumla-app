import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
    Easing,
    I18nManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

// Force RTL layout
I18nManager.forceRTL(true);

const { width, height } = Dimensions.get('window');
const BLUE = '#3bf65a';
const DARK_BLUE = '#31af1e';
const LIGHT_BLUE = '#93fdb5';

export default function SplashScreen() {
    const scaleValue = new Animated.Value(0);
    const fadeValue = new Animated.Value(0);
    const moveValue = new Animated.Value(0);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1),
                useNativeDriver: true,
            }),
            Animated.timing(fadeValue, {
                toValue: 1,
                duration: 800,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1),
                useNativeDriver: true,
            }),
            Animated.timing(moveValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.bezier(0.4, 0.0, 0.2, 1),
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <LinearGradient
            colors={[BLUE, DARK_BLUE]}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        transform: [
                            { scale: scaleValue },
                            {
                                translateY: moveValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [50, 0],
                                }),
                            },
                        ]
                    }
                ]}
            >
                <View style={styles.iconContainer}>
                    <Feather name="box" size={80} color={LIGHT_BLUE} />
                    <Feather name="truck" size={60} color={LIGHT_BLUE} style={styles.truckIcon} />
                </View>
            </Animated.View>
            <Animated.View style={[styles.textContainer, { opacity: fadeValue }]}>
                <Text style={styles.appName}>جملة</Text>
                <Text style={styles.slogan}>تجارة الجملة بكل سهولة</Text>
            </Animated.View>
            <Animated.View
                style={[
                    styles.shapesContainer,
                    {
                        opacity: fadeValue,
                        transform: [{
                            translateY: moveValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [100, 0],
                            }),
                        }],
                    }
                ]}
            >
                <View style={[styles.shape, styles.shape1]} />
                <View style={[styles.shape, styles.shape2]} />
                <View style={[styles.shape, styles.shape3]} />
            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    truckIcon: {
        marginLeft: -20,
        marginTop: 30,
    },
    textContainer: {
        alignItems: 'center',
    },
    appName: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
        fontFamily: 'Arial',
        textAlign: 'center',
    },
    slogan: {
        fontSize: 18,
        color: LIGHT_BLUE,
        fontFamily: 'Arial',
        textAlign: 'center',
    },
    shapesContainer: {
        position: 'absolute',
        bottom: 40,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: width,
    },
    shape: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    shape1: {
        transform: [{ scale: 0.8 }],
    },
    shape2: {
        transform: [{ scale: 1.2 }],
    },
    shape3: {
        transform: [{ scale: 0.6 }],
    },
});
