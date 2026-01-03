import { useState, useCallback } from "react";
import { bookService } from "../services";

export const useBooks = () => {
    const [books, setBooks] = useState([]);
    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBooks = useCallback(async(params = {}) => {
        try {
            setLoading(true);
            setError(null);
            const result = await bookService.getAllBooks(params);
            if (result.success) {
                setBooks(result.data);
            }
        } catch (err) {
            setError(err.error || "Failed to fetch books");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchFeaturedBooks = useCallback(async() => {
        try {
            setLoading(true);
            setError(null);
            const result = await bookService.getFeaturedBooks();
            if (result.success) {
                setFeaturedBooks(result.data);
            }
        } catch (err) {
            setError(err.error || "Failed to fetch featured books");
        } finally {
            setLoading(false);
        }
    }, []);

    const searchBooks = useCallback(async(query) => {
        try {
            setLoading(true);
            setError(null);
            const result = await bookService.searchBooks(query);
            if (result.success) {
                setBooks(result.data);
            }
        } catch (err) {
            setError(err.error || "Search failed");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        books,
        featuredBooks,
        loading,
        error,
        fetchBooks,
        fetchFeaturedBooks,
        searchBooks,
    };
};