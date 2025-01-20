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
    RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AuthContext from '../../../contexts/AuthContext';
import axios from '../../../utils/axios';

// Force RTL layout
I18nManager.forceRTL(true);

const GREEN = '#34D399';
const LIGHT_GREEN = '#E8FDF5';

const NotificationItem = ({ item, onPress }) => {
    const [animatedValue] = useState(new Animated.Value(0));
    
    useEffect(() => {
        Animated.spring(animatedValue, {
            toValue: 1,
            tension: 20,
            friction: 7,
            useNativeDriver: true,
        }).start();
    }, []);

    const getNotificationIcon = (title) => {
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
                    <Text style={styles.timeAgo}>{getTimeAgo(item.created_at)}</Text>
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

    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get(`/user/${user.id}/notifications`);
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
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
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={[GREEN, GREEN + 'DD']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>الإشعارات</Text>
                <Text style={styles.headerSubtitle}>
                    {notifications.length > 0 
                        ? `لديك ${notifications.length} إشعارات`
                        : 'لا توجد إشعارات جديدة'}
                </Text>
            </LinearGradient>

            <FlatList
                data={notifications}
                renderItem={({ item }) => (
                    <NotificationItem item={item} />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.notificationsList}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[GREEN]}
                        tintColor={GREEN}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="notifications-off-outline" size={64} color={GREEN} />
                        <Text style={styles.emptyText}>لا توجد إشعارات</Text>
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
});

