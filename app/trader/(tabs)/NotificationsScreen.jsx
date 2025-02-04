import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    I18nManager,
    ActivityIndicator,
    Animated,
    RefreshControl,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AuthContext from '../../../contexts/AuthContext';
import axios from '../../../utils/axios';

// Force RTL layout
I18nManager.forceRTL(true);

const GREEN = '#34D399';
const LIGHT_GREEN = '#E8FDF5';

// Add these helper functions before the NotificationItem component
const getNotificationIcon = (title) => {
    if (!title) return 'notifications-outline';
    
    if (title.includes('طلب') || title.includes('order')) return 'cube-outline';
    if (title.includes('دفع') || title.includes('payment')) return 'card-outline';
    if (title.includes('شحن') || title.includes('shipping')) return 'truck-outline';
    if (title.includes('تحديث') || title.includes('update')) return 'refresh-outline';
    return 'notifications-outline';
};

const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)} سنة`;
    
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)} شهر`;
    
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)} يوم`;
    
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)} ساعة`;
    
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)} دقيقة`;
    
    return 'الآن';
};

const NotificationItem = ({ item }) => {
    const [animatedValue] = useState(new Animated.Value(0));
    const [acceptLoading, setAcceptLoading] = useState(false);
    const [cancelLoading, setRejectLoading] = useState(false);
    const [actionTaken, setActionTaken] = useState(null);
    
    useEffect(() => {
        Animated.spring(animatedValue, {
            toValue: 1,
            tension: 20,
            friction: 7,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleAction = async (url, type) => {
        const loadingState = type === 'accept' ? setAcceptLoading : setRejectLoading;
        loadingState(true);
        
        try {
            await axios.post(url);
            setActionTaken(type === 'accept' ? 'تم المتابعة مع الطلبات المقبولة' : 'تم إلغاء جميع الطلبات');
            Alert.alert('نجاح', 'تم تنفيذ الإجراء بنجاح');
        } catch (error) {
            console.error('Error handling action:', error);
            Alert.alert('خطأ', 'حدث خطأ أثناء تنفيذ الإجراء');
        } finally {
            loadingState(false);
        }
    };

    // Check if this is an order rejection notification
    const isOrderRejection = item?.data?.type === 'trader_order_decision';

    if (isOrderRejection && item?.data) {
        const notificationData = item.data;
        
        return (
            <Animated.View style={[
                styles.notificationItem,
                {
                    transform: [
                        { scale: animatedValue },
                        {
                            translateY: animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [50, 0],
                            }),
                        },
                    ],
                    opacity: animatedValue,
                },
            ]}>
                <View style={styles.rejectionNotification}>
                    <View style={styles.iconContainer}>
                        <Ionicons 
                            name="warning-outline" 
                            size={24} 
                            color="#EF4444" 
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.rejectionTitle}>{notificationData.title}</Text>
                        <Text style={styles.notificationBody}>{notificationData.body}</Text>

                        {notificationData.orders?.length > 0 && (
                            <View style={styles.ordersStatus}>
                                {notificationData.orders.map((order, index) => (
                                    <View key={index} style={styles.orderItem}>
                                        <View style={styles.storeHeader}>
                                            <Ionicons 
                                                name="storefront" 
                                                size={20} 
                                                color={order.state === 'Approved' ? GREEN : '#EF4444'} 
                                            />
                                            <Text style={styles.storeName}>{order.store_name}</Text>
                                        </View>
                                        <Text style={[
                                            styles.stateText,
                                            { color: order.state === 'Approved' ? GREEN : '#EF4444' }
                                        ]}>
                                            {order.state === 'Approved' ? 'تمت الموافقة' : 'تم الرفض'}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {actionTaken ? (
                            <View style={styles.actionTakenContainer}>
                                <Ionicons 
                                    name="checkmark-circle" 
                                    size={24} 
                                    color={GREEN} 
                                />
                                <Text style={styles.actionTakenText}>
                                    {actionTaken}
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.actionButtons}>
                                <TouchableOpacity 
                                    style={[
                                        styles.actionButton, 
                                        styles.acceptButton,
                                        acceptLoading && styles.actionButtonDisabled
                                    ]}
                                    onPress={() => handleAction(
                                        `/shipments/${notificationData.shipment_id}/proceed-with-approved`,
                                        'accept'
                                    )}
                                    disabled={acceptLoading || cancelLoading}
                                >
                                    {acceptLoading ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.actionButtonText}>
                                            متابعة مع الطلبات المقبولة
                                        </Text>
                                    )}
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={[
                                        styles.actionButton, 
                                        styles.cancelButton,
                                        cancelLoading && styles.actionButtonDisabled
                                    ]}
                                    onPress={() => handleAction(
                                        `/shipments/${notificationData.shipment_id}/cancel-all`,
                                        'cancel'
                                    )}
                                    disabled={acceptLoading || cancelLoading}
                                >
                                    {cancelLoading ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <Text style={styles.actionButtonText}>
                                            إلغاء جميع الطلبات
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}

                        <Text style={styles.timeAgo}>{getTimeAgo(item.created_at)}</Text>
                    </View>
                </View>
            </Animated.View>
        );
    }

    // Regular notification rendering
    if (!item) return null;

    return (
        <Animated.View style={[
            styles.notificationItem,
            {
                transform: [
                    { scale: animatedValue },
                    {
                        translateY: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [50, 0],
                        }),
                    },
                ],
                opacity: animatedValue,
            },
        ]}>
            <LinearGradient
                colors={[GREEN + '10', GREEN + '05']}
                style={styles.notificationContent}
            >
                <View style={styles.iconContainer}>
                    <Ionicons 
                        name={getNotificationIcon(item.title)} 
                        size={24} 
                        color={GREEN} 
                    />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.notificationTitle}>{item.title}</Text>
                    <Text style={styles.notificationBody}>{item.body}</Text>
                    <Text style={styles.timeAgo}>{item.created_at}</Text>
                </View>
            </LinearGradient>
        </Animated.View>
    );
};

export default function NotificationsScreen() {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadNotifications = async () => {
        try {
            const response = await axios.get(`/user/${user.id}/notifications`);
            console.log('Loaded notifications:', response.data); // Debug log
            setNotifications(response.data);
        } catch (error) {
            console.error('Error loading notifications:', error);
            Alert.alert('خطأ', 'حدث خطأ في تحميل الإشعارات');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={GREEN} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            <LinearGradient
                colors={[GREEN, GREEN + 'DD']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>الإشعارات</Text>
                <Text style={styles.headerSubtitle}>تابع آخر التحديثات</Text>
            </LinearGradient>

            <FlatList
                data={notifications}
                renderItem={({ item }) => <NotificationItem item={item} />}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.notificationsList}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            loadNotifications();
                        }}
                        colors={[GREEN]}
                    />
                }
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
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'right',
        marginBottom: 5,
    },
    headerSubtitle: {
        color: '#FFFFFF',
        fontSize: 16,
        opacity: 0.9,
        textAlign: 'right',
    },
    notificationsList: {
        padding: 20,
        paddingTop: 10,
    },
    notificationItem: {
        marginBottom: 15,
        borderRadius: 15,
        overflow: 'hidden',
    },
    notificationContent: {
        flexDirection: 'row',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
    textContainer: {
        padding: 5,
        borderRadius:10,
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 5,
        textAlign: 'right',
    },
    notificationBody: {
        fontSize: 14,
        marginBottom: 5,
        textAlign: 'right',
        lineHeight: 20,
    },
    timeAgo: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'right',
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
    ordersStatus: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 12,
        marginVertical: 12,
    },
    orderItem: {
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    storeHeader: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    storeName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    stateText: {
        fontSize: 14,
        fontWeight: '500',
        marginRight: 28,
    },
    actionButtons: {
        marginTop: 16,
        gap: 8,
    },
    actionButton: {
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    acceptButton: {
        backgroundColor: GREEN,
    },
    cancelButton: {
        backgroundColor: '#EF4444',
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    rejectionNotification: {
        backgroundColor: '#FEF2F2',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    rejectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#EF4444',
        marginBottom: 8,
        textAlign: 'right',
    },
    actionButtonDisabled: {
        opacity: 0.7,
    },
    actionTakenContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
        gap: 8,
    },
    actionTakenText: {
        color: GREEN,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'right',
    },
});

