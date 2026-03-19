import type { IncidentPopupProps } from "@/interfaces/components.interfaces";

import { ArrowRight, Calendar, CircleCheckBig, Clock, List, MapPin, User, X } from "lucide-react";

import BaseButton from "@/components/BaseComponents/BaseButton";
import {
	mapCategoryLabel,
	mapTaskStatusColor,
	mapTaskStatusLabel,
} from "@/constants/pages.constants";
import { useAuth } from "@/providers/AuthContext";
import { useAlert } from "@/providers/AlertContext";

export default function IncidentPopup({
	incident,
	variant = "popup",
	onClose,
	onStatusUpdate,
}: IncidentPopupProps): React.JSX.Element {
	const { currentRole } = useAuth();
	const { showConfirm } = useAlert();

	const normalizedIncident = {
		...incident,
		phone: incident.phone || "ไม่ทราบเบอร์โทรศัพท์",
		reporterName: incident.reporterName || "พลเมืองดีไม่ทราบชื่อ",
		address: incident.address?.trim() === "" ? "ไม่มีรายละเอียดเพิ่มเติม" : incident.address,
		description:
			incident.description.trim() === "" ? "ไม่มีรายละเอียดเพิ่มเติม" : incident.description,
	};

	const isSheet = variant === "sheet";

	const containerClasses = isSheet
		? "w-full bg-white dark:bg-slate-950 rounded-t-3xl"
		: "w-100 md:w-100 lg:w-120 bg-transparent";

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

				onClose();
			},
			"success",
			"ยืนยัน",
			"ยกเลิก"
		);
	};

	return (
		<div className={containerClasses}>
			<div className={`flex flex-col p-6 ${isSheet ? "gap-6 pb-8" : "gap-4"}`}>
				{/* Header */}
				<div className="flex items-center justify-between">
					<h3 className="truncate pt-2 text-2xl font-bold text-slate-900 dark:text-white">
						{mapCategoryLabel[normalizedIncident.type]}
					</h3>

					{/* Close button for Popup (or Sheet explicit close) */}
					{onClose && (
						<BaseButton
							isIconOnly
							aria-label="Close details"
							leftIcon={<X size={20} />}
							variant="secondary"
							onClick={onClose}
						/>
					)}
				</div>

				{/* Image Gallery */}
				{/* TODO: Implement after image upload functionality is ready */}
				{/* <div className="hidden h-40 w-full items-center justify-center rounded-2xl bg-slate-100 text-slate-400 sm:flex dark:bg-slate-800">
					<Image className="opacity-50" size={40} />
				</div> */}

				{/* Type and Status */}
				<div className="flex justify-between gap-2">
					<span
						className={`w-full rounded-lg px-3 py-2 text-center text-base font-medium whitespace-nowrap ${mapTaskStatusColor[normalizedIncident.status]}`}
					>
						{mapTaskStatusLabel[normalizedIncident.status]}
					</span>

					<span className="w-full rounded-lg bg-slate-200 px-3 py-2 text-center text-base font-medium whitespace-nowrap text-slate-700 dark:bg-slate-700 dark:text-slate-200">
						{normalizedIncident.victimCount
							? `${normalizedIncident.victimCount} คน`
							: "ไม่มีผู้ประสบภัย"}
					</span>

					{normalizedIncident.hasBedridden && (
						<span className="w-full rounded-lg bg-slate-200 px-3 py-2 text-center text-base font-medium whitespace-nowrap text-slate-700 dark:bg-slate-700 dark:text-slate-200">
							ผู้ป่วยติดเตียง
						</span>
					)}
				</div>

				{/* Detail */}
				<div className="flex flex-col gap-2">
					{/* Date and Time Section */}
					<div className="grid grid-cols-2 gap-2">
						<div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
							<div className="mb-1 flex items-center gap-2 text-gold-600 dark:text-gold-400">
								<Calendar size={14} />
								<h4 className="text-xs font-bold">วันที่</h4>
							</div>
							<div className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
								{new Date(normalizedIncident.createdAt).toLocaleDateString(
									"th-TH",
									{
										day: "numeric",
										month: "short",
										year: "numeric",
									}
								)}
							</div>
						</div>

						<div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
							<div className="mb-1 flex items-center gap-2 text-gold-600 dark:text-gold-400">
								<Clock size={14} />
								<h4 className="text-xs font-bold">เวลา</h4>
							</div>
							<div className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
								{new Date(normalizedIncident.createdAt).toLocaleTimeString(
									"th-TH",
									{
										hour: "2-digit",
										minute: "2-digit",
									}
								)}{" "}
								น.
							</div>
						</div>
					</div>

					{/* Reporter Section */}
					<div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
						<div className="mb-1 flex items-center gap-2 text-gold-600 dark:text-gold-400">
							<User size={14} />
							<h4 className="text-xs font-bold">ข้อมูลผู้แจ้งเหตุ</h4>
						</div>
						<div className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
							{normalizedIncident.reporterName} - {normalizedIncident.phone}
						</div>
					</div>

					{/* Description Section */}
					<div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
						<div className="mb-1 flex items-center gap-2 text-gold-600 dark:text-gold-400">
							<List size={14} />
							<h4 className="text-xs font-bold">รายละเอียดเหตุการณ์</h4>
						</div>
						<div className="line-clamp-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
							{normalizedIncident.description}
						</div>
					</div>

					{/* Location Section */}
					<div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
						<div className="mb-1 flex items-center gap-2 text-gold-600 dark:text-gold-400">
							<MapPin size={14} />
							<h4 className="text-xs font-bold">สถานที่เกิดเหตุ</h4>
						</div>
						<div className="line-clamp-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
							{normalizedIncident.address}
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="mt-auto flex w-full flex-row items-center gap-2">
					<BaseButton
						className="w-full rounded-lg!"
						size="lg"
						variant="link"
						onClick={() => {
							window.open(
								`https://www.google.com/maps/dir/?api=1&destination=${normalizedIncident.location.latitude},${normalizedIncident.location.longitude}`,
								"_blank",
								"noopener noreferrer"
							);
						}}
					>
						นำทางด้วย Google Maps
					</BaseButton>

					{(currentRole === "OFFICER" || currentRole === "ADMIN") &&
						normalizedIncident.status !== "RESOLVED" && (
							<BaseButton
								className="group w-full rounded-lg!"
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
								size="lg"
								variant="outline"
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
		</div>
	);
}
