import { MapContainer, Marker, TileLayer } from "react-leaflet";

import { CENTER_LOCATION, userLocationIcon } from "@/constants/components.constants";
import {
	MapUpdater,
	MapInvalidator,
	InitialUserLocator,
	MapReferenceHandler,
	CurrentLocationHandler,
} from "@/utils/components.utils";

export default function MapBoard({
	draggable = true,
	userLocation,
}: {
	draggable: boolean;
	userLocation: { lat: number; lng: number };
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
			<InitialUserLocator onFound={() => {}} />
			<MapReferenceHandler setMapRef={() => {}} />
			<CurrentLocationHandler hasLocation={false} onFound={() => {}} />
			<MapUpdater lat={CENTER_LOCATION.lat} lng={CENTER_LOCATION.lng} />

			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			{/* User Location Marker */}
			{userLocationIcon && (
				<Marker
					icon={userLocationIcon}
					position={userLocation}
					zIndexOffset={1000} // Ensure it sits on top of other markers
				/>
			)}
		</MapContainer>
	);
}
