import type { StatCardProps } from "@/interfaces/components.interfaces";

import { mapTaskStatusColor, mapTaskStatusIcon } from "@/constants/pages.constants";

export default function StatCard({ id, label, sublabel, value }: StatCardProps) {
	return (
		<>
			{/* Mobile */}
			<div className="flex h-full flex-col justify-start gap-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:hidden dark:border-slate-800 dark:bg-slate-900">
				<div className="flex flex-row items-center justify-between gap-3">
					<div
						className={`flex aspect-square rounded-xl p-2.5 ${mapTaskStatusColor[id]}`}
					>
						{mapTaskStatusIcon[id]}
					</div>

					<div className="flex h-full flex-col items-end justify-between">
						<span className="font-mono text-3xl font-bold">{value}</span>
						<span className="text-sm text-slate-500 dark:text-slate-400">รายการ</span>
					</div>
				</div>

				<div className="flex flex-col items-start gap-0">
					<h4 className="line-clamp-1 text-xl font-bold">{label}</h4>
					<span className="line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
						{sublabel}
					</span>
				</div>
			</div>

			{/* Desktop */}
			<div className="hidden h-full flex-row justify-start gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:flex dark:border-slate-800 dark:bg-slate-900">
				<div className="flex flex-col items-end justify-between gap-6">
					<div
						className={`flex aspect-square rounded-xl p-2.5 ${mapTaskStatusColor[id]}`}
					>
						{mapTaskStatusIcon[id]}
					</div>

					<span className="font-mono text-4xl font-bold">{value}</span>
				</div>

				<div className="flex h-full flex-col items-baseline justify-between">
					<div className="flex flex-col items-start justify-center gap-0">
						<h4 className="line-clamp-1 text-xl font-bold">{label}</h4>
						<span className="line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
							{sublabel}
						</span>
					</div>

					<span className="text-sm text-slate-500 dark:text-slate-400">รายการ</span>
				</div>
			</div>
		</>
	);
}
