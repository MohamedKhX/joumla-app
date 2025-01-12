import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
    StatusBar,
    I18nManager,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Force RTL layout
I18nManager.forceRTL(true);

const { width, height } = Dimensions.get('window');
const GREEN = '#34D399';
const LIGHT_GREEN = '#E8FDF5';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            setError('يرجى ملء جميع الحقول');
            return;
        }
        console.log('بيانات تسجيل الدخول:', { email, password });
        setError('');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.logoContainer}>
                    <Image
                        source={{ uri: '/placeholder.svg?height=100&width=100' }}
                        style={styles.logo}
                    />
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.title}>تسجيل الدخول</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="البريد الإلكتروني"
                            placeholderTextColor="#A0A0A0"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            textAlign="right"
                        />
                        <Ionicons name="mail-outline" size={24} color={GREEN} style={styles.icon} />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="كلمة المرور"
                            placeholderTextColor="#A0A0A0"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            textAlign="right"
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color={GREEN} />
                        </TouchableOpacity>
                        <Ionicons name="lock-closed-outline" size={24} color={GREEN} style={styles.icon} />
                    </View>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>دخول</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.registerLink}>
                        <Text style={styles.registerLinkText}>ليس لديك حساب؟ إنشاء حساب جديد</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    formContainer: {
        width: width * 0.9,
        maxWidth: 400,
        alignItems: 'center',
        backgroundColor: LIGHT_GREEN,
        borderRadius: 20,
        padding: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 30,
        textAlign: 'center',
        fontFamily: 'Arial',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        height: 50,
        width: '100%',
    },
    icon: {
        marginLeft: 10,
    },
    input: {
        flex: 1,
        color: '#333333',
        fontSize: 16,
        textAlign: 'right',
        fontFamily: 'Arial',
    },
    eyeIcon: {
        padding: 10,
    },
    button: {
        backgroundColor: GREEN,
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 40,
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
        shadowColor: GREEN,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Arial',
    },
    errorText: {
        color: '#FF3B30',
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Arial',
    },
    forgotPassword: {
        marginTop: 15,
    },
    forgotPasswordText: {
        color: GREEN,
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Arial',
    },
    registerLink: {
        marginTop: 20,
    },
    registerLinkText: {
        color: GREEN,
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Arial',
    },
});

