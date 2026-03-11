import React, { Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import AppBar from "@/components/AppComponents/AppBar";
import BottomNav from "@/components/BottomNav";
import { ThemeProvider } from "@/providers/ThemeContext";
import { AlertProvider } from "@/providers/AlertContext";
import { AuthProvider } from "@/providers/AuthContext";
import ErrorPage from "@/pages/ErrorPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ForbiddenPage from "@/pages/ForbiddenPage";
import ProtectedRoute from "@/routes/ProtectedRoute";

const MapPage = React.lazy(() => import("@/pages/MapPage"));
const IncidentListPage = React.lazy(() => import("@/pages/IncidentListPage"));
const StatsDashboardPage = React.lazy(() => import("@/pages/StatsDashboardPage"));
const ReportFormPage = React.lazy(() => import("@/pages/ReportFormPage"));
const AnnouncementsPage = React.lazy(() => import("@/pages/AnnouncementsPage"));
const AnnouncementFormPage = React.lazy(() => import("@/pages/AnnouncementFormPage"));
const ButtonDemoPage = React.lazy(() => import("@/pages/demo/ButtonDemoPage"));
const AlertDemoPage = React.lazy(() => import("@/pages/demo/AlertDemoPage"));

function PageLoader() {
	return (
		<div className="flex items-center justify-center flex-1 h-full">
			<div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
		</div>
	);
}

function RootLayout() {
	return (
		<ThemeProvider>
			<AlertProvider>
				<AuthProvider>
					<ErrorBoundary>
						<div className="h-screen w-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-300">
							<AppBar />
							<main className="flex-1 relative overflow-hidden flex flex-col">
								<Suspense fallback={<PageLoader />}>
									<Outlet />
								</Suspense>
							</main>
							<BottomNav />
						</div>
					</ErrorBoundary>
				</AuthProvider>
			</AlertProvider>
		</ThemeProvider>
	);
}

export const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		errorElement: (
			<ThemeProvider>
				<AlertProvider>
					<AuthProvider>
						<ErrorBoundary>
							<ErrorPage
								error={new Error("Navigation error")}
								reset={() => window.location.assign("/")}
							/>
						</ErrorBoundary>
					</AuthProvider>
				</AlertProvider>
			</ThemeProvider>
		),
		children: [
			{
				index: true,
				element: (
					<Suspense fallback={<PageLoader />}>
						<MapPage />
					</Suspense>
				),
			},
			{
				path: "list",
				element: (
					<Suspense fallback={<PageLoader />}>
						<IncidentListPage />
					</Suspense>
				),
			},
			{
				element: <ProtectedRoute requiredRoles={["ADMIN"]} />,
				children: [
					{
						path: "stats",
						element: (
							<Suspense fallback={<PageLoader />}>
								<StatsDashboardPage />
							</Suspense>
						),
					},
					{
						path: "announcements/new",
						element: (
							<Suspense fallback={<PageLoader />}>
								<AnnouncementFormPage />
							</Suspense>
						),
					},
					{
						path: "announcements/:id/edit",
						element: (
							<Suspense fallback={<PageLoader />}>
								<AnnouncementFormPage />
							</Suspense>
						),
					},
				],
			},
			{
				path: "report",
				element: (
					<Suspense fallback={<PageLoader />}>
						<ReportFormPage />
					</Suspense>
				),
			},
			{
				path: "announcements",
				element: (
					<Suspense fallback={<PageLoader />}>
						<AnnouncementsPage />
					</Suspense>
				),
			},
			{ path: "login", element: <Navigate replace to="/" /> },
			{ path: "forbidden", element: <ForbiddenPage /> },
			{
				path: "demo/buttons",
				element: (
					<Suspense fallback={<PageLoader />}>
						<ButtonDemoPage />
					</Suspense>
				),
			},
			{
				path: "demo/alerts",
				element: (
					<Suspense fallback={<PageLoader />}>
						<AlertDemoPage />
					</Suspense>
				),
			},
			{ path: "*", element: <NotFoundPage /> },
		],
	},
]);

export default router;
