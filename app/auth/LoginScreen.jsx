import React, { useState, useContext } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {router} from 'expo-router';
import {login, loadUser} from "../../services/AuthService";
import AuthContext from "../../contexts/AuthContext";

// Force RTL layout
I18nManager.forceRTL(true);

const { width } = Dimensions.get('window');
const GREEN = '#34D399';
const LIGHT_GREEN = '#E8FDF5';

export default function LoginScreen() {
    const {setUser} = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError('');
        setLoading(true);
        
        try {
            console.log('Attempting login with:', { email, password });
            
            const response = await login({
                email,
                password,
                device_name: `${Platform.OS} ${Platform.Version}`,
            });

            console.log('Login successful, loading user...');
            const user = await loadUser();
            console.log('User loaded:', user);

            // Check user type and active status
            if (user.type === 'Trader') {
                if (!user.trader?.is_active) {
                    setError('حسابك قيد المراجعة. سيتم إخطارك عند تفعيل حسابك.');
                    setLoading(false);
                    return;
                }
                setUser(user);
                router.replace('/trader');
            } 
            else if (user.type === 'Driver') {
                if (!user.is_active) {
                    setError('حسابك قيد المراجعة. سيتم إخطارك عند تفعيل حسابك.');
                    setLoading(false);
                    return;
                }
                setUser(user);
                router.replace('/driver');
            } 
            else {
                setError('بيانات الاعتماد غير صحيحة. يرجى التحقق من حسابك.');
                setLoading(false);
                return;
            }
        } catch (e) {
            console.error('Login error:', e.response?.data || e.message);
            if(e.response?.status === 422) {
                setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            } else {
                setError('حدث خطأ ما. يرجى المحاولة مرة أخرى');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar barStyle="dark-content" />
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.logoContainer}>
                    <Ionicons name="person-circle-outline" size={100} color={GREEN} />
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
                            editable={!loading}
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
                            editable={!loading}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color={GREEN} />
                        </TouchableOpacity>
                        <Ionicons name="lock-closed-outline" size={24} color={GREEN} style={styles.icon} />
                    </View>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}
                    <TouchableOpacity 
                        style={[styles.button, loading && styles.buttonDisabled]} 
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'جاري تسجيل الدخول...' : 'دخول'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.registerLink}
                        onPress={() => router.push('/auth/RegisterTypeScreen')}
                        disabled={loading}
                    >
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
    buttonDisabled: {
        opacity: 0.7,
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

