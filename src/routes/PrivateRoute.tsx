import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/providers/AuthContext";

export const PrivateRoute: React.FC = () => {
	const { username, isAuthenticated } = useAuth();

	return username && isAuthenticated ? <Outlet /> : <Navigate replace to="/" />;
};
