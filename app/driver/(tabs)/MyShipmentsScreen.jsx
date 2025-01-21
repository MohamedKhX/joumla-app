import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from '../../../utils/axios';
import AuthContext from '../../../contexts/AuthContext';
import { ShipmentStateEnum, getStatusColor } from '../../../utils/shipmentStates';

const GREEN = '#34D399';

const ShipmentItem = ({ shipment, onComplete, onCancel }) => {
    const openMap = (latitude, longitude) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(url);
    };

    const statusColors = getStatusColor(shipment.state);

    return (
        <View style={styles.shipmentItem}>
            <LinearGradient
                colors={[statusColors.bg, statusColors.bg + '05']}
                style={styles.shipmentContent}
            >
                <View style={styles.shipmentHeader}>
                    <View style={styles.traderInfo}>
                        <Text style={styles.traderName}>{shipment.trader.name}</Text>
                        <Text style={styles.shipmentDate}>{shipment.date}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                            <View style={[styles.statusDot, { backgroundColor: statusColors.dot }]} />
                            <Text style={[styles.statusText, { color: statusColors.text }]}>
                                {ShipmentStateEnum[shipment.state]}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.mapButton}
                        onPress={() => openMap(shipment.trader.location.latitude, shipment.trader.location.longitude)}
                    >
                        <Ionicons name="location-outline" size={24} color={GREEN} />
                    </TouchableOpacity>
                </View>

                <View style={styles.ordersList}>
                    {shipment.orders.map((order, index) => (
                        <View key={order.id} style={styles.orderItem}>
                            <Text style={styles.storeName}>{order.store_name}</Text>
                            {order.items.map((item, idx) => (
                                <Text key={idx} style={styles.itemText}>
                                    {item.quantity}x {item.product_name}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>

                <View style={styles.shipmentFooter}>
                    {shipment.state === 'WaitingForReceiving' && (
                        <TouchableOpacity 
                            style={styles.completeButton}
                            onPress={onComplete}
                        >
                            <Text style={styles.completeButtonText}>إكمال التوصيل</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={onCancel}
                    >
                        <Text style={styles.cancelButtonText}>إلغاء الشحنة</Text>
                    </TouchableOpacity>
                    <Text style={styles.totalAmount}>
                        {shipment.total_amount} دينار
                    </Text>
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shipmentItem: {
        marginBottom: 15,
        borderRadius: 15,
        overflow: 'hidden',
    },
    shipmentContent: {
        padding: 15,
    },
    shipmentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    traderInfo: {
        flex: 1,
        marginRight: 10,
    },
    traderName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'right',
        marginBottom: 4,
    },
    shipmentDate: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'right',
    },
    mapButton: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    ordersList: {
        marginBottom: 15,
    },
    orderItem: {
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 10,
        marginBottom: 8,
    },
    storeName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
        textAlign: 'right',
    },
    itemText: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 4,
        textAlign: 'right',
    },
    shipmentFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 15,
    },
    completeButton: {
        backgroundColor: GREEN,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    completeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 6,
    },
    cancelButton: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 6,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: GREEN,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
});

export default function MyShipmentsScreen() {
    const { user } = useContext(AuthContext);
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadShipments = async () => {
        try {
            const { data } = await axios.get(`/driver/${user.id}/shipments`);
            setShipments(data);
        } catch (error) {
            console.error('Error loading shipments:', error);
            Alert.alert('خطأ', 'حدث خطأ في تحميل الشحنات');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadShipments();
    }, []);

    const handleComplete = async (shipmentId) => {
        try {
            await axios.post(`/shipments/${shipmentId}/complete`);
            Alert.alert('نجاح', 'تم إكمال الشحنة بنجاح');
            loadShipments();
        } catch (error) {
            console.error('Error completing shipment:', error);
            Alert.alert('خطأ', 'حدث خطأ في إكمال الشحنة');
        }
    };

    const handleCancel = async (shipmentId) => {
        try {
            await axios.post(`/shipments/${shipmentId}/cancel`);
            Alert.alert('نجاح', 'تم إلغاء الشحنة بنجاح');
            loadShipments();
        } catch (error) {
            console.error('Error canceling shipment:', error);
            Alert.alert('خطأ', 'حدث خطأ في إلغاء الشحنة');
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
        <View style={styles.container}>
            <FlatList
                data={shipments}
                renderItem={({ item }) => (
                    <ShipmentItem 
                        shipment={item}
                        onComplete={() => handleComplete(item.id)}
                        onCancel={() => handleCancel(item.id)}
                    />
                )}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshing={refreshing}
                onRefresh={() => {
                    setRefreshing(true);
                    loadShipments();
                }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="car-outline" size={64} color={GREEN} />
                        <Text style={styles.emptyText}>لا توجد شحنات حالياً</Text>
                    </View>
                }
            />
        </View>
    );
} 