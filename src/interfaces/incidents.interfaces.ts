import type { IncidentType, TicketStatus } from "@/types/index.types";

export interface Location {
  lat: number;
  lng: number;
}

export interface Incident {
  id: string;
  type: IncidentType;
  status: TicketStatus;
  description: string;
  location: Location;
  timestamp: number;
  reporterName: string;
  assignedTo?: string;
  image?: string;
  path?: Location[];
  victimCount?: number;
  hasBedridden?: boolean;
  phone?: string;
  address?: string;
}

export interface RoadStatus {
  id: string;
  status: "CLOSED" | "HEAVY_VEHICLE" | "NORMAL";
  start: Location;
  end: Location;
  path?: Location[];
}

export interface Shelter {
  id: string;
  name: string;
  capacity: number;
  occupied: number;
  location: Location;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  image?: string;
  isPublished: boolean;
  createdBy: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
