import "leaflet/dist/leaflet.css";

import { useEffect, useRef, useState } from "react";
import { GeoJSON, MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import type { Feature, Polygon } from "geojson";
import { AlertOctagon, AlertTriangle, Home, LocateFixed, Package, RefreshCw, Stethoscope, Truck, Waves } from "lucide-react";

import type { Incident, Location, RoadStatus, Shelter } from "@/interfaces/incidents.interfaces";
import { DEMO_CENTER } from "@/constants/incidents.constants";
import type { MapFilter } from "@/pages/MapPage/hooks/useMapPage";

const SUKHOTHAI_BOUNDARY: Feature<Polygon> = {
	type: "Feature",
	properties: { name: "สุโขทัย" },
	geometry: { type: "Polygon", coordinates: [[[99.5, 17.4], [99.5, 16.8], [100.2, 16.8], [100.2, 17.4], [99.5, 17.4]]] },
};

const userIcon = L.divIcon({
	html: `<div class="relative flex items-center justify-center"><div class="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping"></div><div class="w-5 h-5 bg-blue-600 border-[3px] border-white rounded-full shadow-lg z-20"></div></div>`,
	className: "bg-transparent",
	iconSize: [48, 48],
	iconAnchor: [24, 24],
});

function createIcon(iconNode: React.ReactNode, bgColor: string, pulse = false) {
	const html = ReactDOMServer.renderToString(
		<div className={`relative flex items-center justify-center w-10 h-10 rounded-xl border-2 border-white shadow-xl ${bgColor} ${pulse ? "animate-pulse" : ""}`}>
			{iconNode}
		</div>
	);
	return L.divIcon({ html, className: "bg-transparent", iconSize: [36, 36], iconAnchor: [16, 16] });
}

function getIncidentIcon(type: string, status: string) {
	const iconMap: Record<string, React.ReactNode> = {
		MEDICAL: <Stethoscope size={20} className="text-white" />,
		EVACUATION: <Truck size={20} className="text-white" />,
		SUPPLIES: <Package size={20} className="text-white" />,
		ROAD_BLOCKED: <AlertOctagon size={20} className="text-white" />,
		LEVEE_BREACH: <Waves size={20} className="text-white" />,
	};
	const colorMap: Record<string, string> = {
		MEDICAL: "bg-rose-500",
		EVACUATION: "bg-sky-500",
		SUPPLIES: "bg-amber-500",
		ROAD_BLOCKED: "bg-slate-700",
		LEVEE_BREACH: "bg-blue-500",
	};
	const icon = iconMap[type] ?? <AlertTriangle size={20} className="text-white" />;
	const color = colorMap[type] ?? "bg-slate-500";
	return createIcon(icon, color, status === "OPEN");
}

const shelterIcon = createIcon(<Home size={18} className="text-white" />, "bg-amber-500");

function MapController({ userPosition }: { userPosition: Location | null }) {
	const map = useMap();
	const controlsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const t = setTimeout(() => map.invalidateSize(), 100);
		return () => clearTimeout(t);
	}, [map]);

	useEffect(() => {
		if (controlsRef.current) {
			L.DomEvent.disableClickPropagation(controlsRef.current);
			L.DomEvent.disableScrollPropagation(controlsRef.current);
		}
	}, []);

	useMapEvents({});

	return (
		<div ref={controlsRef} className="absolute bottom-28 right-4 flex flex-col gap-3 z-[1000] pointer-events-auto">
			<button type="button" onClick={() => map.flyTo([DEMO_CENTER.lat, DEMO_CENTER.lng], 13, { duration: 1.2 })}
				className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center text-slate-500 border border-white/20 active:scale-95 transition-all">
				<RefreshCw size={20} />
			</button>
			<button type="button" onClick={() => { if (userPosition) map.flyTo([userPosition.lat, userPosition.lng], 16, { duration: 1.2 }); }}
				className="w-12 h-12 bg-slate-900 dark:bg-white rounded-2xl shadow-xl flex items-center justify-center text-white dark:text-slate-900 active:scale-95 transition-all">
				<LocateFixed size={20} />
			</button>
		</div>
	);
}

interface MapSectionProps {
	incidents: Incident[];
	roads: RoadStatus[];
	shelters: Shelter[];
	filter: MapFilter;
	onMarkerClick: (incident: Incident) => void;
}

export default function MapSection({ incidents, roads, shelters, filter, onMarkerClick }: MapSectionProps) {
	const [userPosition, setUserPosition] = useState<Location | null>(null);

	useEffect(() => {
		if (!("geolocation" in navigator)) return;
		const id = navigator.geolocation.watchPosition(
			(p) => setUserPosition({ lat: p.coords.latitude, lng: p.coords.longitude }),
			(e) => console.debug("Geo error:", e),
			{ enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
		);
		return () => navigator.geolocation.clearWatch(id);
	}, []);

	const filteredIncidents = filter === "ALL" ? incidents
		: filter === "SOS" ? incidents.filter((i) => ["MEDICAL", "SUPPLIES", "EVACUATION", "RISK_AREA"].includes(i.type))
		: filter === "TRAFFIC" ? incidents.filter((i) => i.type === "ROAD_BLOCKED")
		: filter === "WATER" ? incidents.filter((i) => i.type === "LEVEE_BREACH")
		: [];

	const showRoads = filter === "ALL" || filter === "TRAFFIC";
	const showShelters = filter === "ALL" || filter === "SHELTER";

	return (
		<div className="w-full h-full relative">
			<MapContainer center={[DEMO_CENTER.lat, DEMO_CENTER.lng]} zoom={13} scrollWheelZoom className="w-full h-full" zoomControl={false}>
				<TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
				<GeoJSON data={SUKHOTHAI_BOUNDARY} style={() => ({ fillColor: "#dbb842", fillOpacity: 0.05, color: "#c5a039", weight: 3, opacity: 0.6, dashArray: "10, 10" })} />
				<MapController userPosition={userPosition} />
				{userPosition && <Marker position={[userPosition.lat, userPosition.lng]} icon={userIcon} interactive={false} zIndexOffset={3000} />}
				{showRoads && roads.map((road) => (
					<Polyline key={road.id}
						positions={(road.path ?? [{ lat: road.start.lat, lng: road.start.lng }, { lat: road.end.lat, lng: road.end.lng }]).map((p) => [p.lat, p.lng] as [number, number])}
						pathOptions={{ color: road.status === "CLOSED" ? "#ef4444" : road.status === "HEAVY_VEHICLE" ? "#f59e0b" : "#10b981", weight: 6, opacity: 0.8 }} />
				))}
				{showRoads && filteredIncidents.filter((i) => i.path && i.path.length > 0).map((inc) => (
					<Polyline key={`path-${inc.id}`} positions={(inc.path ?? []).map((p) => [p.lat, p.lng] as [number, number])}
						pathOptions={{ color: "#ef4444", weight: 6, opacity: 0.8, dashArray: inc.status === "OPEN" ? "10, 10" : undefined }}
						eventHandlers={{ click: () => onMarkerClick(inc) }} />
				))}
				{showShelters && shelters.map((s) => (
					<Marker key={s.id} position={[s.location.lat, s.location.lng]} icon={shelterIcon} />
				))}
				{filteredIncidents.filter((i) => !i.path || i.path.length === 0).map((inc) => (
					<Marker key={inc.id} position={[inc.location.lat, inc.location.lng]} icon={getIncidentIcon(inc.type, inc.status)} eventHandlers={{ click: () => onMarkerClick(inc) }} />
				))}
			</MapContainer>
		</div>
	);
}
