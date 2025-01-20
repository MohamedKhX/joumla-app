import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from '../../../utils/axios';
import AuthContext from '../../../contexts/AuthContext';

const GREEN = '#34D399';

export default function NotificationsScreen() {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        try {
            const { data } = await axios.get(`/user/${user.id}/notifications`);
            setNotifications(data);
        } catch (error) {
            console.error('Error loading notifications:', error);
            Alert.alert('خطأ', 'حدث خطأ في تحميل الإشعارات');
        } finally {
            setLoading(false);
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
            <FlatList
                data={notifications}
                renderItem={({ item }) => (
                    <View style={styles.notificationItem}>
                        <Text style={styles.notificationTitle}>{item.title}</Text>
                        <Text style={styles.notificationBody}>{item.body}</Text>
                        <Text style={styles.timeAgo}>{item.created_at}</Text>
                    </View>
                )}
                keyExtractor={item => item.id.toString()}
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
    notificationItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    notificationBody: {
        fontSize: 14,
        color: '#4B5563',
    },
    timeAgo: {
        fontSize: 12,
        color: '#6B7280',
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