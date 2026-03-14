import type { IncidentCategory, IncidentStatus } from "@/types/services.types";

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
export const statusOptions: { id: "ALL" | IncidentStatus; label: string }[] = [
	{ id: "ALL", label: "ทั้งหมด" },
	{ id: "OPEN", label: "เปิดใหม่" },
	{ id: "IN_PROGRESS", label: "กำลังดำเนินการ" },
	{ id: "RESOLVED", label: "ดำเนินการแล้ว" },
];

export const getStatusColor: Record<IncidentStatus, string> = {
	OPEN: "bg-red-500 text-white shadow-red-500/20",
	IN_PROGRESS: "bg-amber-500 text-white shadow-amber-500/20",
	RESOLVED: "bg-emerald-500 text-white shadow-emerald-500/20",
};

export const getCategoryLabel: Record<IncidentCategory, string> = {
	MEDICAL: "เจ็บป่วย/พยาบาล",
	SUPPLIES: "อาหาร/น้ำดื่ม",
	EVACUATION: "อพยพคน",
	ROAD_BLOCKED: "เส้นทางถูกตัดขาด",
	RISK_AREA: "พื้นที่เสี่ยงภัย",
	LEVEE_BREACH: "น้ำล้น/ผนังกั้นน้ำพัง",
};
