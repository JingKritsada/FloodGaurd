import type { Role } from "@/types/index.types";

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/providers/AuthContext";

interface PrivateRouteProps {
	allowedRoles?: Role[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
	const { username, isAuthenticated, userRole } = useAuth();

	if (!isAuthenticated || !username) {
		return <Navigate replace to="/" />;
	}

	if (allowedRoles && !allowedRoles.includes(userRole)) {
		return <Navigate replace to="/" />; // Or navigate to a "Forbidden" page
	}

	return <Outlet />;
};
