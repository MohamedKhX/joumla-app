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
const LIGHT_GREEN = '#E8FDF5';

const ProductItem = ({ item, onAddToCart }) => (
    <View style={styles.productItem}>
        <Image 
            source={logo} 
            style={styles.productImage}
        />
        <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDescription}>{item.description}</Text>
            <Text style={styles.productPrice}>{item.price} ريال</Text>
            <TouchableOpacity 
                style={styles.addToCartButton}
                onPress={() => onAddToCart(item)}
            >
                <Ionicons name="cart-outline" size={20} color="#FFFFFF" />
                <Text style={styles.addToCartText}>إضافة للسلة</Text>
            </TouchableOpacity>
        </View>
    </View>
);

export default function ProductScreen() {
    const { id: storeId, storeName } = useLocalSearchParams();
    const { addToCart } = useContext(CartContext);
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
        addToCart(storeId, storeName, product);
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
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
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
    productsList: {
        padding: 20,
    },
    productItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginBottom: 20,
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
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginLeft: 15,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 5,
        fontFamily: 'Arial',
        textAlign: 'right',
    },
    productDescription: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 10,
        fontFamily: 'Arial',
        textAlign: 'right',
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: GREEN,
        marginBottom: 10,
        fontFamily: 'Arial',
        textAlign: 'right',
    },
    addToCartButton: {
        flexDirection: 'row',
        backgroundColor: GREEN,
        borderRadius: 8,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addToCartText: {
        color: '#FFFFFF',
        marginRight: 5,
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Arial',
    },
});

