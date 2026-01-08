import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAdmin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin()) {
      console.log("User is not admin, redirecting to login");
      navigate("/login", {
        state: {
          from: window.location.pathname,
          message: "Admin access required",
        },
      });
    }
  }, [user, loading, isAdmin, navigate]);

  return {
    isAdmin: isAdmin(),
    isLoading: loading,
    user,
  };
};

export const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div> Loading... </div>;
  }

  if (!isAdmin()) {
    return <div> Access Denied.Admin privileges required. </div>;
  }

  return children;
};
