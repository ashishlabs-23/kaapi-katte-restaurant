import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isChef, setIsChef] = useState(false); // Simple mock auth

    const toggleChefMode = () => setIsChef(!isChef);

    // Try to load any existing orders from LocalStorage when the app starts
    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('kaapi_katte_orders');
        return saved ? JSON.parse(saved) : [];
    });

    // Whenever orders change, save them back to LocalStorage
    useEffect(() => {
        localStorage.setItem('kaapi_katte_orders', JSON.stringify(orders));
    }, [orders]);

    const addToCart = (item) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.name === item.name);
            if (existing) {
                return prev.map((i) =>
                    i.name === item.name ? { ...i, count: i.count + 1 } : i
                );
            }
            return [...prev, { ...item, count: 1 }];
        });
    };

    const removeFromCart = (itemName) => {
        setCart((prev) => prev.filter((i) => i.name !== itemName));
    };

    const updateQuantity = (itemName, amount) => {
        setCart((prev) =>
            prev.map((i) => {
                if (i.name === itemName) {
                    const newCount = i.count + amount;
                    return newCount > 0 ? { ...i, count: newCount } : i;
                }
                return i;
            })
        );
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.count, 0);

    const placeOrder = async (customerDetails) => {
        const orderId = "ORD-" + Math.floor(1000 + Math.random() * 9000);
        const newOrder = {
            id: orderId,
            timestamp: new Date().toISOString(),
            items: [...cart],
            total: cartTotal,
            customer: customerDetails,
            status: "Preparing"
        };

        // UI-First update for perceived speed
        setOrders(prev => [newOrder, ...prev]);
        setCart([]);

        // Background sync to Google Sheets (The "Senior" approach)
        try {
            await apiService.recordPayment({
                orderId: orderId,
                total: cartTotal,
                customer: customerDetails,
                items: cart.map(item => `${item.name} (${item.count})`).join(', '),
                time: new Date().toLocaleTimeString()
            });
            console.log(`[Sync] Order ${orderId} synchronized with Google Sheets.`);
        } catch (error) {
            console.error(`[Sync Error] Failed to upload order ${orderId}:`, error);
            // In a real app, we might add this to a retry queue
        }

        return newOrder;
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prev =>
            prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
        );
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            cartTotal,
            orders,
            placeOrder,
            updateOrderStatus,
            isChef,
            toggleChefMode
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
