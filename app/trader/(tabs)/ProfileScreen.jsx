import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    I18nManager,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AuthContext from '../../../contexts/AuthContext';
import axios from '../../../utils/axios';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';

// Force RTL layout
I18nManager.forceRTL(true);

const GREEN = '#34D399';

export default function ProfileScreen() {
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [errors, setErrors] = useState({});
    
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        phone: '',
        location_latitude: 32.8872,
        location_longitude: 13.1913,
        logo: null,
        user: {
            name: '',
            email: '',
            phone: '',
        }
    });

    const [mapRegion, setMapRegion] = useState({
        latitude: 32.8872,
        longitude: 13.1913,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useEffect(() => {
        if (user?.trader?.id) {
            loadTraderProfile();
        } else {
            setLoading(false);
        }
    }, [user]);

    const loadTraderProfile = async () => {
        try {
            if (!user?.trader?.id) {
                console.error('No trader ID found');
                Alert.alert('خطأ', 'لم يتم العثور على بيانات المتجر');
                return;
            }

            const { data } = await axios.get(`/traders/${user.trader.id}`);
            console.log('Trader data:', data);

            setFormData({
                name: data.store_name,
                address: data.address,
                city: data.city,
                phone: data.phone,
                location_latitude: data.location.latitude,
                location_longitude: data.location.longitude,
                logo: data.logo,
                user: {
                    name: data.user.name,
                    email: data.user.email,
                    phone: data.user.phone || '',
                }
            });

            setMapRegion({
                latitude: parseFloat(data.location.latitude) || 32.8872,
                longitude: parseFloat(data.location.longitude) || 13.1913,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });

        } catch (error) {
            console.error('Error loading profile:', error);
            Alert.alert('خطأ', 'حدث خطأ في تحميل البيانات');
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setFormData(prev => ({
                ...prev,
                logo: result.assets[0],
            }));
        }
    };

    const handleMapPress = (event) => {
        const { coordinate } = event.nativeEvent;
        setFormData(prev => ({
            ...prev,
            location_latitude: coordinate.latitude,
            location_longitude: coordinate.longitude,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name) newErrors.name = 'اسم المتجر مطلوب';
        if (!formData.address) newErrors.address = 'العنوان مطلوب';
        if (!formData.city) newErrors.city = 'المدينة مطلوبة';
        if (!formData.phone) newErrors.phone = 'رقم الهاتف مطلوب';
        if (!formData.user.email) newErrors.email = 'البريد الإلكتروني مطلوب';
        if (!formData.user.name) newErrors.userName = 'اسم المستخدم مطلوب';
        if (!formData.user.phone) newErrors.userPhone = 'رقم الهاتف مطلوب';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async () => {
        if (!validateForm()) {
            Alert.alert('خطأ', 'الرجاء تصحيح الأخطاء وملء جميع الحقول المطلوبة');
            return;
        }

        try {
            setUpdating(true);

            // Create request data
            const requestData = {
                store_name: formData.name,
                address: formData.address,
                city: formData.city,
                phone: formData.phone,
                location_latitude: formData.location_latitude,
                location_longitude: formData.location_longitude,
                user: {
                    name: formData.user.name,
                    email: formData.user.email,
                    phone: formData.user.phone,
                }
            };

            // If there's a new logo, send it separately
            if (formData.logo?.uri) {
                const logoFormData = new FormData();
                logoFormData.append('logo', {
                    uri: formData.logo.uri,
                    type: 'image/jpeg',
                    name: 'logo.jpg',
                });
                await axios.post(`/traders/${user.trader.id}/update-logo`, logoFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            // Send the main update request
            await axios.put(`/traders/${user.trader.id}`, requestData);

            Alert.alert('نجاح', 'تم تحديث البيانات بنجاح');
            
            // Update user context
            setUser({
                ...user,
                name: formData.user.name,
                email: formData.user.email,
                phone: formData.user.phone,
            });

        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).flat();
                Alert.alert('خطأ', errorMessages.join('\n'));
            } else {
                Alert.alert('خطأ', error.response?.data?.message || 'حدث خطأ في تحديث البيانات');
            }
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={GREEN} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <LinearGradient
                colors={[GREEN, GREEN + 'DD']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>الملف الشخصي</Text>
                <Text style={styles.headerSubtitle}>تحديث بيانات المتجر</Text>
            </LinearGradient>

            <View style={styles.formContainer}>
                {/* Store Information Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>معلومات المتجر</Text>
                    
                    <TextInput
                        style={[styles.input, errors.name && styles.inputError]}
                        value={formData.name}
                        onChangeText={(text) => {
                            setFormData(prev => ({ ...prev, name: text }));
                            setErrors(prev => ({ ...prev, name: null }));
                        }}
                        placeholder="اسم المتجر"
                        textAlign="right"
                    />
                    {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                    <TextInput
                        style={[styles.input, errors.city && styles.inputError]}
                        value={formData.city}
                        onChangeText={(text) => {
                            setFormData(prev => ({ ...prev, city: text }));
                            setErrors(prev => ({ ...prev, city: null }));
                        }}
                        placeholder="المدينة"
                        textAlign="right"
                    />
                    {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

                    <TextInput
                        style={[styles.input, errors.address && styles.inputError]}
                        value={formData.address}
                        onChangeText={(text) => {
                            setFormData(prev => ({ ...prev, address: text }));
                            setErrors(prev => ({ ...prev, address: null }));
                        }}
                        placeholder="العنوان"
                        textAlign="right"
                        multiline
                    />
                    {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

                    <TextInput
                        style={[styles.input, errors.phone && styles.inputError]}
                        value={formData.phone}
                        onChangeText={(text) => {
                            setFormData(prev => ({ ...prev, phone: text }));
                            setErrors(prev => ({ ...prev, phone: null }));
                        }}
                        placeholder="رقم الهاتف"
                        textAlign="right"
                        keyboardType="phone-pad"
                    />
                    {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                </View>

                {/* User Information Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>معلومات المستخدم</Text>
                    
                    <TextInput
                        style={[styles.input, errors.userName && styles.inputError]}
                        value={formData.user.name}
                        onChangeText={(text) => {
                            setFormData(prev => ({
                                ...prev,
                                user: { ...prev.user, name: text }
                            }));
                            setErrors(prev => ({ ...prev, userName: null }));
                        }}
                        placeholder="الاسم الكامل"
                        textAlign="right"
                    />
                    {errors.userName && <Text style={styles.errorText}>{errors.userName}</Text>}

                    <TextInput
                        style={[styles.input, errors.email && styles.inputError]}
                        value={formData.user.email}
                        onChangeText={(text) => {
                            setFormData(prev => ({
                                ...prev,
                                user: { ...prev.user, email: text }
                            }));
                            setErrors(prev => ({ ...prev, email: null }));
                        }}
                        placeholder="البريد الإلكتروني"
                        textAlign="right"
                        keyboardType="email-address"
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                    <TextInput
                        style={[styles.input, errors.userPhone && styles.inputError]}
                        value={formData.user.phone}
                        onChangeText={(text) => {
                            setFormData(prev => ({
                                ...prev,
                                user: { ...prev.user, phone: text }
                            }));
                            setErrors(prev => ({ ...prev, userPhone: null }));
                        }}
                        placeholder="رقم الهاتف"
                        textAlign="right"
                        keyboardType="phone-pad"
                    />
                    {errors.userPhone && <Text style={styles.errorText}>{errors.userPhone}</Text>}
                </View>

                {/* Location Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>موقع المتجر</Text>
                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            initialRegion={mapRegion}
                            onPress={handleMapPress}
                        >
                            <Marker
                                coordinate={{
                                    latitude: formData.location_latitude,
                                    longitude: formData.location_longitude,
                                }}
                                title="موقع المتجر"
                            />
                        </MapView>
                    </View>
                    <Text style={styles.mapHelper}>
                        اضغط على الخريطة لتحديث موقع المتجر
                    </Text>
                </View>

                {/* Logo Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>شعار المتجر</Text>
                    
                    <TouchableOpacity 
                        style={styles.uploadButton}
                        onPress={pickImage}
                    >
                        {formData.logo ? (
                            <Image 
                                source={{ uri: formData.logo.uri || formData.logo }} 
                                style={styles.uploadedImage} 
                            />
                        ) : (
                            <>
                                <Ionicons name="cloud-upload-outline" size={24} color={GREEN} />
                                <Text style={styles.uploadButtonText}>تحديث شعار المتجر</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    style={[styles.updateButton, updating && styles.updateButtonDisabled]}
                    onPress={handleUpdate}
                    disabled={updating}
                >
                    {updating ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.updateButtonText}>تحديث البيانات</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 30,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'right',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        opacity: 0.9,
        marginTop: 5,
        textAlign: 'right',
    },
    formContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        margin: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
        textAlign: 'right',
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
        color: '#1F2937',
    },
    inputError: {
        borderColor: '#EF4444',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: -8,
        marginBottom: 8,
        textAlign: 'right',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    mapContainer: {
        height: 200,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 8,
    },
    map: {
        flex: 1,
    },
    mapHelper: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'right',
    },
    uploadButton: {
        borderWidth: 2,
        borderColor: GREEN,
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadButtonError: {
        borderColor: '#EF4444',
    },
    uploadButtonText: {
        color: GREEN,
        fontSize: 16,
        marginTop: 8,
    },
    uploadedImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    updateButton: {
        backgroundColor: GREEN,
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    updateButtonDisabled: {
        opacity: 0.7,
    },
    updateButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
}); 