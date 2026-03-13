import { Routes, Route } from "react-router-dom";

import { NotFoundPage } from "@/pages/NotFoundPage";
import { PrivateRoute } from "@/routes/PrivateRoute";
import AlertDemoPage from "@/pages/demo/AlertDemoPage";
import InputDemoPage from "@/pages/demo/InputDemoPage";
import ButtonDemoPage from "@/pages/demo/ButtonDemoPage";
import TaskListPage from "@/pages/view/TaskListPage";
import DashboardPage from "@/pages/view/DashboardPage";
import CreateAnnouncementPage from "@/pages/view/CreateAnnoucementPage";
import MapPage from "@/pages/view/MapPage";
import CreateRequestPage from "@/pages/view/CreateRequestPage";
import CreateIncidentPage from "@/pages/view/CreateIncidentPage";
import AnnouncementListPage from "@/pages/view/AnnoucementListPage";

export default function AppMain() {
	return (
		<main className="relative grow overflow-hidden">
			<Routes>
				{/* Public Routes */}
				<Route element={<MapPage />} path="/" />
				<Route element={<CreateRequestPage />} path="/create-request" />
				<Route element={<CreateIncidentPage />} path="/create-incident" />
				<Route element={<AnnouncementListPage />} path="/announcements" />

				{/* Protected Officer and Admin Routes */}
				<Route element={<PrivateRoute allowedRoles={["ADMIN", "OFFICER"]} />}>
					<Route element={<TaskListPage />} path="/tasks" />
				</Route>

				{/* Protected Admin Routes */}
				<Route element={<PrivateRoute allowedRoles={["ADMIN"]} />}>
					<Route element={<DashboardPage />} path="/dashboard" />
					<Route element={<CreateAnnouncementPage />} path="/create-announcement" />
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
