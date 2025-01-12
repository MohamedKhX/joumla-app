import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    I18nManager,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import logo from '../../assets/images/logo.webp';

// Force RTL layout
I18nManager.forceRTL(true);

const { width } = Dimensions.get('window');
const GREEN = '#34D399';
const LIGHT_GREEN = '#E8FDF5';

// Sample data for wholesale stores
const wholesaleStores = [
    {
        id: '1',
        name: 'متجر الجملة الأول',
        address: 'شارع الملك فهد، الرياض',
        rating: 4.5,
        image: logo,
        description: 'متجر رائد في بيع الملابس بالجملة بأسعار تنافسية وجودة عالية.'
    },
    {
        id: '2',
        name: 'سوق الجملة الكبير',
        address: 'شارع الأمير محمد، جدة',
        rating: 4.2,
        image: logo,
        description: 'يوفر تشكيلة واسعة من المنتجات الغذائية والاستهلاكية للتجار وأصحاب المحلات.'
    },
    {
        id: '3',
        name: 'مركز البيع بالجملة',
        address: 'شارع الخليج، الدمام',
        rating: 4.7,
        image: logo,
        description: 'متخصص في توفير الأجهزة الإلكترونية والكهربائية بأسعار الجملة.'
    },
    {
        id: '4',
        name: 'سوق الجملة المركزي',
        address: 'شارع الملك عبدالله، مكة المكرمة',
        rating: 4.0,
        image: logo,
        description: 'يجمع أفضل تجار الجملة في المنطقة لتوفير مختلف السلع بأسعار مناسبة.'
    },
    {
        id: '5',
        name: 'مجمع تجار الجملة',
        address: 'شارع الأمير سلطان، المدينة المنورة',
        rating: 4.8,
        image: logo,
        description: 'مركز متكامل يضم مئات المحلات لبيع مختلف البضائع بالجملة.'
    },
];

const StoreItem = ({ item }) => (
    <TouchableOpacity style={styles.storeItem}>
        <Image source={ item.image } style={styles.storeImage} width="100" />
        <View style={styles.storeInfo}>
            <Text style={styles.storeName}>{item.name}</Text>
            <Text style={styles.storeAddress}>{item.address}</Text>
            <Text style={styles.storeDescription}>{item.description}</Text>
        </View>
    </TouchableOpacity>
);

export default function WholesaleStoresScreen() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>متاجر الجملة</Text>
                <Text style={styles.headerSubtitle}>اكتشف أفضل متاجر الجملة في مدينتك</Text>
            </View>
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={24} color="#666666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="ابحث عن متاجر الجملة"
                    placeholderTextColor="#666666"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    textAlign="right"
                />
            </View>
            <FlatList
                data={wholesaleStores}
                renderItem={({ item }) => <StoreItem item={item} />}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
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
        padding: 25,
        paddingTop: 70,
        backgroundColor: GREEN,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'Arial',
        textAlign: 'right',
    },
    headerSubtitle: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: 'Arial',
        marginTop: 8,
        textAlign: 'right',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 25,
        margin: 20,
        paddingHorizontal: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    searchIcon: {
        marginLeft: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 10,
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#333333',
    },
    listContainer: {
        padding: 20,
    },
    storeItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        textAlign: 'right',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginBottom: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4.65,
        elevation: 6,
    },
    storeImage: {
        width: 100,
        height: 100,
        borderRadius: 15,
        marginLeft: 20,
    },
    storeInfo: {
        flex: 1,
        textAlign: 'right',
    },
    storeName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 6,
        fontFamily: 'Arial',
        textAlign: 'right',
    },
    storeAddress: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 8,
        fontFamily: 'Arial',
        textAlign: 'right',
    },
    storeDescription: {
        fontSize: 14,
        color: '#444444',
        marginBottom: 10,
        fontFamily: 'Arial',
        lineHeight: 20,
        textAlign: 'right',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 14,
        color: '#333333',
        marginRight: 4,
        fontFamily: 'Arial',
        fontWeight: 'bold',
    },
});

