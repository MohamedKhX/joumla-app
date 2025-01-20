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

    const handleRegister = async () => {
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
                'نشكرك على اختيار منصتنا. سيتم مراجعة طلبك وتفعيل حسابك في أقرب وقت. سنقوم بإرسال إشعار لك فور الموافقة على طلبك.',
                [
                    {
                        text: 'حسناً',
                        onPress: () => router.replace('/auth/LoginScreen'),
                    },
                ]
            );

        } catch (error) {
            Alert.alert(
                'خطأ',
                error.response?.data?.message || 'حدث خطأ أثناء التسجيل',
            );
        } finally {
            setLoading(false);
        }
    };

    const renderImageUpload = (type, title, icon) => (
        <TouchableOpacity 
            style={styles.uploadButton}
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
                    <Text style={styles.sectionTitle}>المعلومات الشخصية</Text>
                    
                    <TextInput
                        style={styles.input}
                        placeholder="الاسم الكامل"
                        value={formData.name}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="البريد الإلكتروني"
                        value={formData.email}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                        keyboardType="email-address"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="رقم الهاتف"
                        value={formData.phone}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                        keyboardType="phone-pad"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="كلمة المرور"
                        value={formData.password}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                        secureTextEntry
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="تأكيد كلمة المرور"
                        value={formData.password_confirmation}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, password_confirmation: text }))}
                        secureTextEntry
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>المستندات المطلوبة</Text>
                    
                    {renderImageUpload('car_image', 'صورة السيارة', 'car-outline')}
                    {renderImageUpload('license_image', 'صورة رخصة القيادة', 'document-text-outline')}
                    {renderImageUpload('target_image', 'صورة الهوية', 'card-outline')}
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