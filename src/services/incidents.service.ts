import type { Incident, Location } from "@/interfaces/incidents.interfaces";
import type { TicketStatus } from "@/types/index.types";

import { DEFAULT_REPORTER_NAME } from "@/constants/incidents.constants";

import api from "./api";

function normalizePath(rawPath: unknown): Location[] | undefined {
  if (!rawPath || !Array.isArray(rawPath)) return undefined;
  return (rawPath as unknown[]).map((p) => {
    if (Array.isArray(p) && p.length >= 2) return { lat: Number(p[0]), lng: Number(p[1]) };
    const point = p as { lat?: number; lng?: number; latitude?: number; longitude?: number };
    return { lat: point.lat ?? point.latitude ?? 0, lng: point.lng ?? point.longitude ?? 0 };
  });
}

function mapIncident(raw: Record<string, unknown>): Incident {
  const loc = raw.location as { latitude?: number; longitude?: number; lat?: number; lng?: number };
  return {
    id: String(raw._id ?? raw.id ?? Date.now()),
    type: raw.type as Incident["type"],
    status: raw.status as Incident["status"],
    description: String(raw.description ?? ""),
    location: {
      lat: loc?.latitude ?? loc?.lat ?? 0,
      lng: loc?.longitude ?? loc?.lng ?? 0,
    },
    timestamp: new Date(String(raw.createdAt ?? raw.created_at ?? Date.now())).getTime(),
    reporterName: String(raw.reporterName ?? DEFAULT_REPORTER_NAME),
    path: normalizePath(raw.path),
    victimCount: raw.victimCount as number | undefined,
    hasBedridden: raw.hasBedridden as boolean | undefined,
    phone: raw.phone as string | undefined,
    address: raw.address as string | undefined,
  };
}

export async function fetchIncidents(limit = 100): Promise<Incident[]> {
  const res = await api.get(`/incidents?limit=${limit}`);
  return ((res as unknown[]) || []).map((inc) => mapIncident(inc as Record<string, unknown>));
}

export async function updateIncidentStatus(id: string, status: TicketStatus): Promise<void> {
  await api.patch(`/incidents/${id}/status`, { status });
}

export async function createIncident(payload: Record<string, unknown>): Promise<Incident> {
  const res = await api.post("/incidents", payload);
  return mapIncident(res as Record<string, unknown>);
}

export const incidentsService = { fetchIncidents, updateIncidentStatus, createIncident };
export default incidentsService;
