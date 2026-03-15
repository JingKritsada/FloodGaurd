import type {
	AnnouncementPriority,
	IncidentCategory,
	IncidentStatus,
} from "@/types/services.types";

import { AlertTriangle, Info, Megaphone, Navigation, PlusCircle, Waves, X } from "lucide-react";

/**
 * Z-Index values for various components in the application.
 */
export const Z_INDEX: Record<string, number> = {
	/** App Nav Bar */
	appNavBar: 5000,

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
 * - Status filter options
 * - Status color mapping
 */
export const taskStatusOptions: { id: "ALL" | IncidentStatus; label: string }[] = [
	{ id: "ALL", label: "ทั้งหมด" },
	{ id: "OPEN", label: "เปิดใหม่" },
	{ id: "IN_PROGRESS", label: "กำลังดำเนินการ" },
	{ id: "RESOLVED", label: "ดำเนินการแล้ว" },
];

export const mapStatusColor: Record<IncidentStatus, string> = {
	OPEN: "bg-red-500 text-white shadow-red-500/20",
	IN_PROGRESS: "bg-amber-500 text-white shadow-amber-500/20",
	RESOLVED: "bg-green-600 text-white shadow-green-600/20",
};

export const mapCategoryLabel: Record<IncidentCategory, string> = {
	MEDICAL: "เจ็บป่วย/พยาบาล",
	SUPPLIES: "อาหาร/น้ำดื่ม",
	EVACUATION: "อพยพคน",
	ROAD_BLOCKED: "เส้นทางถูกตัดขาด",
	RISK_AREA: "พื้นที่เสี่ยงภัย",
	LEVEE_BREACH: "น้ำล้น/ผนังกั้นน้ำพัง",
};

export const mapCategoryIcon: Record<IncidentCategory, React.JSX.Element> = {
	MEDICAL: <PlusCircle size={28} />,
	SUPPLIES: <Navigation size={28} />,
	EVACUATION: <AlertTriangle size={28} />,
	ROAD_BLOCKED: <X size={28} />,
	RISK_AREA: <Waves size={28} />,
	LEVEE_BREACH: <AlertTriangle size={28} />,
};

/**
 * Announcement List Page
 * - Status filter options
 * - Status color mapping
 */
export const announcementPriorityOptions: { id: "ALL" | AnnouncementPriority; label: string }[] = [
	{ id: "ALL", label: "ทั้งหมด" },
	{ id: "HIGH", label: "แจ้งเตือนฉุกเฉิน" },
	{ id: "MEDIUM", label: "แจ้งเตือนสำคัญ" },
	{ id: "LOW", label: "ประกาศทั่วไป" },
];

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
