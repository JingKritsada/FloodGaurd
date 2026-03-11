import type { Incident } from "@/interfaces/incidents.interfaces";
import type { TicketStatus } from "@/types/index.types";

import { useEffect, useState } from "react";

import { incidentsService } from "@/services/incidents.service";

export function useIncidentList() {
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

	const handleStatusUpdate = async (id: string, status: TicketStatus) => {
		setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
		try {
			await incidentsService.updateIncidentStatus(id, status);
		} catch (e) {
			console.error(e);
		}
	};

	return { incidents, loading, error, handleStatusUpdate };
}
