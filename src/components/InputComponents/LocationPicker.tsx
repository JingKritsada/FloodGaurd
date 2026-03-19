import type { LocationPickerProps } from "@/interfaces/components.interfaces";

import L from "leaflet";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

import { MapEvents, MapInvalidator, MapUpdater } from "@/utils/components.utils";

export default function LocationPicker({
	lat,
	lng,
	onChange,
}: LocationPickerProps): React.JSX.Element {
	// Default center Thailand if no coordinates provided
	const center: [number, number] = lat && lng ? [lat, lng] : [13.7563, 100.5018];

	const iconHtml = ReactDOMServer.renderToString(
		<div style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>
			<svg
				className="h-10 w-10"
				fill="#ef4444"
				stroke="white"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
				<circle cx="12" cy="10" fill="white" r="3" />
			</svg>
		</div>
	);

	const customIcon = L.divIcon({
		className: "bg-transparent border-none",
		html: iconHtml,
		iconSize: [40, 40],
		iconAnchor: [20, 40],
	});

	return (
		<div className="relative h-full w-full overflow-hidden text-slate-800">
			<MapContainer center={center} className="h-full w-full" zoom={lat && lng ? 13 : 6}>
				<MapInvalidator />
				<MapUpdater lat={lat} lng={lng} />
				<MapEvents onChange={onChange} />

				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				{lat !== 0 && lng !== 0 && <Marker icon={customIcon} position={[lat, lng]} />}
			</MapContainer>

			<div className="pointer-events-none absolute right-2 bottom-2 z-1000 rounded bg-white/80 p-1 text-xs text-slate-600 dark:bg-slate-800/80 dark:text-slate-300">
				แตะที่แผนที่เพื่อปักหมุด
			</div>
		</div>
	);
}
