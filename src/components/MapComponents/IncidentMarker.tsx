import type { IncidentCategory, IncidentStatus } from "@/types/services.types";
import type { IncidentMarkerProps } from "@/interfaces/components.interfaces";

import L, { type LatLngTuple } from "leaflet";
import ReactDOMServer from "react-dom/server";
import { Marker, Popup, useMap } from "react-leaflet";
import { cloneElement, useEffect, useRef } from "react";

import IncidentPopup from "./IncidentPopup";

import { mapCategoryColor, mapCategoryIcon, Z_INDEX } from "@/constants/pages.constants";

export default function IncidentMarker({
	incident,
	isSelected,
	disablePopup,
	onSelect,
	onStatusUpdate,
}: IncidentMarkerProps): React.JSX.Element {
	const map = useMap();
	const markerRef = useRef<L.Marker>(null);

	const flyToLocation: LatLngTuple = disablePopup
		? [incident.location.latitude, incident.location.longitude]
		: [incident.location.latitude + 0.01, incident.location.longitude];

	useEffect(() => {
		if (isSelected) {
			map.flyTo(flyToLocation, 15, {
				animate: true,
				duration: 1,
			});
		}

		if (markerRef.current) {
			if (isSelected && !disablePopup) {
				// Use setTimeout to ensure the Popup component is mounted and bound
				// before we attempt to open it.
				setTimeout(() => {
					if (markerRef.current && !markerRef.current.isPopupOpen()) {
						markerRef.current.openPopup();
					}
				}, 10);
			} else {
				// Explicitly close popup if not selected.
				markerRef.current.closePopup();
			}
		}
	}, [isSelected, disablePopup, map]);

	const getIncidentIcon = (type: IncidentCategory, status: IncidentStatus) => {
		const baseIconNode = mapCategoryIcon[type];
		const colorClass = mapCategoryColor[type];
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
			iconSize: [40, 40],
			iconAnchor: [20, 20],
			popupAnchor: [0, -20],
		});
	};

	return (
		<Marker
			ref={markerRef}
			eventHandlers={{
				click: (e) => {
					L.DomEvent.stopPropagation(e.originalEvent);
					map.flyTo(flyToLocation, 15, {
						animate: true,
						duration: 1,
					});
					if (onSelect) onSelect(incident._id);
				},
			}}
			icon={getIncidentIcon(incident.type, incident.status)}
			position={[incident.location.latitude, incident.location.longitude]}
			zIndexOffset={Z_INDEX.incidentMarker}
		>
			{!disablePopup && (
				<Popup className="custom-popup" closeButton={false} maxWidth={600} minWidth={600}>
					<IncidentPopup
						incident={incident}
						variant="popup"
						onClose={() => markerRef.current?.closePopup()}
						onStatusUpdate={onStatusUpdate}
					/>
				</Popup>
			)}
		</Marker>
	);
}
