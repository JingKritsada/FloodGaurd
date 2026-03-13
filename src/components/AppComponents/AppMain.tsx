import { Routes, Route } from "react-router-dom";

import { NotFoundPage } from "@/pages/NotFoundPage";
import { PrivateRoute } from "@/routes/PrivateRoute";
import AlertDemoPage from "@/pages/demo/AlertDemoPage";
import ButtonDemoPage from "@/pages/demo/ButtonDemoPage";
import InputDemoPage from "@/pages/demo/InputDemoPage";

export default function AppMain() {
	return (
		<main className="relative grow overflow-hidden">
			<Routes>
				{/* Public Routes */}

				{/* Protected Owner Routes */}
				<Route element={<PrivateRoute />}>
					{/* <Route element={<OwnerDashboardPage />} path="/owner/dashboard" /> */}
				</Route>

				{/* Demo Routes */}
				<Route element={<AlertDemoPage />} path="/demo/alert" />
				<Route element={<ButtonDemoPage />} path="/demo/button" />
				<Route element={<InputDemoPage />} path="/demo/input" />

				{/* Catch all - Not Found */}
				<Route element={<NotFoundPage />} path="*" />
			</Routes>
		</main>
	);
}
