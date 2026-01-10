// src/utils/apiTest.js
export const testBackendConnection = async () => {
  try {
    // Test 1: Health Check
    const healthRes = await fetch(`${process.env.REACT_APP_API_URL}/health`);
    console.log("Health Check:", await healthRes.json());

    // Test 2: Get Books
    const booksRes = await fetch(`${process.env.REACT_APP_API_URL}/books`);
    const booksData = await booksRes.json();
    console.log("Books Response:", booksData);

    // Test 3: Get Categories
    const categoriesRes = await fetch(
      `${process.env.REACT_APP_API_URL}/categories`
    );
    console.log("Categories:", await categoriesRes.json());

    return { success: true, books: booksData };
  } catch (error) {
    console.error("Backend Connection Failed:", error);
    return { success: false, error: error.message };
  }
};
