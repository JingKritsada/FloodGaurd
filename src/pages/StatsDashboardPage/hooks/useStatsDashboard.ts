import type { Incident } from "@/interfaces/incidents.interfaces";

import { useEffect, useState } from "react";

import { incidentsService } from "@/services/incidents.service";

export function useStatsDashboard() {
	const [incidents, setIncidents] = useState<Incident[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		incidentsService
			.fetchIncidents()
			.then(setIncidents)
			.catch((e: unknown) => setError(String(e)))
			.finally(() => setLoading(false));
	}, []);

	return { incidents, loading, error };
}
