import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    I18nManager,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from '../../../utils/axios';
import logo from '../../../assets/images/logo.webp';
import AuthContext from '../../../contexts/AuthContext';
import { logout } from '../../../services/AuthService';

// Force RTL layout
I18nManager.forceRTL(true);

const { width } = Dimensions.get('window');
const GREEN = '#34D399';
const LIGHT_GREEN = '#E8FDF5';

const StoreItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.storeItem} onPress={onPress}>
        <Image 
            source={item.image ? { uri: item.image } : logo} 
            style={styles.storeImage} 
        />
        <View style={styles.storeInfo}>
            <Text style={styles.storeName}>{item.name}</Text>
            <Text style={styles.storeAddress}>{item.address}</Text>
            <Text style={styles.storeDescription}>{item.description}</Text>
            <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{item.rating || 4.5}</Text>
                <Ionicons name="star" size={16} color={GREEN} />
            </View>
        </View>
    </TouchableOpacity>
);

export default function WholesaleStoresScreen() {
    const { setUser } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        loadStores();
    }, []);

    const loadStores = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/wholesale-stores');
            setStores(data);
        } catch (error) {
            console.error('Error loading stores:', error);
            setError('حدث خطأ في تحميل المتاجر');
        } finally {
            setLoading(false);
        }
    };

    const filteredStores = stores.filter(store =>
        store.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStorePress = (store) => {
        console.log('Navigating to store:', store);
        router.push({
            pathname: "/trader/ProductScreen",
            params: { 
                id: store.id,
                storeName: store.name
            }
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={GREEN} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <View style={styles.headerTop}>

                    <Text style={styles.headerTitle}>متاجر الجملة</Text>
                </View>
                <Text style={styles.headerSubtitle}>اكتشف أفضل متاجر الجملة في مدينتك</Text>
            </View>
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={24} color="#666666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="ابحث عن المتاجر"
                    placeholderTextColor="#666666"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    textAlign="right"
                />
            </View>
            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <FlatList
                    data={filteredStores}
                    renderItem={({ item }) => (
                        <StoreItem 
                            item={item} 
                            onPress={() => handleStorePress(item)}
                        />
                    )}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    refreshing={loading}
                    onRefresh={loadStores}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        padding: 25,
        paddingTop: 70,
        backgroundColor: GREEN,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'Arial',
        textAlign: 'right',
    },
    headerSubtitle: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: 'Arial',
        marginTop: 8,
        textAlign: 'right',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 25,
        margin: 20,
        paddingHorizontal: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    searchIcon: {
        marginLeft: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 10,
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#333333',
    },
    listContainer: {
        padding: 20,
    },
    storeItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginBottom: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4.65,
        elevation: 6,
    },
    storeImage: {
        width: 100,
        height: 100,
        borderRadius: 15,
        marginLeft: 20,
    },
    storeInfo: {
        flex: 1,
    },
    storeName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 6,
        fontFamily: 'Arial',
        textAlign: 'right',
    },
    storeAddress: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 8,
        fontFamily: 'Arial',
        textAlign: 'right',
    },
    storeDescription: {
        fontSize: 14,
        color: '#444444',
        marginBottom: 10,
        fontFamily: 'Arial',
        lineHeight: 20,
        textAlign: 'right',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    ratingText: {
        fontSize: 14,
        color: '#333333',
        marginRight: 4,
        fontFamily: 'Arial',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#FF3B30',
        textAlign: 'center',
        margin: 20,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    logoutText: {
        color: '#FFFFFF',
        fontFamily: 'Arial',
        fontSize: 16,
        marginRight: 8,
    },
    logoutButtonDisabled: {
        opacity: 0.7,
    },
});

