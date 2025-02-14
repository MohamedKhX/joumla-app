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
    useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from '../../../utils/axios';
import AuthContext from '../../../contexts/AuthContext';
import { ShipmentStateEnum, getStatusColor } from '../../../utils/shipmentStates';

const GREEN = '#34D399';

const StateProgressBar = ({ currentState }) => {
    const states = [
        'Received',
        'Shipping',
        'Shipped'
    ];

    const currentIndex = states.indexOf(currentState);

    return (
        <View style={styles.progressContainer}>
            {states.map((state, index) => (
                <React.Fragment key={state}>
                    <View style={styles.stateContainer}>
                        <View style={[
                            styles.stateCircle,
                            index <= currentIndex && styles.stateCircleActive
                        ]}>
                            <Ionicons 
                                name={
                                    state === 'Received' ? 'checkmark-circle' :
                                    state === 'Shipping' ? 'car' : 'flag'
                                } 
                                size={20} 
                                color={index <= currentIndex ? '#FFFFFF' : '#9CA3AF'} 
                            />
                        </View>
                        <Text style={[
                            styles.stateText,
                            index <= currentIndex && styles.stateTextActive
                        ]}>
                            {ShipmentStateEnum[state]}
                        </Text>
                    </View>
                    {index < states.length - 1 && (
                        <View style={[
                            styles.stateLine,
                            index < currentIndex && styles.stateLineActive
                        ]} />
                    )}
                </React.Fragment>
            ))}
        </View>
    );
};

const ShipmentItem = ({ shipment, onStateChange, onCancel }) => {
    const [isStateLoading, setStateLoading] = useState(false);
    const [isCancelLoading, setCancelLoading] = useState(false);

    const openMap = (latitude, longitude) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(url);
    };

    const statusColors = getStatusColor(shipment.state);
    
    const getStateIcon = () => {
        switch(shipment.state) {
            case 'Waiting For Receiving':
                return 'time-outline';
            case 'Received':
                return 'checkmark-circle-outline';
            case 'Shipping':
                return 'car-outline';
            case 'Shipped':
                return 'flag-outline';
            default:
                return 'ellipse-outline';
        }
    };

    const handleStateChange = async (id, newState) => {
        setStateLoading(true);
        try {
            await onStateChange(id, newState);
        } finally {
            setStateLoading(false);
        }
    };

    const handleCancel = async (id) => {
        setCancelLoading(true);
        try {
            await onCancel(id);
        } finally {
            setCancelLoading(false);
        }
    };

    return (
        <View style={styles.shipmentItem}>
            {/* Status Bar */}
            <LinearGradient
                colors={[statusColors.primary, statusColors.secondary]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.statusBar}
            >
                <View style={styles.statusContent}>
                    <Ionicons name={getStateIcon()} size={24} color={statusColors.text} />
                    <Text style={[styles.statusText, { color: statusColors.text }]}>
                        {shipment.state === 'Waiting For Receiving' ? 'في انتظار الاستلام' :
                         shipment.state === 'Received' ? 'تم الاستلام' :
                         shipment.state === 'Shipping' ? 'جاري التوصيل' :
                         shipment.state === 'Shipped' ? 'تم التوصيل' : shipment.state}
                    </Text>
                </View>
            </LinearGradient>

            <View style={styles.contentContainer}>
                {/* Trader Info Section */}
                <View style={styles.traderSection}>
                    <View style={styles.traderInfo}>
                        <View style={styles.traderNameContainer}>
                            <Ionicons name="business-outline" size={24} color={GREEN} />
                            <Text style={styles.traderName}>{shipment.trader.name}</Text>
                        </View>
                        <View style={styles.dateContainer}>
                            <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                            <Text style={styles.shipmentDate}>{shipment.date}</Text>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.mapButton}
                        onPress={() => openMap(shipment.trader.location.latitude, shipment.trader.location.longitude)}
                    >
                        <LinearGradient
                            colors={[GREEN, GREEN + 'DD']}
                            style={styles.mapButtonGradient}
                        >
                            <Ionicons name="navigate" size={20} color="#FFFFFF" />
                            <Text style={styles.mapButtonText}>الموقع</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Orders Section */}
                <View style={styles.ordersSection}>
                    {shipment.orders.map((order, index) => (
                        <LinearGradient
                            key={order.id}
                            colors={[GREEN + '10', GREEN + '05']}
                            style={styles.orderItem}
                        >
                            <View style={styles.storeHeader}>
                                <Ionicons name="storefront-outline" size={20} color={GREEN} />
                                <Text style={styles.storeName}>{order.store_name}</Text>
                            </View>
                            {order.items.map((item, idx) => (
                                <View key={idx} style={styles.itemRow}>
                                    <Text style={styles.itemQuantity}>×{item.quantity}</Text>
                                    <Text style={styles.itemText}>{item.product_name}</Text>
                                </View>
                            ))}
                        </LinearGradient>
                    ))}
                </View>

                {/* Action Section */}
                <View style={styles.actionSection}>
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
                        {shipment.state === 'Waiting For Receiving' && (
                            <TouchableOpacity 
                                style={[styles.stateButton, isStateLoading && styles.buttonDisabled]}
                                onPress={() => handleStateChange(shipment.id, 'Received')}
                                disabled={isStateLoading}
                            >
                                <LinearGradient
                                    colors={[GREEN, GREEN + 'DD']}
                                    style={styles.buttonGradient}
                                >
                                    {isStateLoading ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <>
                                            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                                            <Text style={styles.buttonText}>تأكيد الاستلام</Text>
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        )}

                        {shipment.state === 'Received' && (
                            <TouchableOpacity 
                                style={[styles.stateButton, isStateLoading && styles.buttonDisabled]}
                                onPress={() => handleStateChange(shipment.id, 'Shipping')}
                                disabled={isStateLoading}
                            >
                                <LinearGradient
                                    colors={[GREEN, GREEN + 'DD']}
                                    style={styles.buttonGradient}
                                >
                                    {isStateLoading ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <>
                                            <Ionicons name="car" size={20} color="#FFFFFF" />
                                            <Text style={styles.buttonText}>بدء التوصيل</Text>
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        )}

                        {shipment.state === 'Shipping' && (
                            <TouchableOpacity 
                                style={[styles.stateButton, isStateLoading && styles.buttonDisabled]}
                                onPress={() => handleStateChange(shipment.id, 'Shipped')}
                                disabled={isStateLoading}
                            >
                                <LinearGradient
                                    colors={[GREEN, GREEN + 'DD']}
                                    style={styles.buttonGradient}
                                >
                                    {isStateLoading ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <>
                                            <Ionicons name="flag" size={20} color="#FFFFFF" />
                                            <Text style={styles.buttonText}>تم التوصيل</Text>
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        )}

                        {shipment.state !== 'Shipped' && (
                            <TouchableOpacity 
                                style={[styles.cancelButton, isCancelLoading && styles.buttonDisabled]}
                                onPress={() => handleCancel(shipment.id)}
                                disabled={isCancelLoading || isStateLoading}
                            >
                                <View style={styles.cancelButtonContent}>
                                    {isCancelLoading ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <>
                                            <Ionicons name="close-circle" size={20} color="#FFFFFF" />
                                            <Text style={styles.cancelButtonText}>إلغاء</Text>
                                        </>
                                    )}
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
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
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    statusBar: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        elevation: 2,
        shadowColor: "#264a2c",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    statusContent: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    statusText: {
        fontSize: 17,
        fontWeight: '700',
        textAlign: 'center',
    },
    contentContainer: {
        padding: 16,
    },
    traderSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    traderInfo: {
        flex: 1,
        marginRight: 10,
    },
    traderNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    traderName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        textAlign: 'right',
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    shipmentDate: {
        color: '#6B7280',
        fontSize: 15,
        fontWeight: '500',
        marginRight: 6,
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
    ordersSection: {
        gap: 12,
        marginBottom: 16,
    },
    orderItem: {
        padding: 12,
        borderRadius: 12,
    },
    storeHeader: {
        flexDirection: 'row',
        alignItems: 'right',
        gap: 8,
        marginBottom: 8,
    },
    storeName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        textAlign: 'right',
    },
    itemRow: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: '#FFFFFF20',
        borderRadius: 8,
        marginTop: 4,
    },
    itemQuantity: {
        fontSize: 15,
        fontWeight: '700',
        color: GREEN,
        marginLeft: 12,
    },
    itemText: {
        flex: 1,
        fontSize: 15,
        color: '#374151',
        textAlign: 'right',
    },
    actionSection: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 16,
    },
    totalContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4B5563',
        marginLeft: 8,
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: '700',
        color: GREEN,
    },
    actionButtons: {
        flexDirection: 'row-reverse',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 12,
    },
    stateButton: {
        flex: 1,
        maxWidth: 180,
        borderRadius: 12,
        overflow: 'hidden',
    },
    buttonGradient: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        marginRight: 6,
    },
    cancelButton: {
        backgroundColor: '#ff5252',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    cancelButtonContent: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 4,
    },
    mapButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 12,
        gap: 6,
    },
    mapButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    stateContainer: {
        alignItems: 'center',
        flex: 1,
    },
    stateCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    stateCircleActive: {
        backgroundColor: GREEN,
    },
    stateLine: {
        height: 2,
        flex: 1,
        backgroundColor: '#E5E7EB',
        marginHorizontal: -10,
    },
    stateLineActive: {
        backgroundColor: GREEN,
    },
    stateText: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
    },
    stateTextActive: {
        color: GREEN,
        fontWeight: '600',
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
    buttonDisabled: {
        opacity: 0.7,
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
            console.log('Loaded shipments:', data);
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

    const handleStateChange = async (shipmentId, newState) => {
        try {
            console.log('Changing state:', { shipmentId, newState });
            await axios.post(`/shipments/${shipmentId}/${newState}`);
            Alert.alert('نجاح', 'تم تحديث حالة الشحنة بنجاح');
            loadShipments();
        } catch (error) {
            console.error('Error updating shipment state:', error);
            Alert.alert('خطأ', 'حدث خطأ في تحديث حالة الشحنة');
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
                        onStateChange={handleStateChange}
                        onCancel={handleCancel}
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