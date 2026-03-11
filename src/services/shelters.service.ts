import type { Shelter } from "@/interfaces/incidents.interfaces";

import api from "./api";

export async function fetchShelters(): Promise<Shelter[]> {
	const res = await api.get("/shelters");

	return Array.isArray(res) ? (res as Shelter[]) : [];
}

export const sheltersService = { fetchShelters };
export default sheltersService;
