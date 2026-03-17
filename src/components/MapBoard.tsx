import type { IncidentCategory } from "@/types/services.types";
import type { MapBoardProps } from "@/interfaces/components.interfaces";

import { cloneElement } from "react";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { MapContainer, Marker, TileLayer, GeoJSON, Polyline } from "react-leaflet";

import { MapInvalidator, MapReferenceHandler } from "@/utils/components.utils";
import { CENTER_LOCATION, userLocationIcon } from "@/constants/components.constants";
import { mapCategoryColor, mapCategoryIcon, Z_INDEX } from "@/constants/pages.constants";

export default function MapBoard({
	draggable = true,
	incidents = [],
	roads = [],
	shelters = [],
	userLocation,
	setMapRef,
}: MapBoardProps): React.JSX.Element {
	const getIncidentIcon = (category: string, status: string): L.DivIcon => {
		const baseIconNode = mapCategoryIcon[category as IncidentCategory];
		const colorClass = mapCategoryColor[category as IncidentCategory];
		const isPulse = status === "OPEN";

		const iconNode = cloneElement(baseIconNode, { size: 24 });

		const iconHtml = ReactDOMServer.renderToString(
			<div
				className={`relative flex h-10 w-10 items-center justify-center rounded-xl border-2 border-white text-white shadow-xl dark:border-slate-900 ${colorClass} ${isPulse ? "animate-pulse" : ""}`}
			>
				{iconNode}
			</div>
		);

		return L.divIcon({
			html: iconHtml,
			className: "bg-transparent",
			iconSize: [36, 36],
			iconAnchor: [16, 16],
		});
	};

	return (
		<MapContainer
			center={[CENTER_LOCATION.lat, CENTER_LOCATION.lng]}
			className="h-full w-full"
			dragging={draggable}
			scrollWheelZoom={draggable}
			zoom={15}
			zoomControl={false}
		>
			{/* Map Utils */}
			<MapInvalidator />
			<MapReferenceHandler setMapRef={setMapRef} />

			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			{/* Boundary */}
			<GeoJSON
				data={
					{
						type: "Feature",
						properties: { name: "สุโขทัย" },
						geometry: {
							type: "Polygon",
							coordinates: [
								[
									[99.5, 17.4],
									[99.5, 16.8],
									[100.2, 16.8],
									[100.2, 17.4],
									[99.5, 17.4],
								],
							],
						},
					} as any
				}
				style={() => ({
					fillColor: "#dbb842",
					fillOpacity: 0.05,
					color: "#c5a039",
					weight: 3,
					opacity: 0.8,
					dashArray: "10, 10",
				})}
			/>

			{/* User Location Marker */}
			{userLocationIcon && userLocation && (
				<Marker
					icon={userLocationIcon}
					position={userLocation}
					zIndexOffset={Z_INDEX.userLocationMarker}
				/>
			)}

			{/* Incident Markers Without Road Block */}
			{incidents &&
				incidents
					.filter((incident) => !incident.path || incident.path.length === 0)
					.map((incident) => (
						<Marker
							key={incident._id}
							icon={getIncidentIcon(incident.type, incident.status)}
							position={[incident.location.latitude, incident.location.longitude]}
							zIndexOffset={Z_INDEX.incidentMarker}
						/>
					))}

			{/* Incident Paths for Roads Block */}
			{incidents &&
				incidents
					.filter((i) => i.path && i.path.length > 0)
					.map((incident) => {
						const normalize = (raw: any[]) =>
							raw.map((p) =>
								Array.isArray(p)
									? [p[0], p[1]]
									: [p.lat ?? p.latitude, p.lng ?? p.longitude]
							);
						const positions = normalize(incident.path || []);

						return (
							<Polyline
								key={`path-${incident._id}`}
								pathOptions={{
									color: incident.status === "OPEN" ? "#ef4444" : "#16a34a",
									weight: 4,
									opacity: incident.status === "OPEN" ? 1 : 0.8,
									dashArray: "10, 10",
								}}
								positions={positions}
							/>
						);
					})}

			{/* Road Markers */}
			{roads && roads.map((_road) => <></>)}

			{/* Shelter Markers */}
			{shelters && shelters.map((_shelter) => <></>)}
		</MapContainer>
	);
}
