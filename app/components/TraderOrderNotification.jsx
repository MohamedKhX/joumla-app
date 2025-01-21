import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GREEN = '#34D399';

export const TraderOrderNotification = ({ notification, onAction }) => {
    // Check if this is a trader order notification
    const isTraderOrderNotification = notification.data?.type === 'trader_order_decision';

    if (!isTraderOrderNotification) {
        return (
            <View style={styles.notificationItem}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationBody}>{notification.body}</Text>
            </View>
        );
    }

    return (
        <View style={styles.notificationItem}>
            <View style={styles.notificationHeader}>
                <Ionicons 
                    name="notifications" 
                    size={24} 
                    color={GREEN} 
                    style={styles.icon} 
                />
                <Text style={styles.notificationTitle}>تحديث حالة الطلبات</Text>
            </View>

            {/* Show orders status */}
            <View style={styles.ordersStatus}>
                {notification.data.orders.map((order, index) => (
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
            
            <View style={styles.actionButtons}>
                <TouchableOpacity 
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => onAction(notification.data.actions.accept.url)}
                >
                    <Text style={styles.buttonText}>متابعة مع الطلبات المقبولة</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => onAction(notification.data.actions.cancel.url)}
                >
                    <Text style={styles.buttonText}>إلغاء جميع الطلبات</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    notificationItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    notificationHeader: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginBottom: 16,
    },
    icon: {
        marginLeft: 8,
    },
    notificationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    ordersStatus: {
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        gap: 12,
    },
    orderItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    storeHeader: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    storeName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        textAlign: 'right',
    },
    stateText: {
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'right',
        marginRight: 28,
    },
    actionButtons: {
        flexDirection: 'column',
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
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
}); 