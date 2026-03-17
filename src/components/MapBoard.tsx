import { MapContainer, Marker, TileLayer } from "react-leaflet";

import { CENTER_LOCATION, userLocationIcon } from "@/constants/components.constants";
import { MapInvalidator, MapReferenceHandler } from "@/utils/components.utils";

export default function MapBoard({
	draggable = true,
	userLocation,
	setMapRef,
}: {
	draggable: boolean;
	userLocation?: { lat: number; lng: number } | null;
	setMapRef?: (map: L.Map | null) => void;
}): React.JSX.Element {
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

			{/* User Location Marker */}
			{userLocationIcon && userLocation && (
				<Marker
					icon={userLocationIcon}
					position={userLocation}
					zIndexOffset={1000} // Ensure it sits on top of other markers
				/>
			)}
		</MapContainer>
	);
}
