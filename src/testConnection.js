// src/testConnection.js
import { testBackendConnection } from "./utils/apiTest";

// Run this in browser console or useEffect
const runTests = async () => {
  console.log("Testing Backend Connection...");

  const result = await testBackendConnection();

  if (result.success) {
    console.log("✅ Backend is connected!");
    console.log("📚 Books data:", result.books);

    // Test auth endpoints
    try {
      const registerTest = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Test User",
            email: `test${Date.now()}@example.com`,
            password: "password123",
          }),
        }
      );
      console.log("Register endpoint:", await registerTest.json());
    } catch (err) {
      console.log("Register test:", err);
    }
  } else {
    console.error("❌ Backend connection failed:", result.error);
  }
};

export default runTests;
