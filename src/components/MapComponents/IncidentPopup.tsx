import type { IncidentPopupProps } from "@/interfaces/components.interfaces";

import { ArrowRight, Calendar, CircleCheckBig, Clock, List, MapPin, User, X } from "lucide-react";

import BaseButton from "@/components/BaseComponents/BaseButton";
import {
	mapCategoryLabel,
	mapTaskStatusColor,
	mapTaskStatusLabel,
} from "@/constants/pages.constants";
import { useAuth } from "@/providers/AuthContext";

export default function IncidentPopup({
	incident,
	onClose,
}: IncidentPopupProps): React.JSX.Element {
	const { currentRole } = useAuth();

	return (
		<div className="w-90 bg-transparent sm:w-100 md:w-120 lg:w-140">
			<div className="flex flex-col gap-4 p-5">
				{/* Header */}
				<div className="flex items-center justify-between">
					<h3 className="truncate pt-2 text-2xl font-bold text-slate-900 dark:text-white">
						{mapCategoryLabel[incident.type]}
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
				<div className="flex justify-between gap-1.5">
					<span
						className={`w-full rounded-lg px-3 py-2 text-center text-sm font-medium whitespace-nowrap sm:text-base ${mapTaskStatusColor[incident.status]}`}
					>
						{mapTaskStatusLabel[incident.status]}
					</span>

					{incident.hasBedridden && (
						<span className="w-full rounded-lg bg-slate-200 px-3 py-2 text-center text-sm font-medium whitespace-nowrap text-slate-700 sm:text-base dark:bg-slate-700 dark:text-slate-200">
							ผู้ป่วยติดเตียง
						</span>
					)}

					<span className="w-full rounded-lg bg-slate-200 px-3 py-2 text-center font-mono text-sm font-medium whitespace-nowrap text-slate-700 sm:text-base dark:bg-slate-700 dark:text-slate-200">
						#{incident._id.slice(-5)}
					</span>
				</div>

				{/* Detail */}
				<div className="flex flex-col gap-1.5">
					{/* Date and Time Section */}
					<div className="grid grid-cols-2 gap-1.5">
						<div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/50">
							<div className="mb-1 flex items-center gap-2 text-gold-600 dark:text-gold-400">
								<Calendar size={14} />
								<h4 className="text-xs font-bold">วันที่</h4>
							</div>
							<div className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
								{new Date(incident.createdAt).toLocaleDateString("th-TH", {
									day: "numeric",
									month: "short",
									year: "numeric",
								})}
							</div>
						</div>

						<div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/50">
							<div className="mb-1 flex items-center gap-2 text-gold-600 dark:text-gold-400">
								<Clock size={14} />
								<h4 className="text-xs font-bold">เวลา</h4>
							</div>
							<div className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
								{new Date(incident.createdAt).toLocaleTimeString("th-TH", {
									hour: "2-digit",
									minute: "2-digit",
								})}{" "}
								น.
							</div>
						</div>
					</div>

					{/* Reporter Section */}
					<div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/50">
						<div className="mb-1 flex items-center gap-2 text-gold-600 dark:text-gold-400">
							<User size={14} />
							<h4 className="text-xs font-bold">ข้อมูลผู้แจ้งเหตุ</h4>
						</div>
						<div className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
							{incident.reporterName || "พลเมืองดี"} -{" "}
							{incident.phone || "ไม่ทราบเบอร์โทรศัพท์"}
						</div>
					</div>

					{/* Description Section */}
					<div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/50">
						<div className="mb-1 flex items-center gap-2 text-gold-600 dark:text-gold-400">
							<List size={14} />
							<h4 className="text-xs font-bold">รายละเอียดเหตุการณ์</h4>
						</div>
						<div className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
							{incident.description.trim() === ""
								? "ไม่มีรายละเอียดเพิ่มเติม"
								: incident.description}
						</div>
					</div>

					{/* Location Section */}
					{incident.address && (
						<div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/50">
							<div className="mb-1 flex items-center gap-2 text-gold-600 dark:text-gold-400">
								<MapPin size={14} />
								<h4 className="text-xs font-bold">สถานที่เกิดเหตุ</h4>
							</div>
							<div className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
								{incident.address}
							</div>
						</div>
					)}
				</div>

				{/* Action Buttons */}
				<div className="mt-auto flex w-full flex-row items-center gap-1">
					<BaseButton
						className="w-full rounded-lg!"
						// leftIcon={<Navigation size={20} />}
						size="md"
						variant="link"
						onClick={() => {}}
					>
						นำทางด้วย Google Maps
					</BaseButton>

					{(currentRole === "OFFICER" || currentRole === "ADMIN") &&
						incident.status !== "RESOLVED" && (
							<BaseButton
								className="group w-full rounded-lg!"
								rightIcon={
									incident.status === "OPEN" ? (
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
								variant="outline"
								onClick={() => {}}
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
		</div>
	);
}
