import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { CartContext } from '../../../contexts/CartContext';
import { Ionicons } from '@expo/vector-icons';
import logo from '../../../assets/images/logo.webp';

const GREEN = '#34D399';

const CartItem = ({ item, onRemove }) => (
    <View style={styles.cartItem}>
        <Image source={logo} style={styles.productImage} />
        <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.product.name}</Text>
            <Text style={styles.productPrice}>{item.product.price} ريال</Text>
            <Text style={styles.quantity}>الكمية: {item.quantity}</Text>
        </View>
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
            <Ionicons name="trash-outline" size={24} color="#FF4444" />
        </TouchableOpacity>
    </View>
);

const StoreSection = ({ storeId, storeData, onRemoveItem }) => (
    <View style={styles.storeSection}>
        <Text style={styles.storeName}>{storeData.storeName}</Text>
        <FlatList
            data={storeData.products}
            renderItem={({ item }) => (
                <CartItem
                    item={item}
                    onRemove={() => onRemoveItem(storeId, item.product.id)}
                />
            )}
            keyExtractor={item => item.product.id.toString()}
        />
    </View>
);

export default function CartScreen() {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const stores = Object.entries(cart);

    if (stores.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="cart-outline" size={64} color={GREEN} />
                <Text style={styles.emptyText}>السلة فارغة</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={stores}
            renderItem={({ item: [storeId, storeData] }) => (
                <StoreSection
                    storeId={storeId}
                    storeData={storeData}
                    onRemoveItem={removeFromCart}
                />
            )}
            keyExtractor={([storeId]) => storeId}
            contentContainerStyle={styles.container}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginTop: 16,
    },
    storeSection: {
        marginBottom: 24,
        backgroundColor: '#FFF',
        borderRadius: 12,
        padding: 16,
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: GREEN,
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
    },
    productPrice: {
        fontSize: 14,
        color: GREEN,
        marginTop: 4,
    },
    quantity: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    removeButton: {
        padding: 8,
    },
});

