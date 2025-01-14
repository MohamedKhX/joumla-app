import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from '../../../utils/axios';
import { LinearGradient } from 'expo-linear-gradient';

const GREEN = '#34D399';

const OrderItem = ({ item }) => {
    const [expanded, setExpanded] = useState(false);

    const getStatusColor = (state) => {
        switch (state) {
            case 'Pending':
                return { bg: '#FFF7ED', text: '#EA580C', dot: '#F97316' };
            case 'Rejected':
                return { bg: '#FEF2F2', text: '#DC2626', dot: '#EF4444' };
            case 'Cancelled':
                return { bg: '#FEF2F2', text: '#DC2626', dot: '#EF4444' };
            case 'Approved':
                return { bg: '#F0FDF4', text: '#16A34A', dot: '#22C55E' };
            case 'Shipped':
                return { bg: '#EFF6FF', text: '#2563EB', dot: '#3B82F6' };
            default:
                return { bg: '#F3F4F6', text: '#4B5563', dot: '#6B7280' };
        }

    };

    const getStatusText = (state) => {
        switch (state) {
            case 'Pending':
                return 'قيد الانتظار';
            case 'Rejected':
                return 'مرفوض';
            case 'Cancelled':
                return 'ملغي';
            case 'Approved':
                return 'مقبول';
            case 'Shipped':
                return 'تم الشحن';
            default:
                return state;
        }
    };

    const statusColors = getStatusColor(item.state);

    return (
        <View style={styles.orderItem}>
            <LinearGradient
                colors={['#FFFFFF', '#F8FAFC']}
                style={styles.orderGradient}
            >
                <View style={styles.orderHeader}>
                    <View style={styles.orderTopSection}>
                        <View style={styles.orderInfo}>
                            <View style={styles.storeInfoContainer}>
                                <View style={styles.storeIconContainer}>
                                    <Ionicons name="storefront" size={20} color={GREEN} />
                                </View>
                                <Text style={styles.storeName}>{item.store.name}</Text>
                            </View>
                            <View style={styles.dateContainer}>
                                <Ionicons name="calendar-outline" size={14} color="#666666" />
                                <Text style={styles.orderDate}>{item.date}</Text>
                            </View>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                            <View style={[styles.statusDot, { backgroundColor: statusColors.dot }]} />
                            <Text style={[styles.statusText, { color: statusColors.text }]}>
                                {getStatusText(item.state)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.orderSummary}>
                        <View style={styles.totalContainer}>
                            <Text style={styles.totalAmount}>
                                {item.total_amount} دينار
                            </Text>
                            <Text style={styles.totalLabel}>المجموع:</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.expandButton}
                            activeOpacity={0.7}
                            onPress={() => setExpanded(!expanded)}
                        >
                            <Text style={styles.expandButtonText}>
                                {expanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                            </Text>
                            <Ionicons 
                                name={expanded ? "chevron-up" : "chevron-down"} 
                                size={20} 
                                color={GREEN}
                                style={styles.expandIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {expanded && (
                    <View style={styles.orderDetails}>
                        {item.items.map((product, index) => (
                            <View key={index} style={styles.productItem}>
                                <View style={styles.productImagePlaceholder}>
                                    <LinearGradient
                                        colors={[GREEN + '20', GREEN + '10']}
                                        style={styles.productIconGradient}
                                    >
                                        <Ionicons name="cube-outline" size={24} color={GREEN} />
                                    </LinearGradient>
                                </View>
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName}>{product.product_name}</Text>
                                    <View style={styles.productMetaInfo}>
                                        <View style={styles.quantityContainer}>
                                            <Ionicons name="layers-outline" size={14} color="#6B7280" />
                                            <Text style={styles.quantity}>الكمية: {product.quantity}</Text>
                                        </View>
                                        <Text style={styles.price}>{product.price} دينار</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                        <View style={styles.orderFooter}>
                            <LinearGradient
                                colors={['#F8FAFC', '#FFFFFF']}
                                style={styles.totalGradient}
                            >
                                <Text style={styles.orderTotal}>
                                    المجموع النهائي: {item.total_amount} دينار
                                </Text>
                            </LinearGradient>
                        </View>
                    </View>
                )}
            </LinearGradient>
        </View>
    );
};

export default function OrdersScreen() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadOrders = async () => {
        try {
            const { data } = await axios.get('/trader/orders');
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders:', error);
            Alert.alert(
                'خطأ',
                error.response.data.message,
                [{ text: 'حسناً', style: 'default' }]
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={GREEN} />
            </View>
        );
    }

    return (
        <FlatList
            data={orders}
            renderItem={({ item }) => <OrderItem item={item} />}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.container}
            refreshing={refreshing}
            onRefresh={() => {
                setRefreshing(true);
                loadOrders();
            }}
            ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                    <Ionicons name="receipt-outline" size={64} color={GREEN} />
                    <Text style={styles.emptyText}>لا توجد طلبات</Text>
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        paddingBottom: 100,
        backgroundColor: '#F5F7FA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        backgroundColor: '#F5F7FA',
    },
    emptyText: {
        fontSize: 18,
        color: '#666666',
        marginTop: 16,
        fontWeight: '500',
    },
    orderItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
    },
    orderGradient: {
        padding: 20,
    },
    storeInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    storeIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: GREEN + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginLeft: 8,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    totalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    totalLabel: {
        fontSize: 16,
        color: '#6B7280',
    },
    productIconGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    totalGradient: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    orderTopSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    orderInfo: {
        flex: 1,
        marginRight: 10,
    },
    storeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'right',
        marginBottom: 5,
    },
    orderDate: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'right',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        minWidth: 100,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
    },
    orderSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: GREEN,
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: GREEN + '15',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        justifyContent: 'center',
    },
    expandButtonText: {
        color: GREEN,
        marginRight: 5,
        fontSize: 14,
        fontWeight: '600',
    },
    orderDetails: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    productImagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 12,
        overflow: 'hidden',
        marginLeft: 15,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        color: '#1F2937',
        textAlign: 'right',
        marginBottom: 5,
        fontWeight: '500',
    },
    productMetaInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quantity: {
        fontSize: 14,
        color: '#6B7280',
    },
    price: {
        fontSize: 15,
        color: GREEN,
        fontWeight: '600',
    },
    orderFooter: {
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        alignItems: 'flex-end',
    },
    orderTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    expandIcon: {
        marginRight: 4,
    },
});

