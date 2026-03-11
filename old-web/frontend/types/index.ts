export type Role = 'CITIZEN' | 'OFFICER' | 'ADMIN';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

export type IncidentType = 'MEDICAL' | 'EVACUATION' | 'SUPPLIES' | 'ROAD_BLOCKED' | 'RISK_AREA' | 'LEVEE_BREACH';

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
  assignedTo?: string; // Officer Name
  image?: string;
  path?: Location[]; // For drawing road closures (polyline)
  victimCount?: number;
  hasBedridden?: boolean;
  phone?: string;
  address?: string;
}

export interface RoadStatus {
  id: string;
  status: 'CLOSED' | 'HEAVY_VEHICLE' | 'NORMAL';
  start: Location;
  end: Location;
  path?: Location[]; // For polyline path
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
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  image?: string;
  isPublished: boolean;
  createdBy: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type AppView = 'MAP' | 'LIST' | 'STATS' | 'FORM' | 'ANNOUNCEMENTS' | 'ANNOUNCEMENT_FORM';
export type OfficerReportMode = 'NONE' | 'ROAD_CLOSURE' | 'LEVEE' | 'GENERAL';
export type ReportType = 'SOS' | 'TRAFFIC';
