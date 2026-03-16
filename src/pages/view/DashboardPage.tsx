import type { Incident } from "@/interfaces/services.interfaces";

import { useEffect, useState } from "react";
import { RotateCw } from "lucide-react";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
} from "recharts";

import StatCard from "@/components/CardComponent/StatCard";
import BaseButton from "@/components/BaseComponents/BaseButton";
import { getErrorMessage } from "@/services/api";
import { useAuth } from "@/providers/AuthContext";
import { useTheme } from "@/providers/ThemeContext";
import { useAlert } from "@/providers/AlertContext";
import {
	mapTaskStatusColor,
	taskCategoryOptions,
	taskStatusOptions,
} from "@/constants/pages.constants";
import incidentService from "@/services/incidentService";

export default function DashboardPage(): React.JSX.Element {
	const { theme } = useTheme();
	const { showAlert } = useAlert();
	const { currentRole } = useAuth();

	const [refreshTrigger, setRefreshTrigger] = useState(0);
	const [incidents, setIncidents] = useState<Incident[]>([]);

	useEffect(() => {
		async function fetchIncidents() {
			try {
				const data = await incidentService.getAll();

				setIncidents(data || []);
			} catch (error) {
				showAlert(
					"ข้อผิดพลาด",
					`ไม่สามารถโหลดข้อมูลใบงานได้: ${getErrorMessage(error)}`,
					"error"
				);
			}
		}

		fetchIncidents();
	}, [showAlert, currentRole, refreshTrigger]);

	const COLORS = ["#ef4444", "#f59e0b", "#4CAF50"];
	const isDarkMode =
		theme === "dark" ||
		(theme === "system" &&
			typeof window !== "undefined" &&
			window.matchMedia("(prefers-color-scheme: dark)").matches);

	const statusDataForPie = taskStatusOptions
		.filter((option) => option.id !== "ALL")
		.map((option) => ({
			name: option.label,
			value: incidents.filter((incident) => incident.status === option.id).length,
		}));
	const typeDataForBar = taskCategoryOptions
		.filter((option) => option.id !== "ALL")
		.map((option) => ({
			name: option.label,
			value: incidents.filter((incident) => incident.type === option.id).length,
		}));

	return (
		<div className="h-full overflow-y-auto pb-28">
			{/* Header */}
			<div className="sticky top-0 z-10 flex flex-row items-center justify-between border-b border-slate-200 bg-white/80 p-4 backdrop-blur-lg sm:px-6 dark:border-slate-800 dark:bg-slate-950/80">
				{/* Title */}
				<div className="flex h-full flex-col items-start gap-1">
					<h2 className="text-2xl font-black text-slate-900 dark:text-white">
						ภาพรวมข้อมูลและสถิติ
					</h2>
				</div>

				<div className="flex h-full flex-row items-center justify-start gap-2">
					{/* Refresh Button */}
					<BaseButton
						isIconOnly
						leftIcon={
							<RotateCw
								className="-rotate-90 transition-transform duration-300 hover:rotate-0"
								size={24}
							/>
						}
						size="lg"
						type="submit"
						variant="outline"
						onClick={() => setRefreshTrigger((prev) => prev + 1)}
					/>
				</div>
			</div>

			{/* Content */}
			<div className="flex flex-col gap-4 px-4 py-5 sm:gap-6 sm:px-6">
				{/* Summary Stat Cards */}
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
					{taskStatusOptions.map((option) => (
						<StatCard
							key={option.id}
							id={option.id}
							label={option.label}
							sublabel={option.sublabel}
							value={
								incidents.filter(
									(incident) =>
										option.id === "ALL" || incident.status === option.id
								).length
							}
						/>
					))}
				</div>

				{/* Graphs */}
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					{/* Charts */}
					<div className="flex flex-col justify-between gap-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:p-5 dark:border-slate-800 dark:bg-slate-900">
						<h3 className="text-center text-xl font-bold text-slate-900 dark:text-white">
							ภาพรวมสถานะของเหตุการณ์
						</h3>

						<ResponsiveContainer height={260} width="100%">
							<PieChart>
								<Pie
									cornerRadius={10}
									data={statusDataForPie}
									dataKey="value"
									innerRadius={90}
									outerRadius={115}
									paddingAngle={8}
									stroke="none"
								>
									{statusDataForPie.map((_entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>

								<Tooltip
									contentStyle={{
										borderRadius: "12px",
										border: "none",
										boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
										background: isDarkMode
											? "#1e293b"
											: "rgba(255,255,255,0.9)",
										color: isDarkMode ? "#f8fafc" : "#0f172a",
									}}
									itemStyle={{
										color: isDarkMode ? "#f8fafc" : "#0f172a",
										fontWeight: "bold",
									}}
								/>
							</PieChart>
						</ResponsiveContainer>

						<div className="flex justify-center gap-4">
							{taskStatusOptions
								.filter((option) => option.id !== "ALL")
								.map((option) => (
									<div key={option.id} className="flex items-center gap-2">
										<div
											className={`h-3 w-3 rounded-full ${mapTaskStatusColor[option.id]}`}
										/>
										<span className="text-sm font-medium text-slate-400">
											{option.label}
										</span>
									</div>
								))}
						</div>
					</div>

					{/* Bar */}
					<div className="flex flex-col justify-between gap-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:p-5 dark:border-slate-800 dark:bg-slate-900">
						<h3 className="text-center text-xl font-bold text-slate-900 dark:text-white">
							ภาพรวมประเภทของเหตุการณ์
						</h3>

						<div className="custom-scrollbar w-full items-center overflow-x-auto overflow-y-hidden">
							<div className="mx-auto h-75 w-180">
								<ResponsiveContainer height="100%" width="100%">
									<BarChart data={typeDataForBar}>
										<XAxis
											axisLine={false}
											dataKey="name"
											fontSize={14}
											fontWeight={500}
											stroke={isDarkMode ? "#64748b" : "#94a3b8"}
											strokeWidth={0}
											tickLine={false}
											tickMargin={16}
										/>
										<YAxis hide />
										<Tooltip
											contentStyle={{
												borderRadius: "12px",
												border: "none",
												boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
												background: isDarkMode
													? "#1e293b"
													: "rgba(255,255,255,0.9)",
												color: isDarkMode ? "#f8fafc" : "#0f172a",
											}}
											cursor={{ fill: isDarkMode ? "#334155" : "#f8fafc" }}
											itemStyle={{
												color: isDarkMode ? "#f8fafc" : "#0f172a",
												fontWeight: "bold",
											}}
										/>
										<Bar
											barSize={32}
											dataKey="value"
											fill="#c5a039"
											radius={[8, 8, 8, 8]}
										/>
									</BarChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
