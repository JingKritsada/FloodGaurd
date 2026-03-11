import type { RoadStatus } from "@/interfaces/incidents.interfaces";

import api from "./api";

export async function fetchRoads(): Promise<RoadStatus[]> {
  const res = await api.get("/roads");
  return (res as RoadStatus[]) || [];
}

export const roadsService = { fetchRoads };
export default roadsService;
