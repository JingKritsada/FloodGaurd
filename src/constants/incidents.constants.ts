export const TYPE_LABELS: Record<string, string> = {
	MEDICAL: "เจ็บป่วย/พยาบาล",
	SUPPLIES: "อาหาร/น้ำดื่ม",
	EVACUATION: "อพยพคน",
	ROAD_BLOCKED: "เส้นทางถูกตัดขาด",
	RISK_AREA: "พื้นที่เสี่ยงภัย",
	LEVEE_BREACH: "น้ำล้น/ผนังกั้นน้ำพัง",
};

export const STATUS_LABELS: Record<string, string> = {
	OPEN: "รอความช่วยเหลือ",
	IN_PROGRESS: "กำลังช่วยเหลือ",
	RESOLVED: "ช่วยเหลือแล้ว",
};

export const FILTER_LABELS: Record<string, string> = {
	ALL: "แสดงทั้งหมด",
	SOS: "เฉพาะขอความช่วยเหลือ",
	TRAFFIC: "เฉพาะสภาพจราจร",
	SHELTER: "เฉพาะศูนย์อพยพ",
	WATER: "เฉพาะระดับน้ำ",
};

export const DEMO_CENTER = { lat: 17.007, lng: 99.826 };

export const ROAD_STATUS_COLORS: Record<string, string> = {
	CLOSED: "#ef4444",
	HEAVY_VEHICLE: "#f59e0b",
	NORMAL: "#10b981",
};

export const DEFAULT_REPORTER_NAME = "พลเมืองดี";
