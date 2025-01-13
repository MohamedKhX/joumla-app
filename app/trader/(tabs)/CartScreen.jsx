import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    I18nManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import logo from '../../../assets/images/logo.webp';

// Force RTL layout
I18nManager.forceRTL(true);

const { width } = Dimensions.get('window');
const GREEN = '#34D399';
const LIGHT_GREEN = '#E8FDF5';

// Sample cart data
const cartData = [
    {
        storeName: 'متجر الجملة الأول',
        items: [
            { id: '1', name: 'قميص قطني', price: 45, quantity: 2, image: logo },
            { id: '2', name: 'بنطلون جينز', price: 60, quantity: 1, image: logo },
        ],
    },
    {
        storeName: 'سوق الجملة الكبير',
        items: [
            { id: '3', name: 'حذاء رياضي', price: 80, quantity: 1, image: logo },
            { id: '4', name: 'حقيبة ظهر', price: 55, quantity: 3, image: logo },
        ],
    },
];

const CartItem = ({ item, onIncrement, onDecrement, onRemove }) => (
    <View style={styles.cartItem}>
        <Image source={ item.image } style={styles.itemImage} />
        <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price} ريال</Text>
            <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={onDecrement} style={styles.quantityButton}>
                    <Ionicons name="remove" size={20} color={GREEN} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{item.quantity}</Text>
                <TouchableOpacity onPress={onIncrement} style={styles.quantityButton}>
                    <Ionicons name="add" size={20} color={GREEN} />
                </TouchableOpacity>
            </View>
        </View>
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
    </View>
);

export default function CartScreen() {
    const [cart, setCart] = useState(cartData);

    const handleIncrement = (storeIndex, itemId) => {
        const newCart = [...cart];
        const item = newCart[storeIndex].items.find(i => i.id === itemId);
        if (item) item.quantity += 1;
        setCart(newCart);
    };

    const handleDecrement = (storeIndex, itemId) => {
        const newCart = [...cart];
        const item = newCart[storeIndex].items.find(i => i.id === itemId);
        if (item && item.quantity > 1) item.quantity -= 1;
        setCart(newCart);
    };

    const handleRemove = (storeIndex, itemId) => {
        const newCart = [...cart];
        newCart[storeIndex].items = newCart[storeIndex].items.filter(i => i.id !== itemId);
        if (newCart[storeIndex].items.length === 0) {
            newCart.splice(storeIndex, 1);
        }
        setCart(newCart);
    };

    const calculateTotal = () => {
        return cart.reduce((total, store) => {
            return total + store.items.reduce((storeTotal, item) => {
                return storeTotal + item.price * item.quantity;
            }, 0);
        }, 0);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>سلة التسوق</Text>
            </View>
            <ScrollView style={styles.cartContainer}>
                {cart.map((store, storeIndex) => (
                    <View key={store.storeName} style={styles.storeSection}>
                        <Text style={styles.storeName}>{store.storeName}</Text>
                        {store.items.map(item => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onIncrement={() => handleIncrement(storeIndex, item.id)}
                                onDecrement={() => handleDecrement(storeIndex, item.id)}
                                onRemove={() => handleRemove(storeIndex, item.id)}
                            />
                        ))}
                    </View>
                ))}
            </ScrollView>
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>الإجمالي:</Text>
                <Text style={styles.totalAmount}>{calculateTotal()} ريال</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton}>
                <Text style={styles.checkoutButtonText}>إتمام الشراء</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor: GREEN,
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Arial',
        textAlign: 'center',
    },
    cartContainer: {
        flex: 1,
        padding: 20,
    },
    storeSection: {
        marginBottom: 20,
        backgroundColor: LIGHT_GREEN,
        borderRadius: 15,
        padding: 15,
    },
    storeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        fontFamily: 'Arial',
        marginBottom: 10,
        textAlign: 'right',
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginLeft: 10,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        fontFamily: 'Arial',
        marginBottom: 5,
        textAlign: 'right',
    },
    itemPrice: {
        fontSize: 14,
        color: GREEN,
        fontFamily: 'Arial',
        marginBottom: 5,
        textAlign: 'right',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    quantityButton: {
        backgroundColor: LIGHT_GREEN,
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        fontFamily: 'Arial',
        marginHorizontal: 10,
    },
    removeButton: {
        padding: 5,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        fontFamily: 'Arial',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: GREEN,
        fontFamily: 'Arial',
    },
    checkoutButton: {
        backgroundColor: GREEN,
        margin: 20,
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Arial',
    },
});

