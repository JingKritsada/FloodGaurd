import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";

import { type SelectOption } from "@/interfaces/components.interfaces";

/**
 * Filters an array of SelectOption items by matching the label
 * against the provided search query (case-insensitive).
 */
export function filterOptions(options: SelectOption[], query: string): SelectOption[] {
	const normalized = query.trim().toLowerCase();

	if (!normalized) return options;

	return options.filter((option) => option.label.toLowerCase().includes(normalized));
}

/**
 * Utility functions for map-related components, such as MapBoard and MapPage.
 * - MapEvents: Handles map click events to update coordinates.
 * - MapInvalidator: Fixes tile rendering issues by invalidating the map size on mount.
 * - MapReferenceHandler: Provides a way to get the map instance reference for external use.
 */
export function MapEvents({ onChange }: { onChange: (lat: number, lng: number) => void }) {
	useMapEvents({
		click(e) {
			onChange(e.latlng.lat, e.latlng.lng);
		},
	});

	return null;
}

export function MapInvalidator() {
	const map = useMap();

	useEffect(() => {
		const timer = setTimeout(() => {
			map.invalidateSize();
		}, 200);

		return () => clearTimeout(timer);
	}, [map]);

	return null;
}

export function MapReferenceHandler({ setMapRef }: { setMapRef?: (map: L.Map) => void }) {
	const map = useMap();

	useEffect(() => {
		if (setMapRef) {
			setMapRef(map);
		}
	}, [map, setMapRef]);

	return null;
}
