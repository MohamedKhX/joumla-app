import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    StatusBar,
    I18nManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Force RTL layout
I18nManager.forceRTL(true);

const GREEN = '#34D399';
const LIGHT_GREEN = '#E8FDF5';

// Sample order details data
const orderDetailsScreen = {
    id: '2',
    date: '2023-06-05',
    total: 2200,
    status: 'قيد الشحن',
    items: [
        { id: '1', name: 'قميص قطني', price: 45, quantity: 2, image: '/placeholder.svg?height=80&width=80' },
        { id: '2', name: 'بنطلون جينز', price: 60, quantity: 1, image: '/placeholder.svg?height=80&width=80' },
        { id: '3', name: 'حذاء رياضي', price: 80, quantity: 1, image: '/placeholder.svg?height=80&width=80' },
    ],
};

const OrderItem = ({ item }) => (
    <View style={styles.orderItem}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price} دينار</Text>
            <Text style={styles.itemQuantity}>الكمية: {item.quantity}</Text>
        </View>
    </View>
);

export default function OrderDetailsScreen() {
    //const { orderId } = route.params;
    // In a real app, you would fetch the order details based on the orderId
    const order = orderDetailsScreen;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>تفاصيل الطلب</Text>
            </View>
            <ScrollView style={styles.content}>
                <View style={styles.orderSummary}>
                    <Text style={styles.orderNumber}>طلب رقم #{order.id}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                    <Text style={styles.orderStatus}>{order.status}</Text>
                </View>
                <View style={styles.itemsContainer}>
                    <Text style={styles.sectionTitle}>المنتجات</Text>
                    {order.items.map(item => (
                        <OrderItem key={item.id} item={item} />
                    ))}
                </View>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>الإجمالي:</Text>
                    <Text style={styles.totalAmount}>{order.total} دينار</Text>
                </View>
            </ScrollView>
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Arial',
        flex: 1,
        textAlign: 'center',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    orderSummary: {
        backgroundColor: LIGHT_GREEN,
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
    },
    orderNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        fontFamily: 'Arial',
        marginBottom: 5,
        textAlign: 'right',
    },
    orderDate: {
        fontSize: 16,
        color: '#666666',
        fontFamily: 'Arial',
        marginBottom: 5,
        textAlign: 'right',
    },
    orderStatus: {
        fontSize: 16,
        fontWeight: 'bold',
        color: GREEN,
        fontFamily: 'Arial',
        textAlign: 'right',
    },
    itemsContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        fontFamily: 'Arial',
        marginBottom: 10,
        textAlign: 'right',
    },
    orderItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEEEEE',
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
    itemQuantity: {
        fontSize: 14,
        color: '#666666',
        fontFamily: 'Arial',
        textAlign: 'right',
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        paddingTop: 15,
    },
    totalLabel: {
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
});

