import type { TaskCardProps } from "@/interfaces/components.interfaces";

import {
	AlertTriangle,
	Clock,
	Info,
	MapPin,
	Navigation,
	Phone,
	PlusCircle,
	Users,
	Waves,
	X,
} from "lucide-react";

import BaseButton from "./BaseComponents/BaseButton";

import { getCategoryLabel, getStatusColor } from "@/constants/pages.constants";

export default function TaskCard({
	incident,
	currentRole,
	onActionClick,
	onNavigateClick,
}: TaskCardProps): React.JSX.Element {
	return (
		<div className="flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition-all dark:border-slate-800 dark:bg-[#121623]">
			<div className="item-center flex flex-row justify-between">
				{/* Title */}
				<div className="flex flex-col items-start gap-1">
					<h4 className="truncate text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
						{getCategoryLabel[incident.type] || incident.type}
					</h4>
					<div className="col-span-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
						<Clock size={16} />
						<span className="font-medium">
							{new Date(incident.createdAt).toLocaleString("th-TH", {
								year: "numeric",
								month: "short",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							})}
						</span>
					</div>
				</div>

				{/* Status Icon and ID */}
				<div
					className={`flex aspect-square h-full shrink-0 items-center justify-center rounded-lg shadow-sm ${getStatusColor[incident.status]}`}
				>
					{incident.type === "MEDICAL" && <PlusCircle size={28} />}
					{incident.type === "SUPPLIES" && <Navigation size={28} />}
					{incident.type === "EVACUATION" && <AlertTriangle size={28} />}
					{incident.type === "ROAD_BLOCKED" && <X size={28} />}
					{incident.type === "LEVEE_BREACH" && <Waves size={28} />}
					{incident.type === "RISK_AREA" && <AlertTriangle size={28} />}
				</div>
			</div>

			{/* Description */}
			{incident.description && (
				<p className="line-clamp-2 text-sm leading-snug text-slate-600 dark:text-slate-300">
					{incident.description}
				</p>
			)}

			{/* Additional Info */}
			<div className="flex flex-col gap-1">
				{/* Victim Count */}
				{incident.victimCount !== undefined && incident.victimCount > 0 && (
					<div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
						<Users className="shrink-0" size={16} />
						<span className="font-semibold">{incident.victimCount} คน</span>
					</div>
				)}

				{/* Phone */}
				{incident.phone && (
					<div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
						<Phone className="shrink-0" size={16} />
						<span className="font-medium">{incident.phone}</span>
					</div>
				)}

				{/* Address */}
				{incident.address && (
					<div className="col-span-2 flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
						<MapPin className="shrink-0" size={16} />
						<span className="truncate">{incident.address}</span>
					</div>
				)}
			</div>

			{/* Action Buttons */}
			<div className="flex flex-row items-center gap-3">
				<BaseButton
					className="rounded-xl"
					leftIcon={<Info size={20} />}
					size="md"
					variant="outline"
					onClick={onNavigateClick}
				>
					ดูรายละเอียด
				</BaseButton>
				{(currentRole === "OFFICER" || currentRole === "ADMIN") &&
					incident.status !== "RESOLVED" && (
						<BaseButton
							className="w-full rounded-xl"
							size="md"
							variant="primary"
							onClick={onActionClick}
						>
							{incident.status === "OPEN"
								? currentRole === "ADMIN"
									? "จ่ายงาน"
									: "รับงาน"
								: "ปิดงาน"}
						</BaseButton>
					)}
			</div>
		</div>
	);
}
