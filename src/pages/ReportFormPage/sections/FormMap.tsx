import type { Location } from "@/interfaces/incidents.interfaces";

import { useEffect } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { MapPin } from "lucide-react";

import { DEMO_CENTER } from "@/constants/incidents.constants";

const draftIcon = L.divIcon({
	html: ReactDOMServer.renderToString(
		<div className="w-8 h-8 bg-amber-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
			<MapPin className="text-white" size={16} />
		</div>
	),
	className: "bg-transparent",
	iconSize: [32, 32],
	iconAnchor: [16, 16],
});

function MapFitter({ points }: { points: Location[] }) {
	const map = useMap();

	useEffect(() => {
		if (points.length === 1) {
			map.setView([points[0].lat, points[0].lng], 16);
		} else if (points.length > 1) {
			const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));

			map.fitBounds(bounds, { padding: [20, 20] });
		}
	}, [map, points]);

	return null;
}

function ClickHandler({
	onMapClick,
	interactive,
}: {
	onMapClick?: (loc: Location) => void;
	interactive: boolean;
}) {
	useMapEvents({
		click(e) {
			if (interactive && onMapClick) {
				onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
			}
		},
	});

	return null;
}

interface FormMapProps {
	interactive?: boolean;
	draftPoints?: Location[];
	singlePoint?: Location | null;
	onMapClick?: (loc: Location) => void;
	height?: string;
	draggable?: boolean;
}

export default function FormMap({
	interactive = false,
	draftPoints = [],
	singlePoint,
	onMapClick,
	height = "h-64",
	draggable = true,
}: FormMapProps) {
	const allPoints = singlePoint ? [singlePoint] : draftPoints;

	return (
		<div
			className={`${height} rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm`}
		>
			<MapContainer
				center={[DEMO_CENTER.lat, DEMO_CENTER.lng]}
				className="w-full h-full"
				dragging={draggable}
				scrollWheelZoom={draggable}
				zoom={13}
				zoomControl={false}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<ClickHandler interactive={interactive} onMapClick={onMapClick} />
				{allPoints.length > 0 && <MapFitter points={allPoints} />}
				{allPoints.map((p, i) => (
					<Marker key={i} icon={draftIcon} position={[p.lat, p.lng]} />
				))}
				{allPoints.length >= 2 && (
					<Polyline
						pathOptions={{ color: "#334155", weight: 4, dashArray: "5, 10" }}
						positions={allPoints.map((p) => [p.lat, p.lng] as [number, number])}
					/>
				)}
				{interactive && allPoints.length === 0 && (
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[400] flex flex-col items-center">
						<div className="animate-bounce">
							<MapPin
								className="text-white drop-shadow-lg"
								fill="#dbb842"
								size={36}
								strokeWidth={2}
							/>
						</div>
					</div>
				)}
			</MapContainer>
		</div>
	);
}
