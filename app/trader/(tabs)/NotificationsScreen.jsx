import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    I18nManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Force RTL layout
I18nManager.forceRTL(true);

const GREEN = '#34D399';
const LIGHT_GREEN = '#E8FDF5';

// Sample notifications data
const notificationsScreen = [
    { id: '1', type: 'order', title: 'تم شحن طلبك', message: 'تم شحن طلبك رقم #1234. من المتوقع وصوله خلال 3-5 أيام.', time: '2 ساعة', read: false },
    { id: '2', type: 'promo', title: 'عرض خاص', message: 'خصم 20% على جميع المنتجات لمدة 24 ساعة فقط!', time: '5 ساعات', read: true },
    { id: '3', type: 'stock', title: 'إعادة تخزين', message: 'تم إعادة تخزين المنتج "قميص قطني" الذي كنت تنتظره.', time: '1 يوم', read: false },
    { id: '4', type: 'payment', title: 'تم استلام الدفعة', message: 'تم استلام دفعتك بنجاح لطلبك رقم #5678.', time: '2 يوم', read: true },
    { id: '5', type: 'order', title: 'تم تسليم طلبك', message: 'تم تسليم طلبك رقم #9012 بنجاح. نتمنى أن تستمتع بمشترياتك!', time: '3 أيام', read: true },
];

const getIconName = (type) => {
    switch (type) {
        case 'order':
            return 'cube-outline';
        case 'promo':
            return 'pricetag-outline';
        case 'stock':
            return 'archive-outline';
        case 'payment':
            return 'card-outline';
        default:
            return 'notifications-outline';
    }
};

const NotificationItem = ({ item, onPress }) => (
    <TouchableOpacity style={[styles.notificationItem, !item.read && styles.unreadNotification]} onPress={onPress}>
        <View style={styles.iconContainer}>
            <Ionicons name={getIconName(item.type)} size={24} color={GREEN} />
        </View>
        <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationMessage}>{item.message}</Text>
            <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
);

export default function NotificationsScreen() {
    const [notificationsList, setNotificationsList] = useState(notificationsScreen);

    const handleNotificationPress = (id) => {
        setNotificationsList(prevList =>
            prevList.map(notification =>
                notification.id === id ? { ...notification, read: true } : notification
            )
        );
        // Here you would typically navigate to the relevant screen or show more details
        console.log(`Notification ${id} pressed`);
    };

    const markAllAsRead = () => {
        setNotificationsList(prevList =>
            prevList.map(notification => ({ ...notification, read: true }))
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>الإشعارات</Text>
                <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
                    <Text style={styles.markAllButtonText}>تعليم الكل كمقروء</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={notificationsList}
                renderItem={({ item }) => (
                    <NotificationItem
                        item={item}
                        onPress={() => handleNotificationPress(item.id)}
                    />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.notificationsList}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor: GREEN,
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Arial',
    },
    markAllButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    markAllButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Arial',
    },
    notificationsList: {
        padding: 20,
    },
    notificationItem: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    unreadNotification: {
        backgroundColor: LIGHT_GREEN,
        borderColor: GREEN,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: LIGHT_GREEN,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        fontFamily: 'Arial',
        marginBottom: 5,
        textAlign: 'right',
    },
    notificationMessage: {
        fontSize: 14,
        color: '#666666',
        fontFamily: 'Arial',
        marginBottom: 5,
        textAlign: 'right',
    },
    notificationTime: {
        fontSize: 12,
        color: '#999999',
        fontFamily: 'Arial',
        textAlign: 'right',
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: GREEN,
        position: 'absolute',
        top: 15,
        left: 15,
    },
});

