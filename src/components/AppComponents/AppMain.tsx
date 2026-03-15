import { Routes, Route } from "react-router-dom";

import { PrivateRoute } from "@/routes/PrivateRoute";
import AlertDemoPage from "@/pages/demo/AlertDemoPage";
import InputDemoPage from "@/pages/demo/InputDemoPage";
import ButtonDemoPage from "@/pages/demo/ButtonDemoPage";
import MapPage from "@/pages/view/MapPage";
import TaskListPage from "@/pages/view/TaskListPage";
import DashboardPage from "@/pages/view/DashboardPage";
import AnnouncementListPage from "@/pages/view/AnnoucementListPage";
import RequestFormPage from "@/pages/view/RequestFormPage";
import IncidentFormPage from "@/pages/view/IncidentFormPage";
import AnnouncementFormPage from "@/pages/view/AnnoucementFormPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function AppMain() {
	return (
		<main className="relative grow overflow-hidden">
			<Routes>
				{/* Public Routes */}
				<Route element={<MapPage />} path="/" />
				<Route element={<RequestFormPage />} path="/request-form" />
				<Route element={<IncidentFormPage />} path="/incident-form" />
				<Route element={<AnnouncementListPage />} path="/announcements" />

				{/* Protected Officer and Admin Routes */}
				<Route element={<PrivateRoute allowedRoles={["ADMIN", "OFFICER"]} />}>
					<Route element={<TaskListPage />} path="/tasks" />
				</Route>

				{/* Protected Admin Routes */}
				<Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
					<Route element={<DashboardPage />} path="/dashboard" />
					<Route element={<AnnouncementFormPage />} path="/announcement-form" />
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
