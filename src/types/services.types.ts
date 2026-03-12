/**
 * Incident types
 */
export type IncidentStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";
export type IncidentCategory =
	| "MEDICAL"
	| "SUPPLIES"
	| "ROAD_BLOCKED"
	| "EVACUATION"
	| "RISK_AREA"
	| "LEVEE_BREACH";

/**
 * Road types
 */
export type RoadStatus = "OPEN" | "CLOSED" | "UNDER_CONSTRUCTION";

/**
 * Announcement types
 */
export type AnnouncementPriority = "HIGH" | "MEDIUM" | "LOW";
