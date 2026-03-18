import type {
	AnnouncementPriority,
	IncidentCategory,
	IncidentStatus,
} from "@/types/services.types";

import {
	AlertTriangle,
	CircleCheckBig,
	Info,
	Megaphone,
	Package,
	Stethoscope,
	TrafficCone,
	Truck,
	Waves,
} from "lucide-react";

/**
 * Z-Index values for various components in the application.
 */
export const Z_INDEX: Record<string, number> = {
	/** Incident Markers */
	incidentMarkers: 500,

	/** User Location Marker */
	userLocationMarker: 1000,

	/** Map Tool Overlay */
	mapToolOverlay: 2000,

	/** Filter Modal */
	filterModal: 3000,

	/** App Nav Bar */
	appNavBar: 4000,

	/** Mobile Sheet Backdrop */
	mobileSheetBackdrop: 4500,

	/** Mobile Sheet */
	mobileSheet: 5000,

	/** Mobile Nav Backdrop */
	mobileNavBackdrop: 6000,

	/** Mobile Menu */
	mobileMenu: 7000,

	/** App Bar */
	appHeaderBar: 8000,

	/** Alert Modal */
	alertModal: 9000,

	/** Global loading overlay */
	globalLoading: 9999,
};

/**
 * Task List Page
 * - map task status to label
 * - map task status to color
 * - map task status to icon
 * - task status options
 * - map incident category to label
 * - map incident category to icon
 * - map incident category to color
 * - task category options
 */
export const mapTaskStatusLabel: Record<"ALL" | IncidentStatus, string> = {
	ALL: "ทั้งหมด",
	OPEN: "รอการดำเนินการ",
	IN_PROGRESS: "กำลังดำเนินการ",
	RESOLVED: "ดำเนินการแล้ว",
};

export const mapTaskStatusColor: Record<"ALL" | IncidentStatus, string> = {
	ALL: "bg-slate-500 text-white shadow-slate-500/20",
	OPEN: "bg-red-500 text-white shadow-red-500/20",
	IN_PROGRESS: "bg-amber-500 text-white shadow-amber-500/20",
	RESOLVED: "bg-green-500 text-white shadow-green-500/20",
};

export const mapTaskStatusIcon: Record<"ALL" | IncidentStatus, React.JSX.Element> = {
	ALL: <Info size={32} />,
	OPEN: <AlertTriangle size={32} />,
	IN_PROGRESS: <Megaphone size={32} />,
	RESOLVED: <CircleCheckBig size={32} />,
};

export const taskStatusOptions: { id: "ALL" | IncidentStatus; label: string; sublabel: string }[] =
	[
		{ id: "ALL", label: mapTaskStatusLabel.ALL, sublabel: "ใบงานทั้งหมด" },
		{ id: "OPEN", label: mapTaskStatusLabel.OPEN, sublabel: "ใบงานที่ต้องตรวจสอบ" },
		{
			id: "IN_PROGRESS",
			label: mapTaskStatusLabel.IN_PROGRESS,
			sublabel: "ใบงานที่กำลังปฏิบัติงาน",
		},
		{ id: "RESOLVED", label: mapTaskStatusLabel.RESOLVED, sublabel: "ใบงานที่แก้ไขแล้ว" },
	];

export const mapCategoryLabel: Record<IncidentCategory, string> = {
	MEDICAL: "เจ็บป่วย/พยาบาล",
	SUPPLIES: "อาหาร/น้ำดื่ม",
	EVACUATION: "อพยพคน",
	ROAD_BLOCKED: "เส้นทางถูกตัดขาด",
	RISK_AREA: "พื้นที่เสี่ยงภัย",
	LEVEE_BREACH: "น้ำล้น/ผนังกั้นน้ำพัง",
};

export const mapCategoryIcon: Record<IncidentCategory, React.JSX.Element> = {
	MEDICAL: <Stethoscope size={28} />,
	SUPPLIES: <Package size={28} />,
	EVACUATION: <Truck size={28} />,
	ROAD_BLOCKED: <TrafficCone size={28} />,
	RISK_AREA: <AlertTriangle size={28} />,
	LEVEE_BREACH: <Waves size={28} />,
};

export const mapCategoryColor: Record<IncidentCategory, string> = {
	MEDICAL: "bg-rose-500 shadow-rose-500/30",
	EVACUATION: "bg-cyan-500 shadow-cyan-500/30",
	SUPPLIES: "bg-amber-500 shadow-amber-500/30",
	ROAD_BLOCKED: "bg-slate-700 shadow-slate-700/30",
	RISK_AREA: "bg-yellow-500 shadow-yellow-500/30",
	LEVEE_BREACH: "bg-blue-500 shadow-blue-500/30",
};

export const taskCategoryOptions: {
	id: "ALL" | IncidentCategory;
	label: string;
	sublabel: string;
}[] = [
	{ id: "ALL", label: "ทั้งหมด", sublabel: "ใบงานทั้งหมด" },
	{ id: "MEDICAL", label: mapCategoryLabel.MEDICAL, sublabel: "ใบงานด้านสุขภาพ" },
	{ id: "SUPPLIES", label: mapCategoryLabel.SUPPLIES, sublabel: "ใบงานด้านทรัพยากร" },
	{ id: "EVACUATION", label: mapCategoryLabel.EVACUATION, sublabel: "ใบงานด้านการอพยพ" },
	{ id: "ROAD_BLOCKED", label: mapCategoryLabel.ROAD_BLOCKED, sublabel: "ใบงานด้านการขนส่ง" },
	{ id: "RISK_AREA", label: mapCategoryLabel.RISK_AREA, sublabel: "ใบงานด้านความเสี่ยง" },
	{
		id: "LEVEE_BREACH",
		label: mapCategoryLabel.LEVEE_BREACH,
		sublabel: "ใบงานด้านความเสียหายจากน้ำ",
	},
];

/**
 * Announcement List Page
 * - map priority to color
 * - map priority to label
 * - map priority to icon
 * - priority options for filter
 * - priority options for form (exclude "ALL")
 */
export const mapPriorityColor: Record<AnnouncementPriority, string> = {
	HIGH: "bg-red-500 text-white shadow-red-500/20",
	MEDIUM: "bg-amber-500 text-white shadow-amber-500/20",
	LOW: "bg-blue-500 text-white shadow-blue-500/20",
};

export const mapPriorityLabel: Record<AnnouncementPriority, string> = {
	HIGH: "แจ้งเตือนฉุกเฉิน",
	MEDIUM: "แจ้งเตือนสำคัญ",
	LOW: "ประกาศทั่วไป",
};

export const mapPriorityIcon: Record<AnnouncementPriority, React.JSX.Element> = {
	HIGH: <AlertTriangle size={32} />,
	MEDIUM: <Megaphone size={32} />,
	LOW: <Info size={32} />,
};

export const announcementPriorityOptions: { id: "ALL" | AnnouncementPriority; label: string }[] = [
	{ id: "ALL", label: "ทั้งหมด" },
	{ id: "HIGH", label: mapPriorityLabel.HIGH },
	{ id: "MEDIUM", label: mapPriorityLabel.MEDIUM },
	{ id: "LOW", label: mapPriorityLabel.LOW },
];

export const annoucementPriorityOptionsForm: {
	id: AnnouncementPriority;
	label: string;
}[] = [
	{ id: "HIGH", label: mapPriorityLabel.HIGH },
	{ id: "MEDIUM", label: mapPriorityLabel.MEDIUM },
	{ id: "LOW", label: mapPriorityLabel.LOW },
];
