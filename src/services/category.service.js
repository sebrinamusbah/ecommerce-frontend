import api from "./api";

const categoryService = {
    getAllCategories: async() => {
        try {
            const response = await api.get("/categories");
            return response.data;
        } catch (error) {
            throw error.response ? .data || { error: "Failed to fetch categories" };
        }
    },

    getCategoriesSummary: async() => {
        try {
            const response = await api.get("/categories/summary");
            return response.data;
        } catch (error) {
            throw (
                error.response ? .data || { error: "Failed to fetch categories summary" }
            );
        }
    },
};

export default categoryService;