import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect, useCallback } from "react";

export const useCart = () => {
    const {
        user,
        getCart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
    } = useAuth();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCart = useCallback(async() => {
        if (!user) {
            setCart(null);
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await getCart();
            setCart(data);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [user, getCart]);

    const addItemToCart = useCallback(
        async(bookId, quantity = 1) => {
            if (!user) {
                throw new Error("Please login to add items to cart");
            }

            setLoading(true);
            setError(null);
            try {
                const data = await addToCart(bookId, quantity);
                await fetchCart(); // Refresh cart
                return data;
            } catch (err) {
                setError(err.message);
                throw err;
            } finally {
                setLoading(false);
            }
        }, [user, addToCart, fetchCart]
    );

    const removeItemFromCart = useCallback(
        async(cartItemId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await removeFromCart(cartItemId);
                await fetchCart(); // Refresh cart
                return data;
            } catch (err) {
                setError(err.message);
                throw err;
            } finally {
                setLoading(false);
            }
        }, [removeFromCart, fetchCart]
    );

    const updateItemQuantity = useCallback(
        async(cartItemId, quantity) => {
            setLoading(true);
            setError(null);
            try {
                const data = await updateCartItem(cartItemId, quantity);
                await fetchCart(); // Refresh cart
                return data;
            } catch (err) {
                setError(err.message);
                throw err;
            } finally {
                setLoading(false);
            }
        }, [updateCartItem, fetchCart]
    );

    const emptyCart = useCallback(async() => {
        setLoading(true);
        setError(null);
        try {
            const data = await clearCart();
            setCart(null);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [clearCart]);

    // Calculate cart statistics
    const calculateTotal = useCallback(() => {
        if (!cart || !cart.items || cart.items.length === 0) return 0;

        return cart.items.reduce((total, item) => {
            return total + (item.book ? .price || 0) * (item.quantity || 1);
        }, 0);
    }, [cart]);

    const getItemCount = useCallback(() => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((count, item) => count + (item.quantity || 1), 0);
    }, [cart]);

    // Fetch cart on mount and when user changes
    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart(null);
        }
    }, [user, fetchCart]);

    return {
        cart,
        loading,
        error,
        cartItems: cart ? .items || [],
        cartTotal: calculateTotal(),
        itemCount: getItemCount(),
        isEmpty: !cart ? .items || cart.items.length === 0,
        fetchCart,
        addItemToCart,
        removeItemFromCart,
        updateItemQuantity,
        emptyCart,
        refreshCart: fetchCart,
    };
};