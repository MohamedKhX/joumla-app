import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ScrollView,
} from 'react-native';
import { CartContext } from '../../../contexts/CartContext';
import { Ionicons } from '@expo/vector-icons';
import logo from '../../../assets/images/logo.webp';

const GREEN = '#34D399';

const CartItem = ({ item, onRemove }) => (
    <View style={styles.cartItem}>
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
            <Ionicons name="trash-outline" size={24} color="#FF4444" />
        </TouchableOpacity>
        <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.product.name}</Text>
            <Text style={styles.productPrice}>{item.product.price} ريال</Text>
            <Text style={styles.quantity}>الكمية: {item.quantity}</Text>
        </View>
        <Image source={logo} style={styles.productImage} />
    </View>
);

const StoreSection = ({ storeId, storeData, onRemoveItem }) => (
    <View style={styles.storeSection}>
        <Text style={styles.storeName}>{storeData.storeName}</Text>
        {storeData.products.map((item) => (
            <CartItem
                key={item.product.id}
                item={item}
                onRemove={() => onRemoveItem(storeId, item.product.id)}
            />
        ))}
        <View style={styles.storeTotalContainer}>
            <Text style={styles.storeTotalText}>
                المجموع: {storeData.products.reduce((total, item) => 
                    total + (parseFloat(item.product.price) * item.quantity), 0
                ).toFixed(2)} ريال
            </Text>
        </View>
    </View>
);

export default function CartScreen() {
    const cartContext = useContext(CartContext);
    const { cart, removeFromCart, clearCart } = cartContext;
    console.log('Cart Screen - Current cart:', cart); // Debug log
    
    const stores = Object.entries(cart);
    console.log('Stores in cart:', stores); // Debug log

    if (stores.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="cart-outline" size={64} color={GREEN} />
                <Text style={styles.emptyText}>السلة فارغة</Text>
            </View>
        );
    }

    const totalAmount = stores.reduce((total, [_, storeData]) => 
        total + storeData.products.reduce((storeTotal, item) => 
            storeTotal + (parseFloat(item.product.price) * item.quantity), 0
        ), 0
    );

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {stores.map(([storeId, storeData]) => (
                    <StoreSection
                        key={storeId}
                        storeId={storeId}
                        storeData={storeData}
                        onRemoveItem={removeFromCart}
                    />
                ))}
            </ScrollView>
            <View style={styles.footer}>
                <Text style={styles.totalAmount}>
                    المجموع الكلي: {totalAmount.toFixed(2)} ريال
                </Text>
                <TouchableOpacity style={styles.checkoutButton}>
                    <Text style={styles.checkoutButtonText}>إتمام الطلب</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContent: {
        padding: 15,
        paddingBottom: 100,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    emptyText: {
        fontSize: 18,
        color: '#666666',
        marginTop: 16,
    },
    storeSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    storeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: GREEN,
        marginBottom: 15,
        textAlign: 'right',
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    productInfo: {
        flex: 1,
        marginHorizontal: 15,
        alignItems: 'flex-end',
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333333',
        textAlign: 'right',
    },
    productPrice: {
        fontSize: 14,
        color: GREEN,
        marginTop: 4,
    },
    quantity: {
        fontSize: 14,
        color: '#666666',
        marginTop: 4,
    },
    removeButton: {
        padding: 5,
    },
    storeTotalContainer: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    storeTotalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'right',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'right',
        marginBottom: 10,
    },
    checkoutButton: {
        backgroundColor: GREEN,
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

