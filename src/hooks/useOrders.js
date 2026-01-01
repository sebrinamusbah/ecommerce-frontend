import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect, useCallback } from "react";

export const useOrders = () => {
    const { user, createOrder, getOrders, getOrderById } = useAuth();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async() => {
        if (!user) {
            setOrders([]);
            return [];
        }

        setLoading(true);
        setError(null);
        try {
            const data = await getOrders();
            setOrders(data);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user, getOrders]);

    const placeOrder = useCallback(
        async(orderData) => {
            if (!user) {
                throw new Error("Please login to place an order");
            }

            setLoading(true);
            setError(null);
            try {
                const data = await createOrder(orderData);
                await fetchOrders(); // Refresh orders
                return data;
            } catch (err) {
                setError(err.message);
                throw err;
            } finally {
                setLoading(false);
            }
        }, [user, createOrder, fetchOrders]
    );

    const fetchOrderById = useCallback(
        async(orderId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await getOrderById(orderId);
                setSelectedOrder(data);
                return data;
            } catch (err) {
                setError(err.message);
                throw err;
            } finally {
                setLoading(false);
            }
        }, [getOrderById]
    );

    const getOrderStatusSummary = useCallback(() => {
        const summary = {
            total: orders.length,
            pending: orders.filter((o) => o.status === "pending").length,
            processing: orders.filter((o) => o.status === "processing").length,
            shipped: orders.filter((o) => o.status === "shipped").length,
            delivered: orders.filter((o) => o.status === "delivered").length,
            cancelled: orders.filter((o) => o.status === "cancelled").length,
        };
        return summary;
    }, [orders]);

    // Fetch orders on mount
    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user, fetchOrders]);

    return {
        orders,
        selectedOrder,
        loading,
        error,
        orderSummary: getOrderStatusSummary(),
        fetchOrders,
        placeOrder,
        fetchOrderById,
        clearSelectedOrder: () => setSelectedOrder(null),
        refetchOrders: fetchOrders,
    };
};