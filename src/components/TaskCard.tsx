import type { Incident } from "@/interfaces/services.interfaces";
import type { TaskCardProps } from "@/interfaces/components.interfaces";

import { ArrowRight, CircleCheckBig, Clock, Info, MapPin, Phone, User, Users } from "lucide-react";

import BaseButton from "./BaseComponents/BaseButton";

import { useAlert } from "@/providers/AlertContext";
import { mapCategoryIcon, mapCategoryLabel, mapStatusColor } from "@/constants/pages.constants";

export default function TaskCard({
	incident,
	currentRole,
	onStatusUpdate,
	onNavigateClick,
}: TaskCardProps): React.JSX.Element {
	const { showConfirm } = useAlert();

	const normalizedIncident: Incident = {
		...incident,
		reporterName: incident.reporterName || "พลเมืองดีไม่ทราบชื่อ",
	};

	const handleActionClick = () => {
		const actionText =
			normalizedIncident.status === "OPEN"
				? currentRole === "ADMIN"
					? "จ่ายงาน"
					: "รับงาน"
				: "ปิดงาน";

		showConfirm(
			"ยืนยันการดำเนินการ",
			`คุณต้องการ${actionText}ใช่หรือไม่?`,
			async () => {
				if (onStatusUpdate) {
					await onStatusUpdate(
						normalizedIncident._id,
						normalizedIncident.status === "OPEN" ? "IN_PROGRESS" : "RESOLVED"
					);
				}
			},
			"success",
			"ยืนยัน",
			"ยกเลิก"
		);
	};

	return (
		<div className="flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition-all dark:border-slate-800 dark:bg-[#121623]">
			<div className="item-center flex flex-row justify-start gap-4">
				{/* Status Icon and ID */}
				<div
					className={`flex aspect-square h-full shrink-0 items-center justify-center rounded-lg shadow-sm ${mapStatusColor[normalizedIncident.status]}`}
				>
					{mapCategoryIcon[normalizedIncident.type]}
				</div>

				{/* Header */}
				<div className="flex min-w-0 flex-col items-start gap-2">
					{/* Category */}
					<h4 className="line-clamp-1 w-full text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
						{mapCategoryLabel[normalizedIncident.type] || normalizedIncident.type}
					</h4>

					{/* Reporter Name */}
					{normalizedIncident.reporterName && (
						<div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
							<User className="shrink-0" size={16} />
							<span className="font-medium">{normalizedIncident.reporterName}</span>
						</div>
					)}
				</div>
			</div>

			{/* Description */}
			{normalizedIncident.description && (
				<p className="line-clamp-2 text-sm leading-snug text-slate-600 dark:text-slate-300">
					{normalizedIncident.description}
				</p>
			)}

			{/* Additional Info */}
			<div className="flex flex-col gap-1">
				{/* Victim Count */}
				{normalizedIncident.victimCount !== undefined &&
					normalizedIncident.victimCount > 0 && (
						<div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
							<Users className="shrink-0 text-amber-500" size={16} />
							<span className="font-semibold">
								{normalizedIncident.victimCount} คน
							</span>
						</div>
					)}

				{/* Phone */}
				{normalizedIncident.phone && (
					<div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
						<Phone className="shrink-0 text-green-500" size={16} />
						<span className="font-medium">{normalizedIncident.phone}</span>
					</div>
				)}

				{/* Created At */}
				{normalizedIncident.createdAt && (
					<div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
						<Clock className="shrink-0 text-purple-500" size={16} />
						<span className="font-medium">
							{new Date(normalizedIncident.createdAt).toLocaleString("th-TH", {
								year: "numeric",
								month: "short",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							})}
						</span>
					</div>
				)}

				{/* Address */}
				{normalizedIncident.address && (
					<div className="col-span-2 flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
						<MapPin className="shrink-0 text-blue-500" size={16} />
						<span className="truncate">{normalizedIncident.address}</span>
					</div>
				)}
			</div>

			{/* Action Buttons */}
			<div className="mt-auto flex w-full flex-row items-center gap-3">
				<BaseButton
					className="w-full rounded-xl"
					leftIcon={<Info size={20} />}
					size="md"
					variant="outline"
					onClick={onNavigateClick}
				>
					ดูรายละเอียด
				</BaseButton>

				{(currentRole === "OFFICER" || currentRole === "ADMIN") &&
					normalizedIncident.status !== "RESOLVED" && (
						<BaseButton
							className="group w-full rounded-xl"
							rightIcon={
								normalizedIncident.status === "OPEN" ? (
									<ArrowRight
										className="transition-transform duration-200 group-hover:translate-x-1"
										size={20}
									/>
								) : (
									<CircleCheckBig
										className="transition-transform duration-200 group-hover:scale-110"
										size={20}
									/>
								)
							}
							size="md"
							variant={normalizedIncident.status === "OPEN" ? "primary" : "success"}
							onClick={handleActionClick}
						>
							{normalizedIncident.status === "OPEN"
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
