import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet, I18nManager } from 'react-native';
import { useContext, useState } from 'react';
import { router } from 'expo-router';
import AuthContext from '../../../contexts/AuthContext';
import { logout } from '../../../services/AuthService';

// Force RTL layout
I18nManager.forceRTL(true);

const GREEN = '#34D399';

const CustomHeader = ({ title }) => {
    const { setUser } = useContext(AuthContext);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        if (isLoggingOut) return;
        
        try {
            setIsLoggingOut(true);
            await logout();
            setUser(null);
            router.replace('/auth/LoginScreen');
        } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('خطأ', 'حدث خطأ أثناء تسجيل الخروج');
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <View style={styles.headerContainer}>
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={handleLogout} 
                    style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
                    disabled={isLoggingOut}
                >
                    <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
                    <Text style={styles.logoutText}>
                        {isLoggingOut ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
                    </Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
        </View>
    );
};

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                header: ({ route }) => (
                    <CustomHeader
                        title={
                            route.name === 'WholesaleStoresScreen' ? 'المتاجر' :
                            route.name === 'CartScreen' ? 'السلة' :
                            route.name === 'OrdersScreen' ? 'الطلبات' :
                            'الإشعارات'
                        }
                    />
                ),
                tabBarActiveTintColor: GREEN,
                tabBarInactiveTintColor: '#757575',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#EEEEEE',
                    height: 60,
                    paddingBottom: 5,
                    paddingTop: 5,
                },
                tabBarLabelStyle: {
                    fontFamily: 'Arial',
                    fontSize: 12,
                }
            }}
        >
            <Tabs.Screen
                name="WholesaleStoresScreen"
                options={{
                    title: 'المتاجر',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="storefront-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="CartScreen"
                options={{
                    title: 'السلة',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cart-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="OrdersScreen"
                options={{
                    title: 'الطلبات',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="NotificationsScreen"
                options={{
                    title: 'الإشعارات',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="notifications-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: GREEN,
        paddingTop: 50,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontFamily: 'Arial',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'right',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    logoutText: {
        color: '#FFFFFF',
        fontFamily: 'Arial',
        fontSize: 16,
        marginRight: 8,
    },
    logoutButtonDisabled: {
        opacity: 0.7,
    },
});


