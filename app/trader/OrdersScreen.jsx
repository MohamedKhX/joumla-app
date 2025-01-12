import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    I18nManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {router} from "expo-router";

// Force RTL layout
I18nManager.forceRTL(true);

const GREEN = '#34D399';
const LIGHT_GREEN = '#E8FDF5';

// Sample orders data
const ordersScreen = [
    { id: '1', date: '2023-06-01', total: 1500, status: 'تم التسليم', items: 5 },
    { id: '2', date: '2023-06-05', total: 2200, status: 'قيد الشحن', items: 8 },
    { id: '3', date: '2023-06-10', total: 800, status: 'تم التأكيد', items: 3 },
    { id: '4', date: '2023-06-15', total: 3000, status: 'بانتظار الدفع', items: 12 },
];

const getStatusColor = (status) => {
    switch (status) {
        case 'تم التسليم':
            return '#4CAF50';
        case 'قيد الشحن':
            return '#2196F3';
        case 'تم التأكيد':
            return '#FF9800';
        case 'بانتظار الدفع':
            return '#F44336';
        default:
            return '#757575';
    }
};

const OrderItem = ({ order, onPress }) => (
    <TouchableOpacity style={styles.orderItem} onPress={onPress}>
        <View style={styles.orderHeader}>
            <Text style={styles.orderDate}>{order.date}</Text>
            <Text style={styles.orderNumber}>طلب رقم #{order.id}</Text>
        </View>
        <View style={styles.orderDetails}>
            <Text style={styles.orderTotal}>{order.total} ريال</Text>
            <Text style={styles.orderItemsCount}>{order.items} منتجات</Text>
        </View>
        <View style={styles.orderStatus}>
            <Text style={[styles.orderStatusText, { color: getStatusColor(order.status) }]}>
                {order.status}
            </Text>
        </View>
        <Ionicons name="chevron-back" size={24} color="#757575" style={styles.chevron} />
    </TouchableOpacity>
);

export default function OrdersScreen({ navigation }) {
    const handleOrderPress = (order) => {
        router.push('/trader/OrderDetailsScreen', { orderId: order.id });
        //navigation.navigate('OrderDetails', { orderId: order.id });
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>طلباتي</Text>
            </View>
            <FlatList
                data={ordersScreen}
                renderItem={({ item }) => <OrderItem order={item} onPress={() => handleOrderPress(item)} />}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.ordersList}
            />
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
    ordersList: {
        padding: 20,
    },
    orderItem: {
        backgroundColor: LIGHT_GREEN,
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    orderHeader: {
        flex: 1,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        fontFamily: 'Arial',
        marginBottom: 5,
        textAlign: 'right',
    },
    orderDate: {
        fontSize: 14,
        color: '#666666',
        fontFamily: 'Arial',
        marginBottom: 5,
        textAlign: 'right',
    },
    orderDetails: {
        flex: 1,
        alignItems: 'flex-end',
    },
    orderTotal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: GREEN,
        fontFamily: 'Arial',
        marginBottom: 5,
    },
    orderItemsCount: {
        fontSize: 14,
        color: '#666666',
        fontFamily: 'Arial',
    },
    orderStatus: {
        marginLeft: 10,
    },
    orderStatusText: {
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Arial',
    },
    chevron: {
        marginRight: 10,
    },
});

