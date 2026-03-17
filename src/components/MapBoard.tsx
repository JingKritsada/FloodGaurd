import type { IncidentCategory } from "@/types/services.types";
import type { MapBoardProps } from "@/interfaces/components.interfaces";

import { cloneElement } from "react";
import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { MapContainer, Marker, TileLayer, GeoJSON } from "react-leaflet";

import { MapInvalidator, MapReferenceHandler } from "@/utils/components.utils";
import { CENTER_LOCATION, userLocationIcon } from "@/constants/components.constants";
import { mapCategoryColor, mapCategoryIcon, Z_INDEX } from "@/constants/pages.constants";

export default function MapBoard({
	draggable = true,
	incidents = [],
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
				className={`relative flex h-10 w-10 items-center justify-center rounded-xl border-2 border-white shadow-xl dark:border-slate-900 ${colorClass} ${isPulse ? "" : ""}`}
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
			zoom={13}
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
					opacity: 0.6,
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

			{/* Incident Markers */}
			{incidents &&
				incidents.map((incident) => (
					<Marker
						key={incident._id}
						icon={getIncidentIcon(incident.type, incident.status)}
						position={[incident.location.latitude, incident.location.longitude]}
						zIndexOffset={Z_INDEX.incidentMarker}
					/>
				))}
		</MapContainer>
	);
}
