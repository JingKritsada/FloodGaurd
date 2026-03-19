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
		const invalidate = () => map.invalidateSize();

		const first = window.setTimeout(invalidate, 0);
		const second = window.setTimeout(invalidate, 200);

		window.addEventListener("resize", invalidate);

		const container = map.getContainer();
		const observer = new ResizeObserver(() => {
			invalidate();
		});

		observer.observe(container);

		return () => {
			window.clearTimeout(first);
			window.clearTimeout(second);
			window.removeEventListener("resize", invalidate);
			observer.disconnect();
		};
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

export function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
	const map = useMap();

	useEffect(() => {
		if (lat !== 0 && lng !== 0) {
			map.invalidateSize();
			map.setView([lat, lng], Math.max(map.getZoom(), 15));
		}
	}, [lat, lng, map]);

	return null;
}
