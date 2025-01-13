import { createContext, useState } from 'react';

export const CartContext = createContext({
    cart: {},
    addToCart: () => {},
    removeFromCart: () => {},
    clearCart: () => {},
});

export function CartProvider({ children }) {
    const [cart, setCart] = useState({});
    const addToCart = (storeId, storeName, product) => {
        if (!storeId || !storeName || !product) {
            console.error('Missing required parameters:', { storeId, storeName, product });
            return;
        }

        setCart(prevCart => {
            console.log('Previous cart:', prevCart); // Debug log
            const storeCart = prevCart[storeId] || { storeName, products: [] };
            const existingProduct = storeCart.products.find(item => item.product.id === product.id);

            const newCart = existingProduct ? {
                ...prevCart,
                [storeId]: {
                    ...storeCart,
                    products: storeCart.products.map(item =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    )
                }
            } : {
                ...prevCart,
                [storeId]: {
                    ...storeCart,
                    products: [...storeCart.products, { product, quantity: 1 }]
                }
            };

            console.log('New cart:', newCart); // Debug log
            return newCart;
        });
    };

    const removeFromCart = (storeId, productId) => {
        setCart(prevCart => {
            const storeCart = prevCart[storeId];
            if (!storeCart) return prevCart;

            const updatedProducts = storeCart.products.filter(item => item.product.id !== productId);
            
            if (updatedProducts.length === 0) {
                const { [storeId]: _, ...restCart } = prevCart;
                return restCart;
            }

            return {
                ...prevCart,
                [storeId]: { ...storeCart, products: updatedProducts }
            };
        });
    };

    const clearCart = () => {
        console.log('asdfasdf')
        setCart({});
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
} 