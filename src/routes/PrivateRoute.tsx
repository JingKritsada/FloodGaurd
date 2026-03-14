import type { Role } from "@/types/index.types";

import React from "react";
import { Outlet } from "react-router-dom";

import { useAuth } from "@/providers/AuthContext";
import ForbiddenPage from "@/pages/ForbiddenPage";

interface PrivateRouteProps {
	allowedRoles?: Role[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
	const { username, isAuthenticated, userRole } = useAuth();

	if (!isAuthenticated || !username) {
		return <ForbiddenPage />;
	}

	if (allowedRoles && !allowedRoles.includes(userRole)) {
		return <ForbiddenPage />;
	}

	return <Outlet />;
};
