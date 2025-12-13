import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!sessionStorage.getItem("accessToken");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />; // redirect to login
  }

  return children; // agar authenticated hai to children render karo
};

export default ProtectedRoute;
