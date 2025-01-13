import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, I18nManager, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import { router } from 'expo-router';
import AuthContext from '../../contexts/AuthContext';
import { logout } from '../../services/AuthService';
import { Tabs } from 'expo-router';

import WholesaleStoresScreen from './WholesaleStoresScreen';
import CartScreen from './CartScreen';
import OrdersScreen from './OrdersScreen';
import NotificationsScreen from './NotificationsScreen';

// Force RTL layout
I18nManager.forceRTL(true);

const Tab = createBottomTabNavigator();

const GREEN = '#34D399';
const LIGHT_GREEN = '#E8FDF5';

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
        <View style={styles.header}>
            <Text style={styles.headerTitle}>{title}</Text>
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
        </View>
    );
};

const MainTabNavigator = () => {
    const handleLogout = () => {
        // Implement logout logic here
        console.log('Logout pressed');
    };

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'WholesaleStore') {
                        iconName = focused ? 'storefront' : 'storefront-outline';
                    } else if (route.name === 'Cart') {
                        iconName = focused ? 'cart' : 'cart-outline';
                    } else if (route.name === 'Orders') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'Notifications') {
                        iconName = focused ? 'notifications' : 'notifications-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: GREEN,
                tabBarInactiveTintColor: '#757575',
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabBarLabel,
                header: ({ route }) => (
                    <CustomHeader
                        title={
                            route.name === 'WholesaleStore' ? 'المتاجر' :
                                route.name === 'Cart' ? 'السلة' :
                                    route.name === 'Orders' ? 'الطلبات' :
                                        'الإشعارات'
                        }
                        onLogout={handleLogout}
                    />
                ),
            })}
        >
            <Tab.Screen
                name="WholesaleStore"
                component={WholesaleStoresScreen}
                options={{ title: 'المتاجر' }}
            />
            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{ title: 'السلة' }}
            />
            <Tab.Screen
                name="Orders"
                component={OrdersScreen}
                options={{ title: 'الطلبات' }}
            />
            <Tab.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{ title: 'الإشعارات' }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        height: 60,
        paddingBottom: 5,
        paddingTop: 5,
    },
    tabBarLabel: {
        fontFamily: 'Arial',
        fontSize: 12,
    },
    header: {
        backgroundColor: GREEN,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontFamily: 'Arial',
        fontSize: 20,
        fontWeight: 'bold',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutText: {
        color: '#FFFFFF',
        fontFamily: 'Arial',
        fontSize: 16,
        marginRight: 5,
    },
    logoutButtonDisabled: {
        opacity: 0.7,
    },
});

export default MainTabNavigator;

