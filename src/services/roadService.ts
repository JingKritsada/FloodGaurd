import type { ApiOptions, Road } from "@/interfaces/services.interfaces";

import api, { apiRequest } from "@/services/api";

// ─── Road Functions ───────────────────────────────────────────────────────────

/** Get all roads. */
async function getAll(options?: ApiOptions) {
	return apiRequest(() => api.get<Road[]>("/roads"), options);
}

export default {
	getAll,
};
