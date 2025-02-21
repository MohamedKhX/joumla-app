import React, {useState, useEffect, useContext} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Linking,
    useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from '../../../utils/axios';
import AuthContext from "../../../contexts/AuthContext";
import { ShipmentStateEnum, getStatusColor } from '../../../utils/shipmentStates';
import { useFocusEffect } from 'expo-router';

const GREEN = '#34D399';

const ShipmentItem = ({ shipment, onAccept, onComplete, activeShipment }) => {
    const [isAcceptLoading, setAcceptLoading] = useState(false);
    const [isMapLoading, setMapLoading] = useState(false);

    const openMap = (latitude, longitude) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(url);
    };

    const statusColors = getStatusColor(shipment.state);

    const handleAccept = async (id) => {
        setAcceptLoading(true);
        try {
            await onAccept(id);
        } finally {
            setAcceptLoading(false);
        }
    };

    const handleMapPress = async (latitude, longitude) => {
        setMapLoading(true);
        try {
            await openMap(latitude, longitude);
        } finally {
            setMapLoading(false);
        }
    };

    return (
        <View style={styles.shipmentItem}>
            <LinearGradient
                colors={['#FFFFFF', '#F8FAFC']}
                style={styles.shipmentContent}
            >
                <LinearGradient
                    colors={[statusColors.bg, statusColors.bg + '90']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.statusBar}
                >
                    <View style={styles.statusBadge}>
                        <Text style={[styles.statusText, { color: '#FFFFFF' }]}>
                            {ShipmentStateEnum[shipment.state]}
                        </Text>
                        <Ionicons 
                            name={
                                shipment.state === 'WaitingForReceiving' ? 'time' :
                                shipment.state === 'Approved' ? 'checkmark-circle' :
                                'alert-circle'
                            } 
                            size={18} 
                            color="#FFFFFF" 
                            style={styles.statusIcon}
                        />
                    </View>
                    <TouchableOpacity 
                        style={[styles.mapButton, isMapLoading && styles.buttonDisabled]}
                        onPress={() => handleMapPress(shipment.trader.location.latitude, shipment.trader.location.longitude)}
                        disabled={isMapLoading}
                    >
                        <View style={styles.mapButtonContainer}>
                            {isMapLoading ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <>
                                    <Ionicons name="navigate" size={20} color={GREEN} />
                                    <Text style={styles.mapButtonText}>الموقع</Text>
                                </>
                            )}
                        </View>
                    </TouchableOpacity>
                </LinearGradient>

                <View style={styles.shipmentHeader}>
                    <View style={styles.traderInfo}>
                        <View style={styles.traderNameContainer}>
                            <Text style={styles.traderName}>{shipment.trader.name}</Text>
                            <View style={styles.iconBubble}>
                                <Ionicons name="business" size={20} color={GREEN} />
                            </View>
                        </View>
                        <View style={styles.dateContainer}>
                            <Text style={styles.shipmentDate}>{shipment.date}</Text>
                            <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                        </View>
                    </View>
                </View>

                <View style={styles.ordersList}>
                    {shipment.orders.map((order, index) => (
                        <LinearGradient
                            key={order.id}
                            colors={[GREEN + '08', GREEN + '03']}
                            style={styles.orderCard}
                        >
                            <View style={styles.storeNameContainer}>
                                <Text style={styles.storeName}>{order.store_name}</Text>
                                <View style={styles.iconBubble}>
                                    <Ionicons name="storefront" size={18} color={GREEN} />
                                </View>
                            </View>

                            <View style={styles.itemsList}>
                                {order.items.map((item, idx) => (
                                    <View key={idx} style={styles.itemContainer}>
                                        <Text style={styles.itemText}>
                                            {item.product_name}
                                            <Text style={styles.quantityText}> × {item.quantity}</Text>
                                        </Text>
                                        <View style={styles.itemIconBubble}>
                                            <Ionicons name="cube" size={14} color={GREEN} />
                                        </View>
                                    </View>
                                ))}
                            </View>
                            <TouchableOpacity
                                style={styles.mapButton}
                                onPress={() => openMap(order.location_latitude, order.location_longitude)}
                            >
                                <LinearGradient
                                    colors={['#FFFFFF', '#FFFFFFDD']}
                                    style={styles.mapButtonGradient}
                                >
                                    <Ionicons name="navigate" size={20} color={GREEN} />
                                    <Text style={styles.mapButtonText}>الموقع</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </LinearGradient>
                    ))}
                </View>

                <LinearGradient
                    colors={['#F9FAFB', '#FFFFFF']}
                    style={styles.shipmentFooter}
                >
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>المنطقة:</Text>
                        <Text style={styles.totalAmount}>{shipment.shipment_area_name} </Text>
                    </View>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>سعر التوصيل:</Text>
                        <Text style={styles.totalAmount}>{parseInt(shipment.shipment_deliver_price)} دينار</Text>
                    </View>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>سعر المنتجات:</Text>
                        <Text style={styles.totalAmount}>{shipment.total_amount} دينار</Text>
                    </View>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>المجموع:</Text>
                        <Text style={styles.totalAmount}>{parseInt(shipment.shipment_deliver_price) + parseInt(shipment.total_amount)} دينار</Text>
                    </View>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity 
                            style={[
                                styles.actionButton, 
                                styles.acceptButton, 
                                isAcceptLoading && styles.buttonDisabled,
                                !!activeShipment && styles.buttonDisabled
                            ]}
                            onPress={() => handleAccept(shipment.id)}
                            disabled={isAcceptLoading || !!activeShipment}
                        >
                            <LinearGradient
                                colors={[GREEN, GREEN + 'DD']}
                                style={styles.buttonGradient}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                            >
                                {isAcceptLoading ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <>
                                        <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                                        <Text style={styles.buttonText}>
                                            {!!activeShipment ? 'لديك شحنة نشطة' : 'قبول الشحنة'}
                                        </Text>
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                        {shipment.state === 'WaitingForReceiving' && (
                            <TouchableOpacity 
                                style={[styles.actionButton, styles.completeButton]}
                                onPress={onComplete}
                            >
                                <LinearGradient
                                    colors={[GREEN, GREEN + 'DD']}
                                    style={styles.buttonGradient}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                >
                                    <Text style={styles.buttonText}>إكمال التوصيل</Text>
                                    <Ionicons name="flag" size={20} color="#FFFFFF" />
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                    </View>
                </LinearGradient>
            </LinearGradient>
        </View>
    );
};

export default function ShipmentsScreen() {
    const { user } = useContext(AuthContext);
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeShipment, setActiveShipment] = useState(false);

    useColorScheme(); // We add this but don't use its value to prevent theme changes

    const checkActiveShipment = async () => {
        if (!user) {
            console.log('User is not loaded yet');
            return;
        }

        try {
            console.log('----------------------------------------------------------------------------------:', user);
            const { data } = await axios.get(`/driver/${user.id}/shipments`);
            const active = !!data.find(shipment =>
                shipment.state === 'Waiting For Receiving' ||
                shipment.state === 'Received' ||
                shipment.state === 'Shipping'
            );
            setActiveShipment(active);
        } catch (error) {
            console.error('Error checking active shipments:', error);
            setActiveShipment(false);
        }
    };

    useEffect(() => {
        if (user) {
            checkActiveShipment();
        }
    }, [user]);

    const loadShipments = async () => {
        try {
            const [availableResponse] = await Promise.all([
                axios.get('/shipments/available'),
                checkActiveShipment()
            ]);
            setShipments(availableResponse.data);
        } catch (error) {
            console.error('Error loading shipments:', error);
            Alert.alert('خطأ', 'حدث خطأ في تحميل الشحنات');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            setLoading(true);
            loadShipments();
        }, [])
    );

    const handleAccept = async (shipmentId) => {
        if (activeShipment) {
            Alert.alert(
                'لا يمكن قبول شحنة جديدة',
                'يجب إكمال الشحنة الحالية أولاً قبل قبول شحنة جديدة',
                [{ text: 'حسناً', style: 'cancel' }]
            );
            return;
        }

        try {
            await axios.post(`/shipments/${shipmentId}/${user.id}/accept`);
            Alert.alert('نجاح', 'تم قبول الشحنة بنجاح');
            loadShipments();
        } catch (error) {
            console.error('Error accepting shipment:', error);
            Alert.alert('خطأ', 'حدث خطأ في قبول الشحنة');
        }
    };

    const handleComplete = async (shipmentId) => {
        try {
            await axios.post(`/shipments/${shipmentId}/Shipped`);
            Alert.alert('نجاح', 'تم شحن الشحنة بنجاح');
            loadShipments();
        } catch (error) {
            console.error('Error completing shipment:', error);
            Alert.alert('خطأ', 'حدث خطأ في إكمال الشحنة');
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
                        onAccept={handleAccept}
                        onComplete={handleComplete}
                        activeShipment={activeShipment}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        colorScheme: 'light',
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
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
    },
    statusBar: {
        height: 50,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    shipmentContent: {
        borderRadius: 20,
    },
    shipmentHeader: {
        padding: 16,
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    iconBubble: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: GREEN + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    itemIconBubble: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: GREEN + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    traderInfo: {
        flex: 1,
        alignItems: 'flex-end',
    },
    traderNameContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginBottom: 12,
    },
    traderName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'right',
        backgroundColor: 'transparent',
    },
    dateContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    shipmentDate: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 6,
    },
    mapButton: {
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        elevation: 2,
    },
    mapButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    mapButtonText: {
        color: GREEN,
        fontSize: 14,
        marginRight: 4,
        fontWeight: '500',
    },
    statusIcon: {
        marginRight: 6,
    },
    ordersList: {
        padding: 16,
    },
    orderCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    storeNameContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginBottom: 12,
    },
    storeName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        textAlign: 'right',
    },
    itemsList: {
        paddingLeft: 48,
    },
    itemContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemText: {
        fontSize: 14,
        color: '#4B5563',
        textAlign: 'right',
        backgroundColor: 'transparent',
    },
    quantityText: {
        color: GREEN,
        fontWeight: '600',
    },
    shipmentFooter: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    actionButtons: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    actionButton: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    acceptButton: {
        marginRight: 8,
    },
    completeButton: {
        marginLeft: 8,
    },
    buttonGradient: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 16,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    totalContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 16,
        color: '#6B7280',
        marginRight: 8,
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: GREEN,
    },
    statusBadge: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
        backgroundColor: 'transparent',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 64,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    mapButtonGradient: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 16,
    },
}); 