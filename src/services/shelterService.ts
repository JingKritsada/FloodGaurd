import type { ApiOptions, Shelter } from "@/interfaces/services.interfaces";

import api, { apiRequest } from "@/services/api";

// ─── Shelter Functions ────────────────────────────────────────────────────────

/** Get all shelters. */
async function getAll(options?: ApiOptions) {
	return apiRequest(() => api.get<Shelter[]>("/shelters"), options);
}

export default {
	getAll,
};
