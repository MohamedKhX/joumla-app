import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { CartContext } from '../../../contexts/CartContext';
import { Ionicons } from '@expo/vector-icons';
import logo from '../../../assets/images/logo.webp';
import AuthContext from '../../../contexts/AuthContext';
import axios from '../../../utils/axios';
import Checkbox from 'expo-checkbox';
import picker from "react-native-web/dist/exports/Picker";
import {Picker} from "@react-native-picker/picker";

const GREEN = '#34D399';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
    console.log(item);
    return (
        <View style={styles.cartItem}>
            <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
                <Ionicons name="trash-outline" size={24} color="#FF4444" />
            </TouchableOpacity>
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.product.name}</Text>
                <Text style={styles.productPrice}>{item.product.price} دينار</Text>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => onUpdateQuantity(item.quantity + 1)}
                    >
                        <Ionicons name="add" size={20} color={GREEN} />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{item.quantity}</Text>
                    <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => item.quantity > 1 && onUpdateQuantity(item.quantity - 1)}
                    >
                        <Ionicons name="remove" size={20} color={GREEN} />
                    </TouchableOpacity>
                </View>
            </View>
            <Image source={item.product.thumbnail ? { uri: item.product.thumbnail } : logo} style={styles.productImage} />
        </View>
    );
}


const StoreSection = ({ storeId, storeData, onRemoveItem, onUpdateQuantity }) => {
    const storeTotal = storeData.products.reduce((total, item) =>
        total + (parseFloat(item.product.price) * item.quantity), 0
    );

    const isMinimumMet = storeTotal >= 500;
    const [isChecked, setChecked] = useState(false);

    const handleCheckboxChange = (newValue) => {
        setChecked(newValue);
        storeData.is_deferred = newValue;
    };

    return (
        <View style={styles.storeSection}>
            <Text style={styles.storeName}>{storeData.storeName}</Text>
            {storeData.products.map((item) => (
                <CartItem
                    key={item.product.id}
                    item={item}
                    onRemove={() => onRemoveItem(storeId, item.product.id)}
                    onUpdateQuantity={(newQuantity) => onUpdateQuantity(storeId, item.product.id, newQuantity)}
                />
            ))}
            <View style={styles.checkboxContainer}>
                <Text style={styles.checkboxLabel}>بالآجل</Text>
                <Checkbox
                    style={styles.checkbox}
                    value={isChecked}
                    onValueChange={handleCheckboxChange}
                    color={isChecked ? '#34D399' : undefined} // Green color when checked
                />
            </View>
            <View style={styles.storeTotalContainer}>
                <Text style={styles.storeTotalText}>
                    المجموع: {storeTotal.toFixed(2)} دينار
                </Text>
                {!isMinimumMet && (
                    <Text style={styles.minimumWarning}>
                        الحد الأدنى للطلب 500 دينار
                    </Text>
                )}
            </View>
        </View>
    );
};

export default function CartScreen() {
    const { user } = useContext(AuthContext);
    const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const stores = Object.entries(cart);
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState(null);
    const [loadingAreas, setLoadingAreas] = useState(true);

    useEffect(() => {
        loadAreas();
    }, []);

    const loadAreas = async () => {
        try {
            const { data } = await axios.get('/areas');
            setAreas(data);
            if (data.length > 0) {
                setSelectedArea(data[0].id);
            }
        } catch (error) {
            console.error('Error loading areas:', error);
            Alert.alert('خطأ', 'حدث خطأ في تحميل مناطق التوصيل');
        } finally {
            setLoadingAreas(false);
        }
    };

    if (stores.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="cart-outline" size={64} color={GREEN} />
                <Text style={styles.emptyText}>السلة فارغة</Text>
            </View>
        );
    }

    const totalAmount = stores.reduce((total, [_, storeData]) => 
        total + storeData.products.reduce((storeTotal, item) => 
            storeTotal + (parseFloat(item.product.price) * item.quantity), 0
        ), 0
    );

    const deliveryFee = selectedArea ? 
        areas.find(area => area.id === selectedArea)?.price || 0 : 0;

    const grandTotal = totalAmount + deliveryFee;

    const allStoresMeetMinimum = stores.every(([_, storeData]) => {
        const storeTotal = storeData.products.reduce((total, item) => 
            total + (parseFloat(item.product.price) * item.quantity), 0
        );
        return storeTotal >= 500;
    });

    const handleCheckout = async () => {
        if (!selectedArea) {
            Alert.alert('تنبيه', 'الرجاء اختيار منطقة التوصيل');
            return;
        }

        if (!allStoresMeetMinimum) {
            Alert.alert(
                'تنبيه',
                'يجب أن يكون الحد الأدنى للطلب 500 دينار لكل متجر',
                [{ text: 'حسناً', style: 'default' }]
            );
            return;
        }

        try {
            setIsSubmitting(true);
            const orders = stores.map(([storeId, storeData]) => ({
                wholesale_store_id: parseInt(storeId),
                products: storeData.products.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity,
                    price: parseFloat(item.product.price)
                })),
                deferred: storeData.is_deferred
            }));

            await axios.post('/trader/orders', {
                trader_id: user.trader.id,
                area_id: selectedArea,
                orders: orders
            });

            clearCart();
            Alert.alert('نجاح', 'تم إرسال طلبك بنجاح', [{ text: 'حسناً', style: 'default' }]);
        } catch (error) {
            console.error('Order submission error:', error);
            Alert.alert(
                'خطأ',
                error.response?.data?.message || 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى',
                [{ text: 'حسناً', style: 'default' }]
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {stores.map(([storeId, storeData]) => (
                    <StoreSection
                        key={storeId}
                        storeId={storeId}
                        storeData={storeData}
                        onRemoveItem={removeFromCart}
                        onUpdateQuantity={updateQuantity}
                    />
                ))}
            </ScrollView>
            <View style={styles.footer}>
                <View style={styles.deliverySection}>
                    <Text style={styles.deliveryLabel}>منطقة التوصيل:</Text>
                    {loadingAreas ? (
                        <ActivityIndicator size="small" color={GREEN} />
                    ) : (
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedArea}
                                onValueChange={setSelectedArea}
                                style={styles.picker}
                            >
                                {areas.map(area => (
                                    <Picker.Item 
                                        key={area.id}
                                        label={`${area.name} (${area.price} دينار)`}
                                        value={area.id}
                                    />
                                ))}
                            </Picker>
                        </View>
                    )}
                </View>
                <View style={styles.totalBreakdown}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>المجموع الفرعي:</Text>
                        <Text style={styles.totalValue}>{totalAmount.toFixed(2)} دينار</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>رسوم التوصيل:</Text>
                        <Text style={styles.totalValue}> دينار</Text>
                    </View>
                    <View style={[styles.totalRow, styles.grandTotalRow]}>
                        <Text style={styles.grandTotalLabel}>الإجمالي:</Text>
                        <Text style={styles.grandTotalValue}> دينار</Text>
                    </View>
                </View>
                <TouchableOpacity 
                    style={[
                        styles.checkoutButton,
                        (!allStoresMeetMinimum || isSubmitting) && styles.checkoutButtonDisabled
                    ]}
                    onPress={handleCheckout}
                    disabled={!allStoresMeetMinimum || isSubmitting}
                >
                    <Text style={styles.checkoutButtonText}>
                        {isSubmitting ? 'جاري إرسال الطلب...' : 
                         allStoresMeetMinimum ? 'إتمام الطلب' : 
                         'يجب إكمال الحد الأدنى للطلب'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContent: {
        padding: 15,
        paddingBottom: 100,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    emptyText: {
        fontSize: 18,
        color: '#666666',
        marginTop: 16,
    },
    storeSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    storeName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: GREEN,
        marginBottom: 15,
        textAlign: 'right',
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    productInfo: {
        flex: 1,
        marginHorizontal: 15,
        alignItems: 'flex-end',
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333333',
        textAlign: 'right',
    },
    productPrice: {
        fontSize: 14,
        color: GREEN,
        marginTop: 4,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    quantityButton: {
        backgroundColor: '#F5F5F5',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    quantity: {
        fontSize: 16,
        color: '#333333',
        minWidth: 30,
        textAlign: 'center',
    },
    removeButton: {
        padding: 5,
    },
    storeTotalContainer: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    storeTotalText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'right',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    deliverySection: {
        marginBottom: 15,
    },
    deliveryLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
        textAlign: 'right',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        backgroundColor: '#F9FAFB',
        marginBottom: 10,
    },
    picker: {
        height: 50,
    },
    totalBreakdown: {
        marginBottom: 15,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    totalLabel: {
        fontSize: 14,
        color: '#666666',
    },
    totalValue: {
        fontSize: 14,
        color: '#333333',
        fontWeight: '600',
    },
    grandTotalRow: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 8,
        marginTop: 8,
    },
    grandTotalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
    },
    grandTotalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: GREEN,
    },
    checkoutButton: {
        backgroundColor: GREEN,
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    minimumWarning: {
        color: '#FF3B30',
        fontSize: 14,
        marginTop: 5,
        textAlign: 'right',
    },
    checkoutButtonDisabled: {
        backgroundColor: '#CCCCCC',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end', // Align to the right
        marginTop: 12,
        marginLeft: 5,
        marginRight: 5
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333333',
        marginRight: 5
    },
    checkbox: {

    },
});

