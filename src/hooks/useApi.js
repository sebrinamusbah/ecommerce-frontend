import { useState, useCallback } from "react";
import { api } from "../context/AuthContext";

export const useApi = (initialState = null) => {
    const [data, setData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(
        async(method, url, requestData = null, config = {}) => {
            setLoading(true);
            setError(null);

            try {
                const response = await api.request({
                    method,
                    url,
                    data: requestData,
                    ...config,
                });
                setData(response.data);
                return response.data;
            } catch (err) {
                const errorMessage =
                    err.response?.data?.message || err.message || "Something went wrong";
                setError(errorMessage);
                throw new Error(errorMessage);
            } finally {
                setLoading(false);
            }
        }, []
    );

    const get = useCallback(
        (url, config = {}) => request("GET", url, null, config), [request]
    );
    const post = useCallback(
        (url, data, config = {}) => request("POST", url, data, config), [request]
    );
    const put = useCallback(
        (url, data, config = {}) => request("PUT", url, data, config), [request]
    );
    const patch = useCallback(
        (url, data, config = {}) => request("PATCH", url, data, config), [request]
    );
    const del = useCallback(
        (url, config = {}) => request("DELETE", url, null, config), [request]
    );

    const clearError = useCallback(() => setError(null), []);
    const clearData = useCallback(() => setData(initialState), [initialState]);

    return {
        data,
        loading,
        error,
        get,
        post,
        put,
        patch,
        delete: del,
        clearError,
        clearData,
        setData,
    };
};