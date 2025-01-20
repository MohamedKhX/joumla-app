import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import axios from '../../utils/axios';
import { LinearGradient } from 'expo-linear-gradient';

const GREEN = '#34D399';

export default function RegisterDriverScreen() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        car_image: null,
        target_image: null,
        license_image: null,
    });

    const pickImage = async (type) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setFormData(prev => ({
                ...prev,
                [type]: result.assets[0],
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name) newErrors.name = 'الاسم مطلوب';
        if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'البريد الإلكتروني غير صالح';
        
        if (!formData.phone) newErrors.phone = 'رقم الهاتف مطلوب';
        if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
        else if (formData.password.length < 8) newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
        
        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'كلمات المرور غير متطابقة';
        }
        
        if (!formData.car_image) newErrors.car_image = 'صورة السيارة مطلوبة';
        if (!formData.license_image) newErrors.license_image = 'صورة رخصة القيادة مطلوبة';
        if (!formData.target_image) newErrors.target_image = 'صورة الهوية مطلوبة';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            Alert.alert('خطأ', 'الرجاء تصحيح الأخطاء وملء جميع الحقول المطلوبة');
            return;
        }

        try {
            setLoading(true);

            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (['car_image', 'target_image', 'license_image'].includes(key)) {
                    if (formData[key]) {
                        formDataToSend.append(key, {
                            uri: formData[key].uri,
                            type: 'image/jpeg',
                            name: `${key}.jpg`,
                        });
                    }
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            await axios.post('/new/driver', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Alert.alert(
                'شكراً لتسجيلك',
                'نشكرك على اختيار منصتنا. سيتم مراجعة طلبك وتفعيل حسابك في أقرب وقت.',
                [
                    {
                        text: 'حسناً',
                        onPress: () => router.replace('/auth/LoginScreen'),
                    },
                ]
            );

        } catch (error) {
            if (error.response?.data?.errors) {
                const serverErrors = {};
                Object.keys(error.response.data.errors).forEach(key => {
                    serverErrors[key] = error.response.data.errors[key][0];
                });
                setErrors(serverErrors);
                Alert.alert('خطأ', 'الرجاء تصحيح الأخطاء وإعادة المحاولة');
            } else {
                Alert.alert(
                    'خطأ',
                    error.response?.data?.message || 'حدث خطأ أثناء التسجيل'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const renderImageUpload = (type, title, icon) => (
        <TouchableOpacity 
            style={[styles.uploadButton, errors[type] && styles.uploadButtonError]}
            onPress={() => pickImage(type)}
        >
            {formData[type] ? (
                <Image source={{ uri: formData[type].uri }} style={styles.uploadedImage} />
            ) : (
                <LinearGradient
                    colors={[GREEN + '20', GREEN + '10']}
                    style={styles.uploadPlaceholder}
                >
                    <Ionicons name={icon} size={32} color={GREEN} />
                    <Text style={styles.uploadButtonText}>{title}</Text>
                </LinearGradient>
            )}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <LinearGradient
                colors={[GREEN, GREEN + 'DD']}
                style={styles.header}
            >
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>تسجيل حساب سائق جديد</Text>
            </LinearGradient>

            <View style={styles.form}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>المعلومات الأساسية</Text>
                    
                    <TextInput
                        style={[styles.input, errors.name && styles.inputError]}
                        placeholder="الاسم"
                        value={formData.name}
                        onChangeText={(text) => {
                            setFormData(prev => ({ ...prev, name: text }));
                            setErrors(prev => ({ ...prev, name: null }));
                        }}
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                    <TextInput
                        style={[styles.input, errors.email && styles.inputError]}
                        placeholder="البريد الإلكتروني"
                        value={formData.email}
                        onChangeText={(text) => {
                            setFormData(prev => ({ ...prev, email: text }));
                            setErrors(prev => ({ ...prev, email: null }));
                        }}
                        keyboardType="email-address"
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                    <TextInput
                        style={[styles.input, errors.phone && styles.inputError]}
                        placeholder="رقم الهاتف"
                        value={formData.phone}
                        onChangeText={(text) => {
                            setFormData(prev => ({ ...prev, phone: text }));
                            setErrors(prev => ({ ...prev, phone: null }));
                        }}
                        keyboardType="phone-pad"
                    />
                    {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

                    <TextInput
                        style={[styles.input, errors.password && styles.inputError]}
                        placeholder="كلمة المرور"
                        value={formData.password}
                        onChangeText={(text) => {
                            setFormData(prev => ({ ...prev, password: text }));
                            setErrors(prev => ({ ...prev, password: null }));
                        }}
                        secureTextEntry
                    />
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                    <TextInput
                        style={[styles.input, errors.password_confirmation && styles.inputError]}
                        placeholder="تأكيد كلمة المرور"
                        value={formData.password_confirmation}
                        onChangeText={(text) => {
                            setFormData(prev => ({ ...prev, password_confirmation: text }));
                            setErrors(prev => ({ ...prev, password_confirmation: null }));
                        }}
                        secureTextEntry
                    />
                    {errors.password_confirmation && <Text style={styles.errorText}>{errors.password_confirmation}</Text>}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>المستندات المطلوبة</Text>
                    
                    {renderImageUpload('car_image', 'صورة السيارة', 'car-outline')}
                    {errors.car_image && <Text style={styles.errorText}>{errors.car_image}</Text>}
                    
                    {renderImageUpload('license_image', 'صورة رخصة القيادة', 'document-text-outline')}
                    {errors.license_image && <Text style={styles.errorText}>{errors.license_image}</Text>}
                    
                    {renderImageUpload('target_image', 'صورة الهوية', 'card-outline')}
                    {errors.target_image && <Text style={styles.errorText}>{errors.target_image}</Text>}
                </View>

                <TouchableOpacity 
                    style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.registerButtonText}>تسجيل</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        padding: 20,
        paddingTop: 60,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    form: {
        padding: 20,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 15,
        textAlign: 'right',
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        textAlign: 'right',
        fontSize: 16,
    },
    inputError: {
        borderWidth: 1,
        borderColor: '#EF4444',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: -5,
        marginBottom: 10,
        marginRight: 5,
        textAlign: 'right',
    },
    uploadButton: {
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden',
        height: 180,
    },
    uploadPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    uploadButtonText: {
        color: '#1F2937',
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500',
    },
    uploadButtonError: {
        borderWidth: 2,
        borderColor: '#EF4444',
    },
    registerButton: {
        backgroundColor: GREEN,
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    registerButtonDisabled: {
        opacity: 0.7,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 