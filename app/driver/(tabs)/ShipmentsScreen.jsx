import React, { useState, useEffect } from 'react';
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

const GREEN = '#34D399';

const ShipmentItem = ({ shipment, onAccept }) => {
    const openMap = (latitude, longitude) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(url);
    };

    return (
        <View style={styles.shipmentItem}>
            <LinearGradient
                colors={[GREEN + '10', GREEN + '05']}
                style={styles.shipmentContent}
            >
                <View style={styles.shipmentHeader}>
                    <View style={styles.traderInfo}>
                        <Text style={styles.traderName}>{shipment.trader.name}</Text>
                        <Text style={styles.shipmentDate}>{shipment.date}</Text>
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
                    <TouchableOpacity 
                        style={styles.acceptButton}
                        onPress={onAccept}
                    >
                        <Text style={styles.acceptButtonText}>قبول الشحنة</Text>
                    </TouchableOpacity>
                    <Text style={styles.totalAmount}>
                        {shipment.total_amount} دينار
                    </Text>
                </View>
            </LinearGradient>
        </View>
    );
};

export default function ShipmentsScreen() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadShipments = async () => {
        try {
            const { data } = await axios.get('/shipments/available');
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

    const handleAccept = async (shipmentId) => {
        try {
            await axios.post(`/shipments/${shipmentId}/accept`);
            Alert.alert('نجاح', 'تم قبول الشحنة بنجاح');
            loadShipments();
        } catch (error) {
            console.error('Error accepting shipment:', error);
            Alert.alert('خطأ', 'حدث خطأ في قبول الشحنة');
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
                        onAccept={() => handleAccept(item.id)}
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
                        <Ionicons name="cube-outline" size={64} color={GREEN} />
                        <Text style={styles.emptyText}>لا توجد شحنات متاحة حالياً</Text>
                    </View>
                }
            />
        </View>
    );
}

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
    listContainer: {
        padding: 15,
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
    acceptButton: {
        backgroundColor: GREEN,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    acceptButtonText: {
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