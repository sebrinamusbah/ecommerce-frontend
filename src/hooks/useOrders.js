import { useAuth } from "./AuthContext";
import { useState, useEffect, useCallback } from "react";

export const useOrders = () => {
    const { user, createOrder, getOrders, getOrderById } = useAuth();
    const [orders, setOrders] = useState([]);
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
                return data;
            } catch (err) {
                setError(err.message);
                throw err;
            } finally {
                setLoading(false);
            }
        }, [getOrderById]
    );

    // Fetch orders on mount
    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user, fetchOrders]);

    return {
        orders,
        loading,
        error,
        fetchOrders,
        placeOrder,
        fetchOrderById,
        refetchOrders: fetchOrders,
    };
};