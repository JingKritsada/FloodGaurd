import type { Incident, RoadStatus, Shelter } from "@/interfaces/incidents.interfaces";
import type { TicketStatus } from "@/types/index.types";

import { useEffect, useRef, useState } from "react";

import { incidentsService } from "@/services/incidents.service";
import { roadsService } from "@/services/roads.service";
import { sheltersService } from "@/services/shelters.service";

export type MapFilter = "ALL" | "SOS" | "TRAFFIC" | "SHELTER" | "WATER";

export function useMapPage() {
	const [incidents, setIncidents] = useState<Incident[]>([]);
	const [roads, setRoads] = useState<RoadStatus[]>([]);
	const [shelters, setShelters] = useState<Shelter[]>([]);
	const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
	const [filter, setFilter] = useState<MapFilter>("ALL");
	const [filterToast, setFilterToast] = useState<MapFilter | null>(null);
	const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		incidentsService.fetchIncidents().then(setIncidents).catch(console.error);
		roadsService.fetchRoads().then(setRoads).catch(console.error);
		sheltersService.fetchShelters().then(setShelters).catch(console.error);
	}, []);

	const handleStatusUpdate = async (id: string, status: TicketStatus) => {
		setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
		try {
			await incidentsService.updateIncidentStatus(id, status);
		} catch (e) {
			console.error(e);
		}
	};

	const handleFilterChange = (newFilter: MapFilter) => {
		setFilter(newFilter);
		if (toastTimer.current) clearTimeout(toastTimer.current);
		setFilterToast(newFilter);
		toastTimer.current = setTimeout(() => setFilterToast(null), 2500);
	};

	return {
		incidents,
		roads,
		shelters,
		selectedIncident,
		setSelectedIncident,
		filter,
		filterToast,
		handleStatusUpdate,
		handleFilterChange,
	};
}
