import { createContext, useState } from 'react';

export const CartContext = createContext({
    cart: {},
    addToCart: () => {},
    removeFromCart: () => {},
    clearCart: () => {},
});

export function CartProvider({ children }) {
    // Structure: { storeId: { storeName: string, products: [{ product, quantity }] } }
    const [cart, setCart] = useState({});

    const addToCart = (storeId, storeName, product) => {
        setCart(prevCart => {
            const storeCart = prevCart[storeId] || { storeName, products: [] };
            const existingProduct = storeCart.products.find(item => item.product.id === product.id);

            if (existingProduct) {
                // Update quantity if product exists
                const updatedProducts = storeCart.products.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
                return {
                    ...prevCart,
                    [storeId]: { ...storeCart, products: updatedProducts }
                };
            } else {
                // Add new product
                return {
                    ...prevCart,
                    [storeId]: {
                        ...storeCart,
                        products: [...storeCart.products, { product, quantity: 1 }]
                    }
                };
            }
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
        setCart({});
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
} 