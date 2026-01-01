import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect, useCallback } from "react";

export const useCategories = () => {
    const { getCategories } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async() => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCategories();
            setCategories(data);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [getCategories]);

    const getCategoryById = useCallback(
        (categoryId) => {
            return categories.find((category) => category._id === categoryId);
        }, [categories]
    );

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        loading,
        error,
        fetchCategories,
        getCategoryById,
        refetchCategories: fetchCategories,
    };
};