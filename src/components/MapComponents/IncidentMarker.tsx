import type { IncidentCategory, IncidentStatus } from "@/types/services.types";
import type { IncidentMarkerProps } from "@/interfaces/components.interfaces";

import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import { Marker, Popup } from "react-leaflet";
import { cloneElement, useEffect, useRef } from "react";

import IncidentPopup from "./IncidentPopup";

import { mapCategoryColor, mapCategoryIcon, Z_INDEX } from "@/constants/pages.constants";

export default function IncidentMarker({
	incident,
	isSelected,
	disablePopup,
	onSelect,
}: IncidentMarkerProps): React.JSX.Element {
	const markerRef = useRef<L.Marker>(null);

	useEffect(() => {
		if (markerRef.current) {
			if (isSelected && !disablePopup) {
				// Check if popup is already open to avoid flickering
				if (!markerRef.current.isPopupOpen()) {
					markerRef.current.openPopup();
				}
			} else {
				// Explicitly close popup if not selected.
				markerRef.current.closePopup();
			}
		}
	}, [isSelected, disablePopup]);

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
			popupAnchor: [0, -25],
		});
	};

	return (
		<Marker
			ref={markerRef}
			eventHandlers={{
				click: (e) => {
					L.DomEvent.stopPropagation(e.originalEvent);
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
						onClose={() => markerRef.current?.closePopup()}
					/>
				</Popup>
			)}
		</Marker>
	);
}
