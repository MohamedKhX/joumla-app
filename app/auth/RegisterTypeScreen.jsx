import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    I18nManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

I18nManager.forceRTL(true);

const GREEN = '#34D399';

export default function RegisterTypeScreen() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={[GREEN, GREEN + 'DD']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>إنشاء حساب جديد</Text>
                <Text style={styles.headerSubtitle}>اختر نوع الحساب</Text>
            </LinearGradient>

            <View style={styles.content}>
                <TouchableOpacity 
                    style={styles.option}
                    onPress={() => router.push('/auth/RegisterTraderScreen')}
                >
                    <LinearGradient
                        colors={[GREEN + '20', GREEN + '10']}
                        style={styles.optionGradient}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons name="storefront-outline" size={40} color={GREEN} />
                        </View>
                        <Text style={styles.optionTitle}>تاجر</Text>
                        <Text style={styles.optionDescription}>
                            إنشاء حساب تاجر للبيع والشراء في المنصة
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.option}
                    onPress={() => router.push('/auth/RegisterDriverScreen')}
                >
                    <LinearGradient
                        colors={[GREEN + '20', GREEN + '10']}
                        style={styles.optionGradient}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons name="car-outline" size={40} color={GREEN} />
                        </View>
                        <Text style={styles.optionTitle}>سائق</Text>
                        <Text style={styles.optionDescription}>
                            إنشاء حساب سائق لتوصيل الطلبات
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Text style={styles.backButtonText}>لديك حساب بالفعل؟ تسجيل الدخول</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    headerSubtitle: {
        color: '#FFFFFF',
        fontSize: 16,
        opacity: 0.9,
        textAlign: 'right',
        marginTop: 5,
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    option: {
        marginBottom: 20,
        borderRadius: 15,
        overflow: 'hidden',
    },
    optionGradient: {
        padding: 20,
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    optionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    optionDescription: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
    },
    backButton: {
        padding: 20,
        alignItems: 'center',
    },
    backButtonText: {
        color: GREEN,
        fontSize: 16,
    },
}); 