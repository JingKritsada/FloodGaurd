import { AlertCircle, CheckCircle } from "lucide-react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { Incident } from "@/interfaces/incidents.interfaces";
import type { Theme } from "@/types/index.types";

interface Props {
	incidents: Incident[];
	theme: Theme;
}

const PIE_COLORS = ["#ef4444", "#f59e0b", "#10b981"];

export default function StatsChartsSection({ incidents, theme }: Props) {
	const isDark =
		theme === "dark" ||
		(theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches);

	const statusData = [
		{ name: "Critical", value: incidents.filter((i) => i.status === "OPEN").length },
		{ name: "Active", value: incidents.filter((i) => i.status === "IN_PROGRESS").length },
		{ name: "Solved", value: incidents.filter((i) => i.status === "RESOLVED").length },
	];

	const typeData = [
		{ name: "Med", value: incidents.filter((i) => i.type === "MEDICAL").length },
		{ name: "Food", value: incidents.filter((i) => i.type === "SUPPLIES").length },
		{ name: "Evac", value: incidents.filter((i) => i.type === "EVACUATION").length },
		{ name: "Road", value: incidents.filter((i) => i.type === "ROAD_BLOCKED").length },
	];

	const tooltipStyle = {
		borderRadius: "16px",
		border: "none",
		boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
		background: isDark ? "#1e293b" : "rgba(255,255,255,0.9)",
		color: isDark ? "#f8fafc" : "#0f172a",
	};

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
					<h3 className="text-slate-900 dark:text-white font-black text-lg mb-6 tracking-tight">Status Overview</h3>
					<ResponsiveContainer width="100%" height={240}>
						<PieChart>
							<Pie data={statusData} innerRadius={65} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none" cornerRadius={8}>
								{statusData.map((_, index) => <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />)}
							</Pie>
							<Tooltip contentStyle={tooltipStyle} itemStyle={{ color: isDark ? "#f8fafc" : "#0f172a", fontWeight: "bold" }} />
						</PieChart>
					</ResponsiveContainer>
					<div className="flex justify-center gap-6 mt-4">
						{statusData.map((s, i) => (
							<div key={i} className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
								<span className="text-[10px] font-black uppercase text-slate-400">{s.name}</span>
							</div>
						))}
					</div>
				</div>

				<div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
					<h3 className="text-slate-900 dark:text-white font-black text-lg mb-6 tracking-tight">Incident Types</h3>
					<ResponsiveContainer width="100%" height={240}>
						<BarChart data={typeData}>
							<XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} stroke={isDark ? "#64748b" : "#94a3b8"} />
							<YAxis hide />
							<Tooltip cursor={{ fill: isDark ? "#334155" : "#f8fafc" }} contentStyle={tooltipStyle} itemStyle={{ color: isDark ? "#f8fafc" : "#0f172a", fontWeight: "bold" }} />
							<Bar dataKey="value" fill="#c5a039" radius={[8, 8, 8, 8]} barSize={24} />
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>

			<div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
				<h3 className="text-slate-900 dark:text-white font-black text-lg mb-4 tracking-tight">Operations Log</h3>
				<div className="space-y-3">
					<div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20">
						<div className="p-2 bg-amber-500 rounded-xl text-white"><AlertCircle size={18} /></div>
						<div>
							<p className="text-xs font-bold text-amber-900 dark:text-amber-400">Water Level Alert</p>
							<p className="text-[10px] text-amber-700 dark:text-amber-500/80 mt-1">Sukhothai Zone 4 +15cm in last 1hr</p>
						</div>
					</div>
					<div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
						<div className="p-2 bg-emerald-500 rounded-xl text-white"><CheckCircle size={18} /></div>
						<div>
							<p className="text-xs font-bold text-emerald-900 dark:text-emerald-400">Team 2 Deployed</p>
							<p className="text-[10px] text-emerald-700 dark:text-emerald-500/80 mt-1">Medical supplies delivered to Shelter #1</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
