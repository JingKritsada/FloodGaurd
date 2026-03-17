import type { Map } from "leaflet";
import type { IncidentCategory } from "@/types/services.types";
import type { Incident, Road, Shelter } from "@/interfaces/services.interfaces";

import { useEffect, useState } from "react";
import { Filter, LocateFixed, Minus, Plus, RefreshCw } from "lucide-react";

import { getErrorMessage } from "@/services/api";
import { useAlert } from "@/providers/AlertContext";
import { Z_INDEX } from "@/constants/pages.constants";
import { CENTER_LOCATION } from "@/constants/components.constants";
import MapBoard from "@/components/MapBoard";
import BaseButton from "@/components/BaseComponents/BaseButton";
import FilterModal from "@/components/ModalComponent/FilterModal";
import incidentService from "@/services/incidentService";
import roadService from "@/services/roadService";
import shelterService from "@/services/shelterService";

export default function MapPage(): React.JSX.Element {
	const [mapRef, setMapRef] = useState<Map | null>(null);
	const [roads, setRoads] = useState<Road[]>([]);
	const [shelters, setShelters] = useState<Shelter[]>([]);
	const [incidents, setIncidents] = useState<Incident[]>([]);
	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
	const [mapFilter, setMapFilter] = useState<IncidentCategory[]>([]);
	const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);

	const { showAlert } = useAlert();

	useEffect(() => {
		async function fetchIncidents() {
			try {
				const roadsData = await roadService.getAll();
				const sheltersData = await shelterService.getAll();
				const incidentsData = await incidentService.getAll();

				setRoads(roadsData || []);
				setShelters(sheltersData || []);
				setIncidents(incidentsData || []);
			} catch (error) {
				showAlert(
					"ข้อผิดพลาด",
					`ไม่สามารถโหลดข้อมูลใบงานได้: ${getErrorMessage(error)}`,
					"error"
				);
			}
		}

		fetchIncidents();
	}, [showAlert]);

	const filteredIncidents = mapFilter.length
		? incidents.filter((incident) => mapFilter.includes(incident.type as IncidentCategory))
		: incidents;

	const activeFilterCount = mapFilter.length;

	const handleLocateUser = () => {
		if (!navigator.geolocation) return;
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const lat = position.coords.latitude;
				const lng = position.coords.longitude;

				setUserPosition({ lat, lng });

				if (mapRef) {
					mapRef.flyTo([lat, lng], 15);
				}
			},
			(error) => {
				showAlert("ข้อผิดพลาด", `ไม่สามารถระบุตำแหน่งของคุณได้: ${error.message}`, "error");
				setUserPosition(null);
			}
		);
	};

	const handleLocateCenter = () => {
		if (mapRef) {
			mapRef.flyTo([CENTER_LOCATION.lat, CENTER_LOCATION.lng], 15);
		}
	};

	const handleZoomIn = () => {
		if (mapRef) {
			mapRef.zoomIn();
		}
	};

	const handleZoomOut = () => {
		if (mapRef) {
			mapRef.zoomOut();
		}
	};

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<div className="relative flex grow overflow-hidden">
				{/* Map */}
				<div className="relative z-0 h-full w-full">
					{/* Placeholder for Map */}
					<MapBoard
						draggable={!isFilterModalOpen}
						incidents={filteredIncidents}
						roads={roads}
						setMapRef={setMapRef}
						shelters={shelters}
						userLocation={userPosition}
					/>
				</div>

				{/* Map Tool Overlay */}
				<div
					className="absolute top-4 right-4 flex flex-col gap-2 sm:right-6"
					style={{ zIndex: Z_INDEX.mapToolOverlay }}
				>
					<BaseButton
						className="p-2.5! shadow-xl"
						leftIcon={<Filter size={24} />}
						size="xl"
						variant="secondary"
						onClick={() => {
							setIsFilterModalOpen(true);
						}}
					>
						{activeFilterCount > 0 && (
							<span className="absolute -top-1 -right-1 flex h-5 w-5 items-start justify-center rounded-full bg-red-500 p-0.75 font-mono text-xs font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
								{activeFilterCount}
							</span>
						)}
					</BaseButton>

					{/* Locate User */}
					<BaseButton
						isIconOnly
						className="p-2.5! shadow-xl"
						leftIcon={<LocateFixed size={24} />}
						size="xl"
						variant="secondary"
						onClick={handleLocateUser}
					/>

					{/* Locate CENTER */}
					<BaseButton
						isIconOnly
						className="group p-2.5! shadow-xl"
						leftIcon={
							<RefreshCw
								className="transition-transform duration-300 group-hover:rotate-90"
								size={24}
							/>
						}
						size="xl"
						variant="secondary"
						onClick={handleLocateCenter}
					/>
				</div>

				{/* Zoom Overlay */}
				<div
					className="absolute top-4 left-4 flex flex-col gap-2 sm:left-6"
					style={{ zIndex: Z_INDEX.mapToolOverlay }}
				>
					{/* Zoom In */}
					<BaseButton
						isIconOnly
						className="p-2.5! shadow-xl"
						leftIcon={<Plus size={24} />}
						size="xl"
						variant="secondary"
						onClick={handleZoomIn}
					/>

					{/* Zoom Out */}
					<BaseButton
						isIconOnly
						className="p-2.5! shadow-xl"
						leftIcon={<Minus size={24} />}
						size="xl"
						variant="secondary"
						onClick={handleZoomOut}
					/>
				</div>
			</div>

			{/* Filter Modal */}
			<FilterModal
				currentFilters={mapFilter}
				isOpen={isFilterModalOpen}
				onApply={(filters) => setMapFilter(filters)}
				onClose={() => setIsFilterModalOpen(false)}
				onReset={() => setMapFilter([])}
			/>
		</div>
	);
}
