import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GREEN = '#34D399';

export const OrderDecisionNotification = ({ notification, onAction }) => {
    // Check if this is an order decision notification (when some orders are accepted/rejected)
    const isOrderDecision = notification.data?.type === 'order_decision';

    if (!isOrderDecision) {
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
                    name="alert-circle" 
                    size={24} 
                    color="#F59E0B" 
                    style={styles.warningIcon} 
                />
                <Text style={styles.notificationTitle}>طلب موافقة على الطلبات</Text>
            </View>

            {/* Show accepted and rejected stores */}
            <View style={styles.ordersStatus}>
                {notification.data.acceptedStores?.length > 0 && (
                    <View style={styles.statusSection}>
                        <Text style={styles.statusTitle}>
                            <Ionicons name="checkmark-circle" size={18} color={GREEN} /> المتاجر الموافقة:
                        </Text>
                        {notification.data.acceptedStores.map((store, index) => (
                            <Text key={index} style={styles.storeText}>• {store}</Text>
                        ))}
                    </View>
                )}

                {notification.data.rejectedStores?.length > 0 && (
                    <View style={styles.statusSection}>
                        <Text style={styles.statusTitle}>
                            <Ionicons name="close-circle" size={18} color="#EF4444" /> المتاجر الرافضة:
                        </Text>
                        {notification.data.rejectedStores.map((store, index) => (
                            <Text key={index} style={styles.storeText}>• {store}</Text>
                        ))}
                    </View>
                )}
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    warningIcon: {
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
    },
    statusSection: {
        marginBottom: 12,
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        textAlign: 'right',
    },
    storeText: {
        fontSize: 15,
        color: '#4B5563',
        marginBottom: 4,
        textAlign: 'right',
        paddingRight: 12,
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