import { useEffect, useRef } from "react";
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
 * - CurrentLocationHandler: Relocates the map to the user's current location if no location is set.
 * - MapUpdater: Updates the map view when latitude or longitude props change.
 * - InitialUserLocator: Locates the user's position on initial load without changing the view.
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

export function CurrentLocationHandler({
	hasLocation,
	onFound,
}: {
	hasLocation: boolean;
	onFound: (lat: number, lng: number) => void;
}) {
	const map = useMap();

	useEffect(() => {
		// Only try to locate if no location is set (default 0,0)
		if (!hasLocation) {
			map.locate().on("locationfound", function (e) {
				// map.flyTo(e.latlng, 13); // Let MapUpdater handle the view update
				onFound(e.latlng.lat, e.latlng.lng);
			});
		}
	}, [map, hasLocation, onFound]);

	return null;
}

export function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
	const map = useMap();

	useEffect(() => {
		if (lat !== 0 && lng !== 0) {
			map.flyTo([lat, lng], 15);
		}
	}, [lat, lng, map]);

	return null;
}

export function InitialUserLocator({ onFound }: { onFound?: (lat: number, lng: number) => void }) {
	const map = useMap();
	const initialized = useRef(false);

	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true;
			// Change setView to false so we can control it manually based on nearest orchard
			map.locate({ setView: false, maxZoom: 13 }).on("locationfound", (e) => {
				onFound?.(e.latlng.lat, e.latlng.lng);
			});
		}
	}, [map, onFound]);

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
