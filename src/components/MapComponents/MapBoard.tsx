import type { MapBoardProps } from "@/interfaces/components.interfaces";

import { useState } from "react";
import { MapContainer, Marker, TileLayer, GeoJSON } from "react-leaflet";

import IncidentMarker from "./IncidentMarker";
import IncidentPolyline from "./IncidentPolyline";

import { Z_INDEX } from "@/constants/pages.constants";
import { MapInvalidator, MapReferenceHandler } from "@/utils/components.utils";
import { CENTER_LOCATION, userLocationIcon } from "@/constants/components.constants";

export default function MapBoard({
	draggable = true,
	incidents = [],
	roads = [],
	shelters = [],
	userLocation,
	onStatusUpdate,
	setMapRef,
}: MapBoardProps): React.JSX.Element {
	const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

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
						<IncidentMarker
							key={incident._id}
							disablePopup={false}
							incident={incident}
							isSelected={selectedIncidentId === incident._id}
							onSelect={setSelectedIncidentId}
							onStatusUpdate={onStatusUpdate}
						/>
					))}

			{/* Incident Paths for Roads Block */}
			{incidents &&
				incidents
					.filter((i) => i.path && i.path.length > 0)
					.map((incident) => (
						<IncidentPolyline
							key={incident._id}
							disablePopup={false}
							incident={incident}
							isSelected={selectedIncidentId === incident._id}
							onSelect={setSelectedIncidentId}
							onStatusUpdate={onStatusUpdate}
						/>
					))}

			{/* Road Markers */}
			{roads && roads.map((_road) => <></>)}

			{/* Shelter Markers */}
			{shelters && shelters.map((_shelter) => <></>)}
		</MapContainer>
	);
}
