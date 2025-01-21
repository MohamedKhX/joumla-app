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
import { useFocusEffect } from 'expo-router';
import { TraderOrderNotification } from '../../components/TraderOrderNotification';

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
    const [isStateChangeLoading, setStateChangeLoading] = useState(false);
    const [isCancelLoading, setCancelLoading] = useState(false);
    const [isMapLoading, setMapLoading] = useState(false);

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
        setStateChangeLoading(true);
        try {
            await onStateChange(id, newState);
        } finally {
            setStateChangeLoading(false);
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
                        style={[styles.mapButton, isMapLoading && styles.buttonDisabled]}
                        onPress={() => handleMapPress(shipment.trader.location.latitude, shipment.trader.location.longitude)}
                        disabled={isMapLoading}
                    >
                        <LinearGradient
                            colors={[GREEN, GREEN + 'DD']}
                            style={styles.mapButtonGradient}
                        >
                            {isMapLoading ? (
                                <ActivityIndicator size="small" color="#FFFFFF" />
                            ) : (
                                <>
                                    <Ionicons name="navigate" size={20} color="#FFFFFF" />
                                    <Text style={styles.mapButtonText}>الموقع</Text>
                                </>
                            )}
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
                        <Text style={styles.totalLabel}>المجموع:</Text>
                        <Text style={styles.totalAmount}>{shipment.total_amount} دينار</Text>
                    </View>

                    <View style={styles.actionButtons}>
                        {shipment.state === 'Waiting For Receiving' && (
                            <TouchableOpacity 
                                style={[styles.stateButton, isStateChangeLoading && styles.buttonDisabled]}
                                onPress={() => handleStateChange(shipment.id, 'Received')}
                                disabled={isStateChangeLoading}
                            >
                                <LinearGradient
                                    colors={[GREEN, GREEN + 'DD']}
                                    style={styles.buttonGradient}
                                >
                                    {isStateChangeLoading ? (
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
                                style={[styles.stateButton, isStateChangeLoading && styles.buttonDisabled]}
                                onPress={() => handleStateChange(shipment.id, 'Shipping')}
                                disabled={isStateChangeLoading}
                            >
                                <LinearGradient
                                    colors={[GREEN, GREEN + 'DD']}
                                    style={styles.buttonGradient}
                                >
                                    {isStateChangeLoading ? (
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
                                style={[styles.stateButton, isStateChangeLoading && styles.buttonDisabled]}
                                onPress={() => handleStateChange(shipment.id, 'Shipped')}
                                disabled={isStateChangeLoading}
                            >
                                <LinearGradient
                                    colors={[GREEN, GREEN + 'DD']}
                                    style={styles.buttonGradient}
                                >
                                    {isStateChangeLoading ? (
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
                                disabled={isCancelLoading}
                            >
                                <View style={styles.cancelButtonContent}>
                                    {isCancelLoading ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <>
                                            <Ionicons name="close-circle" size={20} color="#E5E7EB" />
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

const getStatusColors = (state) => {
    switch (state) {
        case 'Waiting For Receiving':
            return {
                primary: '#FF9800',    // Warm Orange
                secondary: '#FFA726',   // Light Orange
                text: '#FFFFFF'
            };
        case 'Received':
            return {
                primary: '#4CAF50',    // Material Green
                secondary: '#66BB6A',   // Light Green
                text: '#FFFFFF'
            };
        case 'Shipping':
            return {
                primary: '#2196F3',    // Material Blue
                secondary: '#42A5F5',   // Light Blue
                text: '#FFFFFF'
            };
        case 'Shipped':
            return {
                primary: '#9C27B0',    // Material Purple
                secondary: '#AB47BC',   // Light Purple
                text: '#FFFFFF'
            };
        default:
            return {
                primary: '#757575',    // Material Gray
                secondary: '#BDBDBD',   // Light Gray
                text: '#FFFFFF'
            };
    }
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
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
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
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
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
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
});

export default function MyShipmentsScreen() {
    const { user } = useContext(AuthContext);
    const [shipments, setShipments] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const [shipmentsResponse, notificationsResponse] = await Promise.all([
                axios.get(`/driver/${user.id}/shipments`),
                axios.get(`/user/${user.id}/notifications`)
            ]);
            
            setShipments(shipmentsResponse.data);
            setNotifications(notificationsResponse.data);
        } catch (error) {
            console.error('Error loading data:', error);
            Alert.alert('خطأ', 'حدث خطأ في تحميل البيانات');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleNotificationAction = async (url) => {
        try {
            await axios.post(url);
            loadData(); // Refresh both shipments and notifications
            Alert.alert('نجاح', 'تم تنفيذ الإجراء بنجاح');
        } catch (error) {
            console.error('Error handling notification action:', error);
            Alert.alert('خطأ', 'حدث خطأ أثناء تنفيذ الإجراء');
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            setLoading(true);
            loadData();
        }, [])
    );

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
                data={notifications}
                renderItem={({ item }) => (
                    <TraderOrderNotification 
                        notification={item}
                        onAction={handleNotificationAction}
                    />
                )}
                keyExtractor={item => item.id}
                refreshing={refreshing}
                onRefresh={() => {
                    setRefreshing(true);
                    loadData();
                }}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="notifications-outline" size={64} color={GREEN} />
                        <Text style={styles.emptyText}>لا توجد إشعارات حالياً</Text>
                    </View>
                }
            />
        </View>
    );
} 