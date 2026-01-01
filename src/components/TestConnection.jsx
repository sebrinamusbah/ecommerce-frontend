import React, { useState, useEffect } from "react";
import api from "../services/api";

const TestConnection = () => {
  const [status, setStatus] = useState("Checking...");
  const [data, setData] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await api.get("/health");
        setStatus("Connected ✅");
        setData(response.data);
      } catch (error) {
        setStatus(`Failed ❌: ${error.message}`);
      }
    };

    checkConnection();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        background: "#f5f5f5",
        margin: "20px",
        borderRadius: "8px",
      }}
    >
      <h3>Backend Connection Test</h3>
      <p>
        Status: <strong>{status}</strong>
      </p>
      {data && (
        <div>
          <p>Backend Message: {data.message}</p>
          <p>Backend Status: {data.status}</p>
        </div>
      )}
    </div>
  );
};

export default TestConnection;
