import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService } from '../services/api';

const CartContext = createContext();
const ORDERS_STORAGE_KEY = 'kaapi_katte_orders';

function readStoredOrders() {
    try {
        const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

function createOrderId() {
    return `ORD-${Date.now().toString().slice(-8)}`;
}

function sanitizeCustomerDetails(customerDetails = {}) {
    return {
        name: `${customerDetails.name || ''}`.trim(),
        phone: `${customerDetails.phone || ''}`.replace(/\D/g, '').slice(0, 10)
    };
}

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isChef, setIsChef] = useState(false);
    const [orders, setOrders] = useState(readStoredOrders);

    const toggleChefMode = () => setIsChef(!isChef);

    useEffect(() => {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    }, [orders]);

    const addToCart = (item) => {
        setCart((prev) => {
            const existing = prev.find((entry) => entry.name === item.name);
            if (existing) {
                return prev.map((entry) =>
                    entry.name === item.name ? { ...entry, count: entry.count + 1 } : entry
                );
            }

            return [...prev, { ...item, count: 1 }];
        });
    };

    const removeFromCart = (itemName) => {
        setCart((prev) => prev.filter((item) => item.name !== itemName));
    };

    const updateQuantity = (itemName, amount) => {
        setCart((prev) =>
            prev
                .map((item) => {
                    if (item.name !== itemName) {
                        return item;
                    }

                    const nextCount = item.count + amount;
                    return nextCount > 0 ? { ...item, count: nextCount } : null;
                })
                .filter(Boolean)
        );
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.count, 0);

    const placeOrder = async (customerDetails) => {
        const sanitizedCustomer = sanitizeCustomerDetails(customerDetails);
        const timestamp = new Date().toISOString();
        const orderId = createOrderId();

        const newOrder = {
            id: orderId,
            timestamp,
            items: cart.map((item) => ({ ...item })),
            total: cartTotal,
            customer: sanitizedCustomer,
            customerName: sanitizedCustomer.name,
            customerPhone: sanitizedCustomer.phone,
            status: 'Preparing',
            syncStatus: 'pending'
        };

        setOrders((prev) => [newOrder, ...prev]);
        setCart([]);

        try {
            const syncResult = await apiService.recordPayment(newOrder);
            const syncedOrder = {
                ...newOrder,
                syncStatus: syncResult.status,
                syncedAt: syncResult.sentAt
            };

            setOrders((prev) =>
                prev.map((order) => (order.id === orderId ? syncedOrder : order))
            );

            return syncedOrder;
        } catch (error) {
            const failedOrder = {
                ...newOrder,
                syncStatus: 'failed',
                syncError: error?.message || 'Unable to sync order to backend'
            };

            setOrders((prev) =>
                prev.map((order) => (order.id === orderId ? failedOrder : order))
            );

            return failedOrder;
        }
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders((prev) =>
            prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
        );
    };

    return (
        <CartContext.Provider
            value={{
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
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
