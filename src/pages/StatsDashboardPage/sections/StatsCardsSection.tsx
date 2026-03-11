import type { Incident } from "@/interfaces/incidents.interfaces";

import { Activity, AlertCircle, CheckCircle, Shield } from "lucide-react";

interface Props {
	incidents: Incident[];
}

interface StatCardProps {
	icon: React.ReactNode;
	label: string;
	value: number;
	colorClass: string;
	sublabel: string;
}

function StatCard({ icon, label, value, colorClass, sublabel }: StatCardProps) {
	return (
		<div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between h-full">
			<div
				className={`w-10 h-10 rounded-2xl ${colorClass} flex items-center justify-center mb-4 shadow-lg`}
			>
				{icon}
			</div>
			<div>
				<p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">
					{label}
				</p>
				<p className="text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
					{value}
				</p>
				<p className="text-[10px] text-slate-400 mt-2 font-bold">{sublabel}</p>
			</div>
		</div>
	);
}

export default function StatsCardsSection({ incidents }: Props) {
	const open = incidents.filter((i) => i.status === "OPEN").length;
	const inProgress = incidents.filter((i) => i.status === "IN_PROGRESS").length;
	const resolved = incidents.filter((i) => i.status === "RESOLVED").length;

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
			<StatCard
				colorClass="bg-red-500 text-white"
				icon={<AlertCircle size={20} />}
				label="Critical"
				sublabel="Requires Attention"
				value={open}
			/>
			<StatCard
				colorClass="bg-amber-500 text-white"
				icon={<Activity size={20} />}
				label="On Mission"
				sublabel="Team Deployed"
				value={inProgress}
			/>
			<StatCard
				colorClass="bg-emerald-500 text-white"
				icon={<CheckCircle size={20} />}
				label="Solved"
				sublabel="Operations Closed"
				value={resolved}
			/>
			<StatCard
				colorClass="bg-slate-900 dark:bg-white text-white dark:text-slate-900"
				icon={<Shield size={20} />}
				label="Total"
				sublabel="Lifetime Cases"
				value={incidents.length}
			/>
		</div>
	);
}
