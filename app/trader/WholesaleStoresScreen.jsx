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

// Sample data for products
const products = [
    { id: '1', name: 'قميص قطني', price: 45, image: logo, category: 'ملابس' },
    { id: '2', name: 'بنطلون جينز', price: 60, image: logo, category: 'ملابس' },
    { id: '3', name: 'حذاء رياضي', price: 80, image: logo, category: 'أحذية' },
    { id: '4', name: 'ساعة يد', price: 120, image: logo, category: 'إكسسوارات' },
    { id: '5', name: 'حقيبة ظهر', price: 55, image: logo, category: 'حقائب' },
    { id: '6', name: 'نظارة شمسية', price: 35, image: logo, category: 'إكسسوارات' },
];

const ProductItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.productItem} onPress={onPress}>
        <Image source={ item.image } style={styles.productImage} />
        <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price} ريال</Text>
            <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>{item.category}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

export default function WholesaleStoreProductsScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('الكل');

    const categories = ['الكل', 'ملابس', 'أحذية', 'إكسسوارات', 'حقائب'];

    const filteredProducts = products.filter(product =>
        (selectedCategory === 'الكل' || product.category === selectedCategory) &&
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>منتجات الجملة</Text>
                <Text style={styles.headerSubtitle}>اكتشف تشكيلتنا الواسعة من المنتجات</Text>
            </View>
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={24} color="#666666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="ابحث عن المنتجات"
                    placeholderTextColor="#666666"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    textAlign="right"
                />
            </View>
            <View style={styles.categoriesContainer}>
                <FlatList
                    data={categories}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.categoryButton,
                                selectedCategory === item && styles.selectedCategoryButton
                            ]}
                            onPress={() => setSelectedCategory(item)}
                        >
                            <Text style={[
                                styles.categoryButtonText,
                                selectedCategory === item && styles.selectedCategoryButtonText
                            ]}>{item}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <FlatList
                data={filteredProducts}
                renderItem={({ item }) => <ProductItem item={item} onPress={() => console.log('Product pressed:', item.name)} />}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.productList}
                numColumns={2}
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
    categoriesContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    categoryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        marginRight: 10,
    },
    selectedCategoryButton: {
        backgroundColor: GREEN,
    },
    categoryButtonText: {
        color: '#333333',
        fontFamily: 'Arial',
        fontSize: 14,
    },
    selectedCategoryButtonText: {
        color: '#FFFFFF',
    },
    productList: {
        paddingHorizontal: 10,
    },
    productItem: {
        flex: 1,
        margin: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
    },
    productImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    productInfo: {
        padding: 15,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        fontFamily: 'Arial',
        marginBottom: 5,
        textAlign: 'right',
    },
    productPrice: {
        fontSize: 14,
        color: GREEN,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'right',
    },
    categoryTag: {
        backgroundColor: LIGHT_GREEN,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        alignSelf: 'flex-end',
    },
    categoryText: {
        color: GREEN,
        fontSize: 12,
        fontFamily: 'Arial',
    },
});

