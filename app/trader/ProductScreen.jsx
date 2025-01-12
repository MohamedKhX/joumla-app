import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    StatusBar,
    I18nManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import logo from '../../assets/images/logo.webp';

// Force RTL layout
I18nManager.forceRTL(true);

const { width } = Dimensions.get('window');
const GREEN = '#34D399';
const LIGHT_GREEN = '#E8FDF5';

// Sample product data
const productScreen = {
    id: '1',
    name: 'قميص قطني فاخر',
    price: 120,
    discountPrice: 99,
    images: [
        logo,
        logo,
        logo,
    ],
    description: 'قميص قطني فاخر مصنوع من أجود أنواع القطن المصري. مريح وأنيق، مناسب للمناسبات الرسمية وشبه الرسمية.',
    features: [
        'قطن مصري 100%',
        'متوفر بعدة ألوان',
        'أزرار مصدفية',
        'ياقة كلاسيكية',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    minOrder: 50,
};

export default function ProductShowScreen() {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');

    return (
        <ScrollView style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}>
                    <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>تفاصيل المنتج</Text>
                <TouchableOpacity style={styles.shareButton}>
                    <Ionicons name="share-social" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
                <Image source={ productScreen.images[selectedImage] } style={styles.mainImage} />
                <View style={styles.imagePicker}>
                    {productScreen.images.map((image, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => setSelectedImage(index)}
                            style={[
                                styles.thumbnailContainer,
                                selectedImage === index && styles.selectedThumbnail,
                            ]}
                        >
                            <Image source={ image } style={styles.thumbnail} />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.productName}>{productScreen.name}</Text>
                <View style={styles.priceContainer}>
                    <Text style={styles.discountPrice}>{productScreen.discountPrice} ريال</Text>
                    <Text style={styles.originalPrice}>{productScreen.price} ريال</Text>
                </View>
                <Text style={styles.description}>{productScreen.description}</Text>
                <View style={styles.featuresContainer}>
                    <Text style={styles.featuresTitle}>المميزات:</Text>
                    {productScreen.features.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                            <Ionicons name="checkmark-circle" size={20} color={GREEN} />
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.sizesContainer}>
                    <Text style={styles.sizesTitle}>المقاسات المتوفرة:</Text>
                    <View style={styles.sizeButtons}>
                        {productScreen.sizes.map((size) => (
                            <TouchableOpacity
                                key={size}
                                style={[
                                    styles.sizeButton,
                                    selectedSize === size && styles.selectedSizeButton,
                                ]}
                                onPress={() => setSelectedSize(size)}
                            >
                                <Text style={[
                                    styles.sizeButtonText,
                                    selectedSize === size && styles.selectedSizeButtonText,
                                ]}>{size}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={styles.orderInfo}>
                    <Ionicons name="information-circle-outline" size={24} color={GREEN} />
                    <Text style={styles.orderInfoText}>الحد الأدنى للطلب: {productScreen.minOrder} قطعة</Text>
                </View>
            </View>
            <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.addToCartButton}>
                    <Text style={styles.addToCartButtonText}>أضف إلى السلة</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactButton}>
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color={GREEN} />
                    <Text style={styles.contactButtonText}>تواصل مع البائع</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: GREEN,
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Arial',
    },
    shareButton: {
        padding: 5,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: LIGHT_GREEN,
    },
    mainImage: {
        width: '100%',
        height: '80%',
        resizeMode: 'cover',
    },
    imagePicker: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '20%',
    },
    thumbnailContainer: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginHorizontal: 5,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedThumbnail: {
        borderColor: GREEN,
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    infoContainer: {
        padding: 20,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
        fontFamily: 'Arial',
        marginBottom: 10,
        textAlign: 'right',
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 15,
    },
    discountPrice: {
        fontSize: 22,
        fontWeight: 'bold',
        color: GREEN,
        fontFamily: 'Arial',
        marginLeft: 10,
    },
    originalPrice: {
        fontSize: 18,
        color: '#999999',
        textDecorationLine: 'line-through',
        fontFamily: 'Arial',
    },
    description: {
        fontSize: 16,
        color: '#666666',
        fontFamily: 'Arial',
        lineHeight: 24,
        marginBottom: 20,
        textAlign: 'right',
    },
    featuresContainer: {
        marginBottom: 20,
    },
    featuresTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        fontFamily: 'Arial',
        marginBottom: 10,
        textAlign: 'right',
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        justifyContent: 'flex-end',
    },
    featureText: {
        fontSize: 16,
        color: '#666666',
        fontFamily: 'Arial',
        marginRight: 10,
        textAlign: 'right',
    },
    sizesContainer: {
        marginBottom: 20,
    },
    sizesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        fontFamily: 'Arial',
        marginBottom: 10,
        textAlign: 'right',
    },
    sizeButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
    },
    sizeButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        marginLeft: 10,
        marginBottom: 10,
    },
    selectedSizeButton: {
        backgroundColor: GREEN,
        borderColor: GREEN,
    },
    sizeButtonText: {
        fontSize: 14,
        color: '#333333',
        fontFamily: 'Arial',
    },
    selectedSizeButtonText: {
        color: '#FFFFFF',
    },
    orderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: LIGHT_GREEN,
        padding: 15,
        borderRadius: 10,
        justifyContent: 'flex-end',
    },
    orderInfoText: {
        fontSize: 16,
        color: '#333333',
        fontFamily: 'Arial',
        marginRight: 10,
        textAlign: 'right',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    addToCartButton: {
        backgroundColor: GREEN,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        flex: 1,
        marginRight: 10,
    },
    addToCartButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Arial',
        textAlign: 'center',
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: GREEN,
    },
    contactButtonText: {
        color: GREEN,
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Arial',
        marginLeft: 5,
    },
});

