/**
 * Theme and Font Size Types
 */
export type Theme = "light" | "dark" | "system";
export type FontSize = 80 | 90 | 100 | 110 | 120 | 130 | 140;

/**
 * User Roles
 */
export type Role = "CITIZEN" | "OFFICER" | "ADMIN";

/**
 * App Types
 */
export type ReportType = "SOS" | "TRAFFIC";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";
export type OfficerReportMode = "NONE" | "ROAD_CLOSURE" | "LEVEE" | "GENERAL";
export type AppView = "MAP" | "LIST" | "STATS" | "FORM" | "ANNOUNCEMENTS" | "ANNOUNCEMENT_FORM";
export type IncidentType =
	| "MEDICAL"
	| "EVACUATION"
	| "SUPPLIES"
	| "ROAD_BLOCKED"
	| "RISK_AREA"
	| "LEVEE_BREACH";
