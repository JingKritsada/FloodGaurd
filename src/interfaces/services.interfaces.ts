import type {
	AnnouncementPriority,
	IncidentCategory,
	IncidentStatus,
	RoadStatus,
} from "@/types/services.types";

/**
 * API Options — controls behaviour of the apiRequest wrapper.
 */
export interface ApiOptions {
	skipGlobalLoading?: boolean;
}

/**
 * Standard API response wrapper produced by the backend `msg()` helper.
 */
export interface ApiResponse<T = unknown> {
	success: boolean;
	message: string;
	data: T;
}

/**
 * Auth User — matches backend User schema.
 */
export type AuthUser = {
	id: string;
	username: string;
	email?: string | null;
	role?: string | null;
} | null;

/**
 * Login API response — `data` contains the token and user.
 * POST /auth/login
 */
export interface LoginResponse extends ApiResponse<{
	token: string;
	user: { id: string; username: string; email?: string | null; role?: string | null };
}> {}

/**
 * Register API response — `data` is the created user.
 * POST /auth/register
 */
export interface RegisterResponse extends ApiResponse<{
	id: string;
	username: string;
	email?: string | null;
	role?: string | null;
	is_active?: boolean;
}> {}

/**
 * Profile API response — `data` is the user.
 * GET /auth/profile — PUT /auth/profile
 */
export interface ProfileResponse extends ApiResponse<{
	id: string;
	username: string;
	email?: string | null;
	role?: string | null;
}> {}

/**
 * Verify token API response.
 * GET /auth/verify
 */
export interface VerifyTokenResponse extends ApiResponse<{
	valid: boolean;
	user: { userId: string; username: string; role?: string | null };
}> {}

// ─── Incident ─────────────────────────────────────────────────────────────────

export interface Incident {
	_id: string;
	type: IncidentCategory;
	status: IncidentStatus;
	description: string;
	location: { latitude: number; longitude: number };
	reporterName?: string;
	assignedTo?: string;
	path?: { lat: number; lng: number }[];
	image?: string;
	victimCount?: number;
	hasBedridden?: boolean;
	phone?: string;
	address?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateIncidentData {
	type: IncidentCategory;
	status: IncidentStatus;
	description: string;
	location: { latitude: number; longitude: number };
	reporterName?: string;
	phone?: string;
	victimCount?: number;
	hasBedridden?: boolean;
	address?: string;
	image?: string;
	path?: { lat: number; lng: number }[];
}

export interface IncidentFilterParams {
	type?: IncidentCategory;
	status?: IncidentStatus;
	reporterName?: string;
	assignedTo?: string;
	startDate?: string;
	endDate?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

// ─── Road ─────────────────────────────────────────────────────────────────────

export interface Road {
	_id: string;
	path: string;
	status: RoadStatus;
	updatedAt: string;
}

// ─── Shelter ──────────────────────────────────────────────────────────────────

export interface Shelter {
	_id: string;
	name: string;
	capacity: number;
	occupancy: number;
	location: { latitude: number; longitude: number };
	updatedAt: string;
}

// ─── Announcement ─────────────────────────────────────────────────────────────

export interface Announcement {
	_id: string;
	title: string;
	content: string;
	priority: AnnouncementPriority;
	image?: string;
	isPublished: boolean;
	createdBy: string;
	publishedAt?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateAnnouncementData {
	title: string;
	content: string;
	priority: AnnouncementPriority;
	createdBy: string;
	image?: string;
}

export interface UpdateAnnouncementData {
	title?: string;
	content?: string;
	priority?: AnnouncementPriority;
	image?: string;
}
