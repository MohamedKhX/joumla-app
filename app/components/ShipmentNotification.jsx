import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GREEN = '#34D399';

export const ShipmentNotification = ({ notification, onAction }) => {
    // Check if this is a shipment decision notification
    const isShipmentDecision = notification.data?.actions?.accept;

    if (!isShipmentDecision) {
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
                    name="warning" 
                    size={24} 
                    color="#F59E0B" 
                    style={styles.warningIcon} 
                />
                <Text style={styles.notificationTitle}>{notification.data.title}</Text>
            </View>
            <Text style={styles.notificationBody}>{notification.data.body}</Text>
            
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
    // ... existing styles ...
}); 