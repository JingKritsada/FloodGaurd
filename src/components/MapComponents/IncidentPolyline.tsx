import type { IncidentMarkerProps } from "@/interfaces/components.interfaces";

import L from "leaflet";
import { Polyline, Popup, useMap } from "react-leaflet";
import { useEffect, useRef } from "react";

import IncidentPopup from "./IncidentPopup";

export default function IncidentPolyline({
	incident,
	isSelected,
	disablePopup,
	onSelect,
	onStatusUpdate,
}: IncidentMarkerProps): React.JSX.Element {
	const map = useMap();
	const polylineRef = useRef<L.Polyline>(null);

	useEffect(() => {
		if (polylineRef.current) {
			if (isSelected && !disablePopup) {
				// Use setTimeout to ensure the Popup component is mounted and bound
				// before we attempt to open it.
				setTimeout(() => {
					if (polylineRef.current && !polylineRef.current.isPopupOpen()) {
						polylineRef.current.openPopup();
					}
				}, 10);
			} else {
				// Explicitly close popup if not selected.
				polylineRef.current.closePopup();
			}
		}
	}, [isSelected, disablePopup]);

	const normalize = (raw: any[]) =>
		raw.map((p) =>
			Array.isArray(p) ? [p[0], p[1]] : [p.lat ?? p.latitude, p.lng ?? p.longitude]
		);
	const positions = normalize(incident.path || []);

	return (
		<Polyline
			ref={polylineRef}
			eventHandlers={{
				click: (e) => {
					L.DomEvent.stopPropagation(e.originalEvent);

					// Fly to the clicked location rather than the incident center
					if (e.latlng) {
						map.flyTo([e.latlng.lat + 0.01, e.latlng.lng], 15, {
							animate: true,
							duration: 1,
						});
					}

					if (onSelect) onSelect(incident._id);
				},
			}}
			pathOptions={{
				color: incident.status === "OPEN" ? "#ef4444" : "#16a34a",
				weight: 4,
				opacity: incident.status === "OPEN" ? 1 : 0.8,
				dashArray: "10, 10",
			}}
			positions={positions}
		>
			{!disablePopup && (
				<Popup className="custom-popup" closeButton={false} maxWidth={600} minWidth={600}>
					<IncidentPopup
						incident={incident}
						onClose={() => polylineRef.current?.closePopup()}
						onStatusUpdate={onStatusUpdate}
					/>
				</Popup>
			)}
		</Polyline>
	);
}
