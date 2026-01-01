import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useCallback } from "react";

export const useBooks = () => {
    const { getBooks, getBookById } = useAuth();
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBooks = useCallback(
        async(params = {}) => {
            setLoading(true);
            setError(null);
            try {
                const data = await getBooks();
                setBooks(data);
                return data;
            } catch (err) {
                setError(err.message);
                throw err;
            } finally {
                setLoading(false);
            }
        }, [getBooks]
    );

    const fetchBookById = useCallback(
        async(id) => {
            setLoading(true);
            setError(null);
            try {
                const data = await getBookById(id);
                setSelectedBook(data);
                return data;
            } catch (err) {
                setError(err.message);
                throw err;
            } finally {
                setLoading(false);
            }
        }, [getBookById]
    );

    const searchBooks = useCallback(
        async(searchTerm) => {
            setLoading(true);
            setError(null);
            try {
                const data = await getBooks();
                const filtered = data.filter(
                    (book) =>
                    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    book.description?.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setBooks(filtered);
                return filtered;
            } catch (err) {
                setError(err.message);
                throw err;
            } finally {
                setLoading(false);
            }
        }, [getBooks]
    );

    const filterBooksByCategory = useCallback(
        async(categoryId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await getBooks();
                const filtered = data.filter((book) => book.category === categoryId);
                setBooks(filtered);
                return filtered;
            } catch (err) {
                setError(err.message);
                throw err;
            } finally {
                setLoading(false);
            }
        }, [getBooks]
    );

    // Fetch books on mount
    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    return {
        books,
        selectedBook,
        loading,
        error,
        fetchBooks,
        fetchBookById,
        searchBooks,
        filterBooksByCategory,
        clearSelectedBook: () => setSelectedBook(null),
        refetchBooks: fetchBooks,
    };
};