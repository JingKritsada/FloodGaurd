import type {
	ApiOptions,
	CreateIncidentData,
	Incident,
	IncidentFilterParams,
} from "@/interfaces/services.interfaces";
import type { IncidentStatus } from "@/types/services.types";

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

// ─── Incident Functions ───────────────────────────────────────────────────────

/** Get all incidents (paginated). */
async function getAll(page = 1, limit = 100, options?: ApiOptions) {
	return apiRequest(
		() => api.get<Incident[]>(`/incidents${buildQuery({ page, limit })}`),
		options
	);
}

/** Get incidents with advanced filters (basic-auth protected). */
async function getFiltered(params: IncidentFilterParams, options?: ApiOptions) {
	return apiRequest(
		() =>
			api.get<Incident[]>(
				`/incidents/filter${buildQuery(params as unknown as Record<string, unknown>)}`
			),
		options
	);
}

/** Get a single incident by ID. */
async function getById(id: string, options?: ApiOptions) {
	return apiRequest(() => api.get<Incident>(`/incidents/${id}`), options);
}

/** Create a new incident. */
async function create(data: CreateIncidentData, options?: ApiOptions) {
	return apiRequest(() => api.post<Incident>("/incidents", data), options);
}

/** Update an incident's status (officer/admin only). */
async function updateStatus(id: string, newStatus: IncidentStatus, options?: ApiOptions) {
	return apiRequest(
		() => api.patch<Incident>(`/incidents/${id}/status`, { status: newStatus }),
		options
	);
}

export default {
	getAll,
	getFiltered,
	getById,
	create,
	updateStatus,
};
