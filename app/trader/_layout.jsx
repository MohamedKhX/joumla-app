import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, I18nManager, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useContext } from 'react';
import {router, Stack} from 'expo-router';
import AuthContext from '../../contexts/AuthContext';
import { logout } from '../../services/AuthService';
import { Tabs } from 'expo-router';

import WholesaleStoresScreen from './(tabs)/WholesaleStoresScreen';
import CartScreen from './(tabs)/CartScreen';
import OrdersScreen from './(tabs)/OrdersScreen';
import NotificationsScreen from './(tabs)/NotificationsScreen';
import {CartProvider} from "../../contexts/CartContext";

// Force RTL layout
I18nManager.forceRTL(true);


const GREEN = '#34D399';
const LIGHT_GREEN = '#E8FDF5';


export default function Layout() {
    return (
        <CartProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="ProductScreen" />
            </Stack>
        </CartProvider>
    );
}

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


