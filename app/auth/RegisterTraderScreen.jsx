import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { router } from 'expo-router';
import axios from '../../utils/axios';

const GREEN = '#34D399';

export default function RegisterTraderScreen() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        password_confirmation: '',
        trader_name: '',
        city: '',
        address: '',
        phone_number: '',
        traderTypeId: '1',
        location_latitude: 32.8872,  // Tripoli latitude
        location_longitude: 13.1913, // Tripoli longitude
        logo: null,
        license: null,
    });

    const [mapRegion, setMapRegion] = useState({
        latitude: 32.8872,  // Tripoli latitude
        longitude: 13.1913, // Tripoli longitude
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [markerCoordinate, setMarkerCoordinate] = useState({
        latitude: 32.8872,  // Tripoli latitude
        longitude: 13.1913, // Tripoli longitude
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
        
        if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'البريد الإلكتروني غير صالح';
        
        if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
        else if (formData.password.length < 8) newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
        
        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'كلمات المرور غير متطابقة';
        }
        
        if (!formData.trader_name) newErrors.trader_name = 'اسم المتجر مطلوب';
        if (!formData.city) newErrors.city = 'المدينة مطلوبة';
        if (!formData.address) newErrors.address = 'العنوان مطلوب';
        if (!formData.phone_number) newErrors.phone_number = 'رقم الهاتف مطلوب';
        if (!formData.logo) newErrors.logo = 'شعار المتجر مطلوب';
        if (!formData.license) newErrors.license = 'الرخصة التجارية مطلوبة';
        if (!formData.location_latitude) newErrors.location = 'الرجاء تحديد موقع المتجر على الخريطة';

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
                if (key === 'logo' || key === 'license') {
                    if (formData[key]) {
                        formDataToSend.append(key, {
                            uri: formData[key].uri,
                            type: 'image/jpeg',
                            name: 'image.jpg',
                        });
                    }
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            await axios.post('/new/trader', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            Alert.alert(
                'شكراً لك',
                'شكراً لتسجيلك في منصتنا. سنقوم بمراجعة حسابك وتفعيله في أقرب وقت ممكن. سنرسل لك إشعاراً عند اكتمال المراجعة.',
                [
                    {
                        text: 'حسناً',
                        onPress: () => router.replace('/auth/LoginScreen'),
                    },
                ]
            );

        } catch (error) {
            if (error.response?.data?.errors) {
                // Handle validation errors from the server
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

    const handleMapPress = (event) => {
        const { coordinate } = event.nativeEvent;
        setMarkerCoordinate(coordinate);
        setFormData(prev => ({
            ...prev,
            location_latitude: coordinate.latitude,
            location_longitude: coordinate.longitude,
        }));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>تسجيل حساب تاجر جديد</Text>
            </View>

            <View style={styles.form}>
                {/* Basic Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>المعلومات الأساسية</Text>
                    
                    <TextInput
                        style={[styles.input, errors.email && styles.inputError]}
                        placeholder="اسم المتجر"
                        value={formData.trader_name}
                        onChangeText={(text) => {
                            setFormData(prev => ({ ...prev, trader_name: text }));
                            setErrors(prev => ({ ...prev, trader_name: null }));
                        }}
                    />
                    {errors.trader_name && <Text style={styles.errorText}>{errors.trader_name}</Text>}

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

                {/* Contact Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>معلومات الاتصال</Text>
                    
                    <TextInput
                        style={[styles.input, errors.phone_number && styles.inputError]}
                        placeholder="رقم الهاتف"
                        value={formData.phone_number}
                        onChangeText={(text) => {
                            setFormData(prev => ({ ...prev, phone_number: text }));
                            setErrors(prev => ({ ...prev, phone_number: null }));
                        }}
                        keyboardType="phone-pad"
                    />
                    {errors.phone_number && <Text style={styles.errorText}>{errors.phone_number}</Text>}

                    <TextInput
                        style={[styles.input, errors.city && styles.inputError]}
                        placeholder="المدينة"
                        value={formData.city}
                        onChangeText={(text) => {
                            setFormData(prev => ({ ...prev, city: text }));
                            setErrors(prev => ({ ...prev, city: null }));
                        }}
                    />
                    {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

                    <TextInput
                        style={[styles.input, errors.address && styles.inputError]}
                        placeholder="العنوان"
                        value={formData.address}
                        onChangeText={(text) => {
                            setFormData(prev => ({ ...prev, address: text }));
                            setErrors(prev => ({ ...prev, address: null }));
                        }}
                        multiline
                    />
                    {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
                </View>

                {/* Location */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>موقع المتجر</Text>
                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            initialRegion={mapRegion}
                            onPress={handleMapPress}
                        >
                            {markerCoordinate && (
                                <Marker
                                    coordinate={markerCoordinate}
                                    title="موقع المتجر"
                                />
                            )}
                        </MapView>
                    </View>
                    <Text style={styles.mapHelper}>
                        اضغط على الخريطة لتحديد موقع المتجر
                    </Text>
                </View>

                {/* Documents */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>المستندات</Text>
                    
                    <TouchableOpacity 
                        style={[styles.uploadButton, errors.logo && styles.uploadButtonError]}
                        onPress={() => pickImage('logo')}
                    >
                        {formData.logo ? (
                            <Image source={{ uri: formData.logo.uri }} style={styles.uploadedImage} />
                        ) : (
                            <>
                                <Ionicons name="cloud-upload-outline" size={24} color={GREEN} />
                                <Text style={styles.uploadButtonText}>رفع شعار المتجر</Text>
                            </>
                        )}
                    </TouchableOpacity>
                    {errors.logo && <Text style={styles.errorText}>{errors.logo}</Text>}

                    <TouchableOpacity 
                        style={[styles.uploadButton, errors.license && styles.uploadButtonError]}
                        onPress={() => pickImage('license')}
                    >
                        {formData.license ? (
                            <Image source={{ uri: formData.license.uri }} style={styles.uploadedImage} />
                        ) : (
                            <>
                                <Ionicons name="document-outline" size={24} color={GREEN} />
                                <Text style={styles.uploadButtonText}>رفع الرخصة التجارية</Text>
                            </>
                        )}
                    </TouchableOpacity>
                    {errors.license && <Text style={styles.errorText}>{errors.license}</Text>}
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
        backgroundColor: GREEN,
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
    },
    mapContainer: {
        height: 200,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 8,
    },
    map: {
        flex: 1,
    },
    mapHelper: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'right',
        marginBottom: 15,
    },
    uploadButton: {
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    uploadedImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    uploadButtonText: {
        color: '#6B7280',
        marginTop: 10,
    },
    registerButton: {
        backgroundColor: GREEN,
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    registerButtonDisabled: {
        opacity: 0.7,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
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
    uploadButtonError: {
        borderWidth: 2,
        borderColor: '#EF4444',
    },
}); 