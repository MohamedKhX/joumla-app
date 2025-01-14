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
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import axios from '../../utils/axios';
import logo from '../../assets/images/logo.webp';
import { CartContext } from '../../contexts/CartContext';

// Force RTL layout
I18nManager.forceRTL(true);

const { width } = Dimensions.get('window');
const GREEN = '#34D399';

const ProductItem = ({ item, onAddToCart }) => (
    <View style={styles.productItem}>
        <View style={styles.productHeader}>
            <Image 
                source={logo} 
                style={styles.productImage}
            />
            <View style={styles.mainInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price} دينار</Text>
            </View>
        </View>
        <Text style={styles.productDescription}>{item.description}</Text>
        <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={() => onAddToCart(item)}
        >
            <Ionicons name="cart-outline" size={20} color="#FFFFFF" />
            <Text style={styles.addToCartText}>إضافة للسلة</Text>
        </TouchableOpacity>
    </View>
);

export default function ProductScreen() {
    const { id: storeId, storeName } = useLocalSearchParams();
    const cartContext = useContext(CartContext);
    const { addToCart } = cartContext;

    // Add debug log
    console.log('Cart Context:', cartContext);
    console.log('Store params:', { storeId, storeName });

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProducts();
    }, [storeId]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/wholesale-stores/${storeId}/products`);
            setProducts(data);
        } catch (error) {
            console.error('Error loading products:', error);
            setError('حدث خطأ في تحميل المنتجات');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (product) => {
        addToCart(storeId, storeName, product)
        Alert.alert('نجاح', 'تمت إضافة المنتج إلى السلة');
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
            <View style={styles.storeHeader}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-forward" size={24} color={GREEN} />
                </TouchableOpacity>
                <Text style={styles.storeName}>{storeName}</Text>
            </View>
            
            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <FlatList
                    data={products}
                    renderItem={({ item }) => (
                        <ProductItem 
                            item={item}
                            onAddToCart={handleAddToCart}
                        />
                    )}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.productsList}
                    refreshing={loading}
                    onRefresh={loadProducts}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    storeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        paddingTop: 50,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    backButton: {
        padding: 5,
    },
    storeName: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'center',
        marginRight: 40,
    },
    productsList: {
        padding: 15,
    },
    productItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginBottom: 15,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    productHeader: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginLeft: 15,
    },
    mainInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 5,
        textAlign: 'right',
    },
    productDescription: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 15,
        lineHeight: 20,
        textAlign: 'right',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: GREEN,
        textAlign: 'right',
    },
    addToCartButton: {
        flexDirection: 'row',
        backgroundColor: GREEN,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addToCartText: {
        color: '#FFFFFF',
        marginRight: 8,
        fontSize: 14,
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
});

