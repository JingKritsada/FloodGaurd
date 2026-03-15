import type {
	Announcement,
	ApiOptions,
	CreateAnnouncementData,
	UpdateAnnouncementData,
} from "@/interfaces/services.interfaces";

import api, { apiRequest } from "@/services/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildQuery(params: Record<string, unknown>): string {
	const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);

	if (entries.length === 0) return "";

	return (
		"?" +
		entries
			.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
			.join("&")
	);
}

// ─── Announcement Functions ───────────────────────────────────────────────────

/** Get all published announcements (public, paginated). */
async function getAll(page = 1, limit = 10, options?: ApiOptions) {
	return apiRequest(
		() => api.get<Announcement[]>(`/announcements${buildQuery({ page, limit })}`),
		options
	);
}

/** Get a single announcement by ID (public). */
async function getById(id: string, options?: ApiOptions) {
	return apiRequest(() => api.get<Announcement>(`/announcements/${id}`), options);
}

/** Get all announcements including drafts (admin only). */
async function getAllAdmin(page = 1, limit = 100, options?: ApiOptions) {
	return apiRequest(
		() => api.get<Announcement[]>(`/announcements/admin/all${buildQuery({ page, limit })}`),
		options
	);
}

/** Create a new announcement (admin only). */
async function create(data: CreateAnnouncementData, options?: ApiOptions) {
	return apiRequest(() => api.post<Announcement>("/announcements", data), options);
}

/** Update an announcement (admin only). */
async function update(id: string, data: UpdateAnnouncementData, options?: ApiOptions) {
	return apiRequest(() => api.patch<Announcement>(`/announcements/${id}`, data), options);
}

/** Delete an announcement (admin only). */
async function remove(id: string, options?: ApiOptions) {
	return apiRequest(() => api.delete<{ message: string }>(`/announcements/${id}`), options);
}

/** Publish an announcement (admin only). */
async function publish(id: string, options?: ApiOptions) {
	return apiRequest(() => api.patch<Announcement>(`/announcements/${id}/publish`), options);
}

export default {
	getAll,
	getById,
	getAllAdmin,
	create,
	update,
	remove,
	publish,
};
