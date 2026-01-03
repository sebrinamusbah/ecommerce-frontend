import { useState, useCallback } from "react";
import { categoryService } from "../services";

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async() => {
        try {
            setLoading(true);
            setError(null);
            const result = await categoryService.getAllCategories();
            if (result.success) {
                setCategories(result.data);
            }
        } catch (err) {
            setError(err.error || "Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCategoriesSummary = useCallback(async() => {
        try {
            const result = await categoryService.getCategoriesSummary();
            if (result.success) {
                return result.data;
            }
        } catch (err) {
            console.error("Failed to fetch categories summary:", err);
        }
    }, []);

    return {
        categories,
        loading,
        error,
        fetchCategories,
        fetchCategoriesSummary,
    };
};